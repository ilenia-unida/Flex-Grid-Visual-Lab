
export type LayoutMode = 'flex' | 'grid';

export interface ChildStyles {
  id: number;
  flexGrow: number;
  flexShrink: number;
  flexBasis: string;
  alignSelf: string;
  gridColumn: string;
  gridRow: string;
}

export interface AppState {
  mode: LayoutMode;
  children: ChildStyles[];
  flexProps: {
    flexDirection: string;
    justifyContent: string;
    alignItems: string;
    flexWrap: string;
    gap: number;
  };
  gridProps: {
    gridTemplateColumns: string;
    gridTemplateRows: string;
    gap: number;
    justifyItems: string;
    alignContent: string;
  };
}

export type ViewportSize = 'mobile' | 'tablet' | 'desktop';
