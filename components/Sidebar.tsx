
import React from 'react';
import { LayoutMode, AppState, ChildStyles } from '../types';
import { Plus, Minus, Box, Settings2, MousePointer2 } from 'lucide-react';

interface SidebarProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  addChild: () => void;
  removeChild: () => void;
  selectedChildId: number | null;
  updateChildStyles: (id: number, styles: Partial<ChildStyles>) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ state, setState, addChild, removeChild, selectedChildId, updateChildStyles }) => {
  const selectedChild = state.children.find(c => c.id === selectedChildId);

  const setMode = (mode: LayoutMode) => setState(prev => ({ ...prev, mode }));

  const updateFlex = (key: string, value: any) => {
    setState(prev => ({
      ...prev,
      flexProps: { ...prev.flexProps, [key]: value }
    }));
  };

  const updateGrid = (key: string, value: any) => {
    setState(prev => ({
      ...prev,
      gridProps: { ...prev.gridProps, [key]: value }
    }));
  };

  const flexBasisOptions = [
    { label: 'Auto', value: 'auto' },
    { label: '0', value: '0' },
    { label: 'Content', value: 'content' },
    { label: 'Max Content', value: 'max-content' },
    { label: 'Min Content', value: 'min-content' },
    { label: 'Fit Content', value: 'fit-content' },
    { label: '25%', value: '25%' },
    { label: '50%', value: '50%' },
    { label: '100%', value: '100%' },
  ];

  return (
    <aside className="w-80 flex flex-col gap-6 overflow-y-auto custom-scrollbar glass rounded-3xl p-6 shadow-xl shrink-0">
      {/* Mode Switcher */}
      <div className="flex bg-slate-200/50 p-1 rounded-2xl border border-white/50 shrink-0">
        <button 
          onClick={() => setMode('flex')}
          className={`flex-1 py-2 px-4 rounded-xl text-sm font-semibold transition-all ${state.mode === 'flex' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Flexbox
        </button>
        <button 
          onClick={() => setMode('grid')}
          className={`flex-1 py-2 px-4 rounded-xl text-sm font-semibold transition-all ${state.mode === 'grid' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
        >
          CSS Grid
        </button>
      </div>

      <div className="space-y-6 flex-1">
        {state.mode === 'flex' ? (
          <div className="space-y-4 animate-in fade-in duration-500">
            <ControlGroup label="Flex Direction">
              <select 
                value={state.flexProps.flexDirection} 
                onChange={(e) => updateFlex('flexDirection', e.target.value)}
                className="w-full bg-white/80 border border-slate-200 rounded-lg p-2 text-sm text-slate-800 shadow-sm focus:ring-2 focus:ring-cyan-500 outline-none"
              >
                <option value="row">row</option>
                <option value="row-reverse">row-reverse</option>
                <option value="column">column</option>
                <option value="column-reverse">column-reverse</option>
              </select>
            </ControlGroup>

            <ControlGroup label="Justify Content">
              <select 
                value={state.flexProps.justifyContent} 
                onChange={(e) => updateFlex('justifyContent', e.target.value)}
                className="w-full bg-white/80 border border-slate-200 rounded-lg p-2 text-sm text-slate-800 shadow-sm focus:ring-2 focus:ring-cyan-500 outline-none"
              >
                <option value="flex-start">flex-start</option>
                <option value="flex-end">flex-end</option>
                <option value="center">center</option>
                <option value="space-between">space-between</option>
                <option value="space-around">space-around</option>
                <option value="space-evenly">space-evenly</option>
              </select>
            </ControlGroup>

            <ControlGroup label="Align Items">
              <select 
                value={state.flexProps.alignItems} 
                onChange={(e) => updateFlex('alignItems', e.target.value)}
                className="w-full bg-white/80 border border-slate-200 rounded-lg p-2 text-sm text-slate-800 shadow-sm focus:ring-2 focus:ring-cyan-500 outline-none"
              >
                <option value="flex-start">flex-start</option>
                <option value="flex-end">flex-end</option>
                <option value="center">center</option>
                <option value="baseline">baseline</option>
                <option value="stretch">stretch</option>
              </select>
            </ControlGroup>

            <ControlGroup label="Gap (px)">
              <div className="flex items-center gap-4">
                <input 
                  type="range" min="0" max="64" 
                  value={state.flexProps.gap}
                  onChange={(e) => updateFlex('gap', parseInt(e.target.value))}
                  className="flex-1 accent-cyan-600"
                />
                <span className="text-xs font-mono text-cyan-700 font-bold w-6 text-right">{state.flexProps.gap}</span>
              </div>
            </ControlGroup>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-500">
            <ControlGroup label="Columns (e.g. 1fr 2fr 1fr)">
              <input 
                type="text" 
                value={state.gridProps.gridTemplateColumns}
                onChange={(e) => updateGrid('gridTemplateColumns', e.target.value)}
                placeholder="1fr 1fr 1fr"
                className="w-full bg-white/80 border border-slate-200 rounded-lg p-2 text-sm text-slate-800 font-mono shadow-sm focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </ControlGroup>

            <ControlGroup label="Align Content">
               <select 
                value={state.gridProps.alignContent} 
                onChange={(e) => updateGrid('alignContent', e.target.value)}
                className="w-full bg-white/80 border border-slate-200 rounded-lg p-2 text-sm text-slate-800 shadow-sm focus:ring-2 focus:ring-cyan-500 outline-none"
              >
                <option value="stretch">stretch</option>
                <option value="center">center</option>
                <option value="start">start</option>
                <option value="end">end</option>
                <option value="space-around">space-around</option>
                <option value="space-between">space-between</option>
              </select>
            </ControlGroup>

            <ControlGroup label="Gap (px)">
              <div className="flex items-center gap-4">
                <input 
                  type="range" min="0" max="64" 
                  value={state.gridProps.gap}
                  onChange={(e) => updateGrid('gap', parseInt(e.target.value))}
                  className="flex-1 accent-cyan-600"
                />
                <span className="text-xs font-mono text-cyan-700 font-bold w-6 text-right">{state.gridProps.gap}</span>
              </div>
            </ControlGroup>
          </div>
        )}

        <div className="pt-4 border-t border-slate-200 space-y-4">
           <div className="flex items-center justify-between">
              <span className="text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent uppercase tracking-wider">Container Boxes</span>
              <div className="flex gap-2">
                <button onClick={removeChild} className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                  <Minus size={14} />
                </button>
                <button onClick={addChild} className="p-1.5 rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-500/20">
                  <Plus size={14} />
                </button>
              </div>
           </div>
        </div>

        {selectedChild ? (
          <div className="p-4 rounded-2xl bg-cyan-50/50 border border-cyan-200 space-y-4 animate-in slide-in-from-bottom-2 duration-300 shadow-sm backdrop-blur-sm">
             <div className="flex items-center justify-between text-cyan-700 border-b border-cyan-100 pb-2">
               <div className="flex items-center gap-2">
                 <Settings2 size={14} className="animate-pulse" />
                 <span className="text-xs font-bold uppercase tracking-wider">Editing Box {state.children.findIndex(c => c.id === selectedChildId) + 1}</span>
               </div>
               <Box size={14} className="text-blue-500" />
             </div>
             
             {state.mode === 'flex' ? (
               <div className="space-y-4">
                  <ControlGroup label="Align Self">
                    <select 
                      value={selectedChild.alignSelf}
                      onChange={(e) => updateChildStyles(selectedChild.id, { alignSelf: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
                    >
                      <option value="auto">auto</option>
                      <option value="flex-start">flex-start</option>
                      <option value="flex-end">flex-end</option>
                      <option value="center">center</option>
                      <option value="baseline">baseline</option>
                      <option value="stretch">stretch</option>
                    </select>
                  </ControlGroup>

                  <div className="flex gap-3 items-start">
                    <div className="flex-1">
                      <ControlGroup label="Flex Grow">
                        <input 
                          type="number" min="0" 
                          value={selectedChild.flexGrow}
                          onChange={(e) => updateChildStyles(selectedChild.id, { flexGrow: parseInt(e.target.value) || 0 })}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 shadow-sm h-9 focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                      </ControlGroup>
                    </div>
                    <div className="flex-1">
                      <ControlGroup label="Flex Shrink">
                        <input 
                          type="number" min="0" 
                          value={selectedChild.flexShrink}
                          onChange={(e) => updateChildStyles(selectedChild.id, { flexShrink: parseInt(e.target.value) || 0 })}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 shadow-sm h-9 focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                      </ControlGroup>
                    </div>
                  </div>

                  <ControlGroup label="Flex Basis">
                    <div className="space-y-2">
                      <select 
                        value={flexBasisOptions.find(o => o.value === selectedChild.flexBasis) ? selectedChild.flexBasis : 'custom'}
                        onChange={(e) => {
                          if (e.target.value !== 'custom') {
                            updateChildStyles(selectedChild.id, { flexBasis: e.target.value });
                          }
                        }}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 shadow-sm outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        {flexBasisOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                        <option value="custom">Custom value...</option>
                      </select>
                      
                      {(!flexBasisOptions.find(o => o.value === selectedChild.flexBasis) || selectedChild.flexBasis === 'custom') && (
                        <input 
                          type="text"
                          value={selectedChild.flexBasis === 'custom' ? '' : selectedChild.flexBasis}
                          onChange={(e) => updateChildStyles(selectedChild.id, { flexBasis: e.target.value })}
                          placeholder="e.g. 150px or 30%"
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 shadow-sm font-mono animate-in fade-in zoom-in-95 duration-200 focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                      )}
                    </div>
                  </ControlGroup>
               </div>
             ) : (
               <div className="space-y-4">
                  <ControlGroup label="Grid Column">
                    <input 
                      type="text" 
                      value={selectedChild.gridColumn}
                      onChange={(e) => updateChildStyles(selectedChild.id, { gridColumn: e.target.value })}
                      placeholder="span 2 / auto"
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-mono shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                  </ControlGroup>
                  <ControlGroup label="Grid Row">
                    <input 
                      type="text" 
                      value={selectedChild.gridRow}
                      onChange={(e) => updateChildStyles(selectedChild.id, { gridRow: e.target.value })}
                      placeholder="1 / 3"
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-mono shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                  </ControlGroup>
               </div>
             )}
          </div>
        ) : (
          <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center gap-2 group cursor-default">
            <MousePointer2 size={20} className="text-slate-300 group-hover:text-cyan-400 transition-colors duration-300" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center leading-relaxed">
              Select a box on the canvas<br/>to edit individual styles
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};

const ControlGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-[10px] font-extrabold bg-gradient-to-r from-cyan-600 to-blue-500 bg-clip-text text-transparent uppercase tracking-widest block drop-shadow-sm h-4 overflow-hidden whitespace-nowrap">
      {label}
    </label>
    <div className="w-full">
      {children}
    </div>
  </div>
);

export default Sidebar;
