import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CategoryButtonProps {
	id: string;
	icon: LucideIcon;
	label: string;
	count?: number;
	onClick: (id: string) => void;
	isActive: boolean;
}

export const CategoryButton: React.FC<CategoryButtonProps> = ({
	id,
	icon: Icon,
	label,
	count,
	onClick,
	isActive,
}) => (
	<button
		onClick={() => onClick(id)}
		className={`relative flex items-center space-x-2 px-4 py-3 rounded-t-lg transition-colors font-medium whitespace-nowrap ${
			isActive
				? 'bg-white text-blue-600 border-t-2 border-blue-600 shadow-sm z-10'
				: 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
		}`}
	>
		<Icon size={18} />
		<span>{label}</span>
		{(count || 0) > 0 && (
			<span className='bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded-full'>
				{count}
			</span>
		)}
	</button>
);
