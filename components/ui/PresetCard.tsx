import React from 'react';
import { Wand2 } from 'lucide-react';

interface PresetCardProps {
	preset: {
		id: string;
		label: string;
		desc: string;
		color: string;
		mods: any;
	};
	onApply: (mods: any) => void;
}

export const PresetCard: React.FC<PresetCardProps> = ({ preset, onApply }) => (
	<div
		onClick={() => onApply(preset.mods)}
		className='cursor-pointer group relative overflow-hidden rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 bg-white'
	>
		<div
			className={`h-24 ${preset.color} flex items-center justify-center relative overflow-hidden`}
		>
			<Wand2 className='text-white/20 absolute -bottom-4 -right-4' size={80} />
			<Wand2 className='text-white relative z-10' size={32} />
		</div>
		<div className='p-3'>
			<h4 className='font-bold text-slate-800 text-sm'>{preset.label}</h4>
			<p className='text-xs text-slate-500 mt-1'>{preset.desc}</p>
		</div>
	</div>
);
