
import React, { useLayoutEffect, useRef, useState } from 'react';
import { AppState, ViewportSize } from '../types';

interface CanvasProps {
  state: AppState;
  viewport: ViewportSize;
  selectedChildId: number | null;
  onSelectChild: (id: number) => void;
}

const Canvas: React.FC<CanvasProps> = ({ state, viewport, selectedChildId, onSelectChild }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const updateScale = () => {
      if (!wrapperRef.current) return;
      if (viewport === 'desktop') {
        setScale(1);
        return;
      }

      const padding = 48; 
      const wrapperWidth = wrapperRef.current.clientWidth - padding;
      const wrapperHeight = wrapperRef.current.clientHeight - padding;
      
      const deviceWidth = (viewport === 'mobile' ? 375 : 768) + 16;
      const deviceHeight = (viewport === 'mobile' ? 667 : 1024) + 16;

      const scaleX = wrapperWidth / deviceWidth;
      const scaleY = wrapperHeight / deviceHeight;
      
      const finalScale = Math.min(scaleX, scaleY);
      setScale(Math.min(finalScale, 1));
    };

    const resizeObserver = new ResizeObserver(updateScale);
    if (wrapperRef.current) resizeObserver.observe(wrapperRef.current);
    updateScale();

    return () => resizeObserver.disconnect();
  }, [viewport]);

  const isFlexRow = state.mode === 'flex' && state.flexProps.flexDirection.includes('row');

  const containerStyle: React.CSSProperties = state.mode === 'flex' ? {
    display: 'flex',
    flexDirection: state.flexProps.flexDirection as any,
    justifyContent: state.flexProps.justifyContent,
    alignItems: state.flexProps.alignItems,
    flexWrap: state.flexProps.flexWrap as any,
    gap: `${state.flexProps.gap}px`,
    width: '100%',
    height: '100%',
  } : {
    display: 'grid',
    gridTemplateColumns: state.gridProps.gridTemplateColumns,
    gridTemplateRows: state.gridProps.gridTemplateRows,
    gap: `${state.gridProps.gap}px`,
    justifyItems: state.gridProps.justifyItems,
    alignContent: state.gridProps.alignContent,
    width: '100%',
    height: '100%',
  };

  const getViewportDimensions = () => {
    switch (viewport) {
      case 'mobile': return { width: '375px', height: '667px' };
      case 'tablet': return { width: '768px', height: '1024px' };
      case 'desktop': return { width: '100%', height: '500px' };
    }
  };

  const { width: vpWidth, height: vpHeight } = getViewportDimensions();

  return (
    <div ref={wrapperRef} className="w-full h-full flex items-center justify-center overflow-hidden p-4">
      <div 
        className="bg-[#0f172a] rounded-[2rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden flex flex-col transition-all duration-500 ease-in-out relative origin-center"
        style={{ 
          width: vpWidth, 
          height: vpHeight, 
          transform: viewport === 'desktop' ? 'none' : `scale(${scale})`,
          flexShrink: 0
        }}
      >
        {viewport === 'desktop' && (
          <div className="h-10 bg-black/40 border-b border-white/10 flex items-center px-4 gap-2 shrink-0">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-rose-500/60" />
              <div className="w-2 h-2 rounded-full bg-amber-500/60" />
              <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
            </div>
            <div className="ml-4 h-5 flex-1 bg-white/5 rounded border border-white/5" />
          </div>
        )}

        <div className="flex-1 p-8 overflow-auto custom-scrollbar relative bg-slate-900/50">
          <div style={containerStyle}>
            {state.children.map((child, index) => {
              const isSelected = selectedChildId === child.id;
              const isStretchActive = (state.flexProps.alignItems === 'stretch' || child.alignSelf === 'stretch');
              
              const childStyle: React.CSSProperties = state.mode === 'flex' ? {
                flexBasis: child.flexBasis,
                alignSelf: child.alignSelf as any,
                flexGrow: 0, // Disabilitato per stabilità
                flexShrink: 0, // Disabilitato per stabilità
                
                // Dimensioni stabili
                // In Row: se stretch, altezza auto. Altrimenti 100px.
                // In Column: se stretch, larghezza auto. Altrimenti 100px.
                height: isFlexRow 
                  ? (isStretchActive ? 'auto' : '100px') 
                  : (child.flexBasis !== 'auto' ? child.flexBasis : '100px'),

                width: isFlexRow
                  ? (child.flexBasis !== 'auto' ? child.flexBasis : '100px')
                  : (isStretchActive ? 'auto' : '100px'),

                minWidth: '80px',
                minHeight: '80px',
              } : {
                gridColumn: child.gridColumn,
                gridRow: child.gridRow,
                height: 'auto',
                minHeight: '100px',
                width: '100%',
              };

              return (
                <div
                  key={child.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectChild(child.id);
                  }}
                  className={`
                    rounded-xl flex items-center justify-center cursor-pointer
                    transition-all duration-300 relative text-center shrink-0
                    ${isSelected ? 'ring-4 ring-cyan-500 z-10 shadow-2xl scale-105' : 'hover:brightness-110 shadow-lg'}
                    bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500
                  `}
                  style={childStyle}
                >
                  <div className="flex flex-col items-center select-none overflow-hidden p-2">
                    <span className="text-sm font-black text-white whitespace-nowrap uppercase">Box {index + 1}</span>
                    <div className="text-[9px] font-mono text-white/40 uppercase tracking-tighter mt-1">
                      {child.flexBasis}
                    </div>
                  </div>
                  
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-xl ring-2 ring-cyan-500">
                      <div className="w-2 h-2 rounded-full bg-cyan-600" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {viewport !== 'desktop' && (
          <div className="h-6 flex items-center justify-center shrink-0">
            <div className="w-16 h-1 bg-slate-700 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;
