import React from 'react';
import { Check } from 'lucide-react';

interface OptionCardProps {
	label: string;
	imageColor: string;
	isActive: boolean;
	onClick: () => void;
	subLabel?: string;
	textColor?: string;
}

export const OptionCard: React.FC<OptionCardProps> = ({
	label,
	imageColor,
	isActive,
	onClick,
	subLabel,
	textColor,
}) => (
	<div
		onClick={onClick}
		className={`cursor-pointer group relative overflow-hidden rounded-xl border-2 transition-all duration-200 flex flex-col ${
			isActive
				? 'border-blue-500 ring-2 ring-blue-200 ring-opacity-50 shadow-md bg-blue-50/30'
				: 'border-slate-200 hover:border-blue-300 hover:shadow-sm'
		}`}
	>
		<div
			className={`h-14 w-full ${imageColor} bg-opacity-30 flex items-center justify-center relative`}
		></div>
		<div className='p-3 bg-white/50 flex-1 flex flex-col justify-center'>
			<h4
				className={`font-medium text-xs sm:text-sm leading-tight ${
					isActive ? 'text-blue-700' : 'text-slate-800'
				}`}
			>
				{label}
			</h4>
			{subLabel && (
				<p
					className={`text-[10px] mt-1 ${
						textColor ? 'opacity-80' : 'text-slate-400'
					}`}
				>
					{subLabel}
				</p>
			)}
		</div>
		{isActive && (
			<div className='absolute top-1 right-1 bg-blue-500 text-white p-1 rounded-full shadow-sm animate-in zoom-in duration-200'>
				<Check size={10} strokeWidth={4} />
			</div>
		)}
	</div>
);
