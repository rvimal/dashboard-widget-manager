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

export interface DashboardWidgetPermissionsConfig {
  canShowDrawer?: boolean;        // Controls FAB button and drawer visibility
  canManageLayout?: boolean;      // Controls layout action buttons (save, reset, delete all)
  canAddWidgets?: boolean;        // Controls add widget section in drawer
  canEditWidgets?: boolean;       // Controls widget header visibility and edit actions
  canDeleteWidgets?: boolean;     // Controls delete button on individual widgets
  canResizeWidgets?: boolean;     // Controls resize functionality
  canDragWidgets?: boolean;       // Controls drag functionality
}
