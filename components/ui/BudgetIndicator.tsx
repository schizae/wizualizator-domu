import React from 'react';
import { Coins } from 'lucide-react';

interface BudgetIndicatorProps {
	score: number;
}

export const BudgetIndicator: React.FC<BudgetIndicatorProps> = ({ score }) => (
	<div
		className='flex items-center space-x-1 text-sm bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200'
		title='Szacunkowy poziom kosztów materiałów'
	>
		<Coins size={14} className='text-slate-500' />
		<div className='flex space-x-0.5'>
			{[1, 2, 3].map((lvl) => (
				<span
					key={lvl}
					className={`font-bold ${
						score >= lvl ? 'text-green-600' : 'text-slate-300'
					}`}
				>
					$
				</span>
			))}
		</div>
	</div>
);
