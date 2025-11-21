export interface WidgetItem {
  x: number;
  y: number;
  rows: number;
  cols: number;
  id: string;
  content?: any;
  title?: string;
  locked?: boolean;
  component?: any; // Component to render inside widget
  dragEnabled?: boolean;
  resizeEnabled?: boolean;
  type?: string; // Widget type identifier
}

export interface WidgetType {
  type: string;
  name: string;
  icon: string;
  component: any;
  defaultConfig: {
    cols: number;
    rows: number;
    title: string;
    content?: any;
  };
}
