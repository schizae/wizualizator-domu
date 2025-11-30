import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CategoryButtonProps {
	id: string;
	icon: LucideIcon;
	label: string;
	count?: number;
	onClick: (id: string) => void;
	isActive: boolean;
	isEnabled?: boolean; // Czy sekcja jest włączona (activeSections)
}

export const CategoryButton: React.FC<CategoryButtonProps> = ({
	id,
	icon: Icon,
	label,
	count,
	onClick,
	isActive,
	isEnabled = true,
}) => {
	// Kolor border-left w zależności od stanu
	const getBorderColor = () => {
		if (isEnabled && count && count > 0) return 'border-l-blue-500'; // ON + ma wybory
		if (isEnabled) return 'border-l-blue-300'; // ON + brak wyborów
		return 'border-l-gray-300'; // OFF
	};

	return (
		<button
			onClick={() => onClick(id)}
			className={`relative flex items-center space-x-2 px-4 py-3 rounded-t-lg transition-all font-medium whitespace-nowrap border-l-4 ${getBorderColor()} ${
				isActive
					? 'bg-white text-blue-600 border-t-2 border-blue-600 shadow-sm z-10'
					: 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
			}`}
		>
			<Icon size={18} />
			<span className='flex items-center gap-1.5'>
				{label}
				{/* Wskaźnik ON/OFF */}
				{isEnabled && <span className='text-green-500 text-xs'>✓</span>}
			</span>
			{/* Badge z liczbą wyborów */}
			{(count || 0) > 0 && (
				<span className='bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full'>
					{count}
				</span>
			)}
		</button>
	);
};
