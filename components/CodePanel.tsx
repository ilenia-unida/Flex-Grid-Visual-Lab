
import React, { useState } from 'react';
import { AppState } from '../types';
import { Copy, Check, Code2, Terminal, Heart } from 'lucide-react';

interface CodePanelProps {
  state: AppState;
}

const CodePanel: React.FC<CodePanelProps> = ({ state }) => {
  const [format, setFormat] = useState<'css' | 'tailwind'>('css');
  const [copied, setCopied] = useState(false);

  const generateCSS = () => {
    if (state.mode === 'flex') {
      let code = `.container {\n  display: flex;\n`;
      code += `  flex-direction: ${state.flexProps.flexDirection};\n`;
      code += `  justify-content: ${state.flexProps.justifyContent};\n`;
      code += `  align-items: ${state.flexProps.alignItems};\n`;
      code += `  flex-wrap: ${state.flexProps.flexWrap};\n`;
      code += `  gap: ${state.flexProps.gap}px;\n}`;
      return code;
    } else {
      let code = `.container {\n  display: grid;\n`;
      code += `  grid-template-columns: ${state.gridProps.gridTemplateColumns};\n`;
      code += `  grid-template-rows: ${state.gridProps.gridTemplateRows};\n`;
      code += `  gap: ${state.gridProps.gap}px;\n`;
      code += `  justify-items: ${state.gridProps.justifyItems};\n`;
      code += `  align-content: ${state.gridProps.alignContent};\n}`;
      return code;
    }
  };

  const generateTailwind = () => {
    if (state.mode === 'flex') {
      let classes = `flex flex-${state.flexProps.flexDirection} `;
      const justifyMap: any = { 'flex-start': 'start', 'flex-end': 'end', 'center': 'center', 'space-between': 'between', 'space-around': 'around', 'space-evenly': 'evenly' };
      const alignMap: any = { 'flex-start': 'start', 'flex-end': 'end', 'center': 'center', 'baseline': 'baseline', 'stretch': 'stretch' };
      classes += `justify-${justifyMap[state.flexProps.justifyContent]} items-${alignMap[state.flexProps.alignItems]} gap-[${state.flexProps.gap}px]`;
      return `<div className="${classes}">\n  ...\n</div>`;
    } else {
      let classes = `grid grid-cols-[${state.gridProps.gridTemplateColumns.replace(/ /g, '_')}] gap-[${state.gridProps.gap}px] `;
      classes += `justify-items-${state.gridProps.justifyItems} content-${state.gridProps.alignContent}`;
      return `<div className="${classes}">\n  ...\n</div>`;
    }
  };

  const currentCode = format === 'css' ? generateCSS() : generateTailwind();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full bg-slate-900/95 backdrop-blur-xl rounded-[2rem] border border-slate-700/50 overflow-hidden flex flex-col shadow-2xl shadow-black/20">
      {/* Header del Box */}
      <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 mr-2">
            <Terminal size={16} className="text-cyan-400" />
            <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Output</span>
          </div>
          <div className="flex bg-slate-800/50 p-1 rounded-xl border border-white/5">
            <button 
              onClick={() => setFormat('css')}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${format === 'css' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              CSS
            </button>
            <button 
              onClick={() => setFormat('tailwind')}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${format === 'tailwind' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Tailwind
            </button>
          </div>
        </div>
        
        <button 
          onClick={handleCopy}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg ${copied ? 'bg-emerald-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'}`}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy Code'}
        </button>
      </div>

      {/* Area Codice */}
      <div className="flex-1 p-6 overflow-auto custom-scrollbar-dark bg-black/20 relative">
        <div className="absolute top-4 right-6 opacity-10 pointer-events-none">
          <Code2 size={80} className="text-white" />
        </div>
        <pre className="text-sm font-mono text-cyan-300 leading-relaxed relative z-10">
          <code>{currentCode}</code>
        </pre>
      </div>

      {/* Footer del Box (Chiusura visiva e firma) */}
      <div className="px-6 py-2 bg-slate-800/30 border-t border-white/5 flex justify-between items-center">
        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Ready to paste</span>
        <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest">
           <span className="text-slate-500">Sviluppato da</span>
           <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Ilenia Unida</span>
           <Heart size={8} className="text-rose-500 fill-rose-500 mx-0.5" />
           <span className="text-slate-400 font-mono">2026</span>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar-dark::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar-dark::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar-dark::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar-dark::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default CodePanel;
