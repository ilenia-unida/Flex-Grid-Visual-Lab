
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

      // Definiamo un margine di sicurezza per non toccare i bordi del contenitore
      const padding = 48; 
      const wrapperWidth = wrapperRef.current.clientWidth - padding;
      const wrapperHeight = wrapperRef.current.clientHeight - padding;
      
      // Dimensioni fisiche simulate (compresi i bordi della cornice)
      const deviceWidth = (viewport === 'mobile' ? 375 : 768) + 16;
      const deviceHeight = (viewport === 'mobile' ? 667 : 1024) + 16;

      const scaleX = wrapperWidth / deviceWidth;
      const scaleY = wrapperHeight / deviceHeight;
      
      // La scala deve adattarsi alla dimensione più restrittiva (solitamente l'altezza)
      const finalScale = Math.min(scaleX, scaleY);
      
      // Non ingrandiamo mai oltre il 100%
      setScale(Math.min(finalScale, 1));
    };

    const resizeObserver = new ResizeObserver(updateScale);
    if (wrapperRef.current) resizeObserver.observe(wrapperRef.current);
    updateScale();

    return () => resizeObserver.disconnect();
  }, [viewport]);

  const containerStyle: React.CSSProperties = state.mode === 'flex' ? {
    display: 'flex',
    flexDirection: state.flexProps.flexDirection as any,
    justifyContent: state.flexProps.justifyContent,
    alignItems: state.flexProps.alignItems,
    flexWrap: state.flexProps.flexWrap as any,
    gap: `${state.flexProps.gap}px`,
  } : {
    display: 'grid',
    gridTemplateColumns: state.gridProps.gridTemplateColumns,
    gridTemplateRows: state.gridProps.gridTemplateRows,
    gap: `${state.gridProps.gap}px`,
    justifyItems: state.gridProps.justifyItems,
    alignContent: state.gridProps.alignContent,
  };

  const getViewportDimensions = () => {
    switch (viewport) {
      case 'mobile': return { width: '375px', height: '667px' };
      case 'tablet': return { width: '768px', height: '1024px' };
      case 'desktop': return { width: '100%', height: '100%' };
    }
  };

  const { width, height } = getViewportDimensions();

  return (
    <div ref={wrapperRef} className="w-full h-full flex items-center justify-center overflow-hidden p-4">
      <div 
        className={`
          bg-[#0f172a] rounded-[2rem] border-[8px] border-slate-800 shadow-2xl 
          overflow-hidden flex flex-col transition-all duration-500 ease-in-out relative
          origin-center
        `}
        style={{ 
          width: width, 
          height: height, 
          transform: viewport === 'desktop' ? 'none' : `scale(${scale})`,
          flexShrink: 0
        }}
      >
        {/* Notch */}
        {viewport !== 'desktop' && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-800 rounded-b-2xl z-30 flex items-center justify-center">
            <div className="w-8 h-1 bg-slate-700 rounded-full" />
          </div>
        )}

        {/* Browser Mockup Header */}
        {viewport === 'desktop' && (
          <div className="h-10 bg-black/40 border-b border-white/10 flex items-center px-4 gap-2 shrink-0">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/40" />
              <div className="w-3 h-3 rounded-full bg-amber-500/40" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/40" />
            </div>
            <div className="ml-4 h-6 flex-1 bg-white/5 rounded-md border border-white/5" />
          </div>
        )}
        
        <div 
          className="flex-1 p-6 relative transition-all duration-300 overflow-auto custom-scrollbar" 
          style={containerStyle}
        >
          {state.children.map((child, index) => {
            const childStyle: React.CSSProperties = state.mode === 'flex' ? {
              flexGrow: child.flexGrow,
              flexShrink: child.flexShrink,
              flexBasis: child.flexBasis,
              alignSelf: child.alignSelf as any,
            } : {
              gridColumn: child.gridColumn,
              gridRow: child.gridRow,
            };

            const isSelected = selectedChildId === child.id;

            return (
              <div
                key={child.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectChild(child.id);
                }}
                className={`
                  min-w-[70px] min-h-[70px] rounded-xl flex items-center justify-center cursor-pointer
                  transition-all duration-300 transform group relative
                  ${isSelected ? 'ring-4 ring-indigo-500 scale-105 z-10 shadow-2xl shadow-indigo-500/40' : 'hover:scale-102'}
                  bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg
                `}
                style={childStyle}
              >
                <span className="text-xl font-bold text-white drop-shadow-md">{index + 1}</span>
                
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-xl ring-2 ring-indigo-500">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Home Bar Indicator */}
        {viewport !== 'desktop' && (
          <div className="h-5 flex items-center justify-center shrink-0">
            <div className="w-16 h-1 bg-slate-700 rounded-full" />
          </div>
        )}
      </div>

      {/* Info Scale Badge */}
      {viewport !== 'desktop' && (
        <div className="absolute bottom-6 right-8 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] font-mono text-gray-400 pointer-events-none">
          {viewport.toUpperCase()} VIEW • {Math.round(scale * 100)}%
        </div>
      )}
    </div>
  );
};

export default Canvas;
