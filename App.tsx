
import React, { useState } from 'react';
import { Smartphone, Tablet, Monitor, LayoutTemplate } from 'lucide-react';
import { AppState, ViewportSize, ChildStyles } from './types';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import CodePanel from './components/CodePanel';

const INITIAL_CHILDREN: ChildStyles[] = [
  { id: 1, flexGrow: 0, flexShrink: 1, flexBasis: '200px', alignSelf: 'auto', gridColumn: 'auto', gridRow: 'auto' },
  { id: 2, flexGrow: 0, flexShrink: 1, flexBasis: '200px', alignSelf: 'auto', gridColumn: 'auto', gridRow: 'auto' },
  { id: 3, flexGrow: 0, flexShrink: 1, flexBasis: '200px', alignSelf: 'auto', gridColumn: 'auto', gridRow: 'auto' },
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    mode: 'flex',
    children: INITIAL_CHILDREN,
    flexProps: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'nowrap',
      gap: 16,
    },
    gridProps: {
      gridTemplateColumns: '1fr 1fr 1fr',
      gridTemplateRows: 'auto',
      gap: 16,
      justifyItems: 'stretch',
      alignContent: 'stretch',
    },
  });

  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);

  const addChild = () => {
    setState(prev => ({
      ...prev,
      children: [
        ...prev.children,
        {
          id: Date.now(),
          flexGrow: 0,
          flexShrink: 1,
          flexBasis: '200px',
          alignSelf: 'auto',
          gridColumn: 'auto',
          gridRow: 'auto',
        }
      ]
    }));
  };

  const removeChild = () => {
    if (state.children.length <= 1) return;
    setState(prev => ({
      ...prev,
      children: prev.children.slice(0, -1)
    }));
    if (selectedChildId === state.children[state.children.length - 1].id) {
      setSelectedChildId(null);
    }
  };

  const updateChildStyles = (id: number, styles: Partial<ChildStyles>) => {
    setState(prev => ({
      ...prev,
      children: prev.children.map(c => c.id === id ? { ...c, ...styles } : c)
    }));
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden p-4 text-slate-800">
      <header className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/30">
            <LayoutTemplate className="text-white" size={20} />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900 hidden sm:block">
            Flex-Grid Visual Lab
          </h1>
        </div>

        <div className="flex bg-white/40 backdrop-blur-md p-1 rounded-xl border border-white shadow-sm">
          <button 
            onClick={() => setViewport('mobile')}
            className={`p-1.5 px-3 rounded-lg transition-all flex items-center gap-2 ${viewport === 'mobile' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Smartphone size={14} />
            <span className="text-[10px] font-bold uppercase hidden md:inline">Mobile</span>
          </button>
          <button 
            onClick={() => setViewport('tablet')}
            className={`p-1.5 px-3 rounded-lg transition-all flex items-center gap-2 ${viewport === 'tablet' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Tablet size={14} />
            <span className="text-[10px] font-bold uppercase hidden md:inline">Tablet</span>
          </button>
          <button 
            onClick={() => setViewport('desktop')}
            className={`p-1.5 px-3 rounded-lg transition-all flex items-center gap-2 ${viewport === 'desktop' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Monitor size={14} />
            <span className="text-[10px] font-bold uppercase hidden md:inline">Desktop</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 gap-4 min-h-0">
        <Sidebar 
          state={state} 
          setState={setState} 
          addChild={addChild} 
          removeChild={removeChild}
          selectedChildId={selectedChildId}
          updateChildStyles={updateChildStyles}
        />

        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <div className="flex-[3] relative bg-white/20 backdrop-blur-[2px] rounded-[2.5rem] border border-white/40 shadow-xl overflow-hidden bg-[radial-gradient(#0ea5e920_1px,transparent_1px)] [background-size:24px_24px]">
             <Canvas 
                state={state} 
                viewport={viewport} 
                selectedChildId={selectedChildId} 
                onSelectChild={setSelectedChildId} 
             />
          </div>
          
          <div className="flex-1 min-h-[140px] max-h-[220px]">
            <CodePanel state={state} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
