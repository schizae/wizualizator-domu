import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { suggestionsMap } from '@/app/data/constants';

interface ChatWindowProps {
	activeTab: string;
	modifications: any;
	isFullscreen: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
	activeTab,
	modifications,
	isFullscreen,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState([
		{
			role: 'system',
			text: 'Cześć! Jestem Twoim wirtualnym architektem. Przełączaj zakładki, a podpowiem Ci odpowiednie pytania.',
		},
	]);
	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [suggestions, setSuggestions] = useState<string[]>([]);

	const chatEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages, isOpen]);

	useEffect(() => {
		setSuggestions(suggestionsMap[activeTab as keyof typeof suggestionsMap] || suggestionsMap['default']);
	}, [activeTab]);

	const handleSubmit = async (e?: React.FormEvent, textOverride?: string) => {
		if (e) e.preventDefault();
		const text = textOverride || input;
		if (!text || !text.trim()) return;

		const userMsg = { role: 'user', text: text };
		setMessages((prev) => [...prev, userMsg]);
		setInput('');
		setIsLoading(true);

		try {
			const context = Object.entries(modifications)
				.filter(([k, v]) => v && (Array.isArray(v) ? v.length > 0 : !!v))
				.map(([k, v]) => `${k}: ${v}`)
				.join(', ');
			const fullPrompt = `Jesteś architektem. Projekt użytkownika: [${context}]. Pytanie: "${userMsg.text}". Doradź krótko i konkretnie w języku polskim.`;

			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ prompt: fullPrompt }),
			});
			const data = await response.json();

			setMessages((prev) => [
				...prev,
				{ role: 'system', text: data.text || 'Błąd połączenia.' },
			]);
		} catch (err) {
			setMessages((prev) => [
				...prev,
				{ role: 'system', text: 'Wystąpił błąd.' },
			]);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div
			className={`fixed bottom-6 right-6 z-40 flex flex-col items-end transition-all duration-300 ${
				isOpen ? 'w-80 md:w-96' : 'w-auto'
			}`}
		>
			{isOpen && (
				<div className='bg-white rounded-2xl shadow-2xl border border-slate-200 w-full mb-4 overflow-hidden animate-in slide-in-from-bottom-10'>
					<div className='bg-slate-800 text-white p-3 flex justify-between items-center'>
						<div className='flex items-center space-x-2'>
							<MessageSquare size={18} />
							<span className='font-bold text-sm'>AI Architekt</span>
						</div>
						<button
							onClick={() => setIsOpen(false)}
							className='hover:bg-slate-700 p-1 rounded'
						>
							<X size={16} />
						</button>
					</div>
					<div className='h-80 overflow-y-auto p-4 bg-slate-50 space-y-3 custom-scrollbar'>
						{messages.map((msg, i) => (
							<div
								key={i}
								className={`flex ${
									msg.role === 'user' ? 'justify-end' : 'justify-start'
								}`}
							>
								<div
									className={`max-w-[85%] rounded-2xl p-3 text-sm ${
										msg.role === 'user'
											? 'bg-blue-600 text-white rounded-br-none'
											: 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
									}`}
								>
									{msg.text}
								</div>
							</div>
						))}
						{isLoading && (
							<div className='text-xs text-slate-400 p-2'>Piszę...</div>
						)}
						<div ref={chatEndRef}></div>
					</div>
					<div className='px-3 pb-2 flex gap-2 overflow-x-auto scrollbar-hide bg-white border-t border-slate-50 pt-2'>
						{suggestions.map((s, i) => (
							<button
								key={i}
								onClick={(e) => handleSubmit(e, s)}
								className='whitespace-nowrap bg-blue-50 text-blue-600 text-xs px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors border border-blue-100 flex-shrink-0'
							>
								{s}
							</button>
						))}
					</div>
					<form
						onSubmit={(e) => handleSubmit(e)}
						className='p-3 bg-white border-t border-slate-100 flex space-x-2'
					>
						<input
							type='text'
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder='Zapytaj...'
							className='flex-1 text-sm bg-slate-100 border-none rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
						/>
						<button
							type='submit'
							disabled={isLoading || !input.trim()}
							className='bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors'
						>
							<Send size={18} />
						</button>
					</form>
				</div>
			)}
			{!isFullscreen && (
				<button
					onClick={() => setIsOpen(!isOpen)}
					className={`shadow-xl flex items-center justify-center rounded-full transition-all duration-300 ${
						isOpen
							? 'w-12 h-12 bg-slate-600 text-white'
							: 'w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-105'
					}`}
				>
					{isOpen ? <X size={24} /> : <MessageSquare size={28} />}
				</button>
			)}
		</div>
	);
};
