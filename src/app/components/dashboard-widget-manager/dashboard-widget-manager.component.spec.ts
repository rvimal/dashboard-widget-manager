import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardWidgetManagerComponent } from './dashboard-widget-manager.component';
import { WidgetItem, WidgetType } from '../../models/widget.model';
import { GridsterModule } from 'angular-gridster2';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DashboardWidgetManagerComponent', () => {
  let component: DashboardWidgetManagerComponent;
  let fixture: ComponentFixture<DashboardWidgetManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardWidgetManagerComponent],
      imports: [GridsterModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardWidgetManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default permissions', () => {
    expect(component.permissions.canShowDrawer).toBe(true);
    expect(component.permissions.canManageLayout).toBe(true);
    expect(component.permissions.canAddWidgets).toBe(true);
    expect(component.permissions.canEditWidgets).toBe(true);
    expect(component.permissions.canDeleteWidgets).toBe(true);
    expect(component.permissions.canResizeWidgets).toBe(true);
    expect(component.permissions.canDragWidgets).toBe(true);
  });

  it('should initialize with empty widgets array', () => {
    expect(component.widgets).toEqual([]);
  });

  it('should open drawer when openDrawer is called', () => {
    component.openDrawer();
    expect(component.drawerOpen).toBe(true);
  });

  it('should close drawer when closeDrawer is called', () => {
    component.drawerOpen = true;
    component.closeDrawer();
    expect(component.drawerOpen).toBe(false);
  });

  it('should add a widget with specified type', () => {
    const mockWidgetType: WidgetType = {
      type: 'chart',
      name: 'Chart Widget',
      icon: 'chart',
      component: null,
      defaultConfig: {
        cols: 2,
        rows: 2,
        title: 'Chart'
      }
    };

    const initialLength = component.widgets.length;
    component.addWidget(mockWidgetType);

    expect(component.widgets.length).toBe(initialLength + 1);
    expect(component.widgets[0].type).toBe('chart');
    expect(component.widgets[0].title).toBe('Chart');
    expect(component.widgets[0].cols).toBe(2);
    expect(component.widgets[0].rows).toBe(2);
  });

  it('should add a default widget when no type is specified', () => {
    component.addWidget();

    expect(component.widgets.length).toBe(1);
    expect(component.widgets[0].type).toBe('default');
    expect(component.widgets[0].title).toBe('New Widget');
    expect(component.widgets[0].cols).toBe(2);
    expect(component.widgets[0].rows).toBe(2);
  });

  it('should remove widget by id', () => {
    const widget: WidgetItem = {
      x: 0,
      y: 0,
      cols: 2,
      rows: 2,
      id: 'test-widget-1',
      type: 'test'
    };

    component.widgets = [widget];
    component.removeWidget('test-widget-1');

    expect(component.widgets.length).toBe(0);
  });

  it('should not remove widget with non-existent id', () => {
    const widget: WidgetItem = {
      x: 0,
      y: 0,
      cols: 2,
      rows: 2,
      id: 'test-widget-1',
      type: 'test'
    };

    component.widgets = [widget];
    component.removeWidget('non-existent-id');

    expect(component.widgets.length).toBe(1);
  });

  it('should toggle widget lock state', () => {
    const widget: WidgetItem = {
      x: 0,
      y: 0,
      cols: 2,
      rows: 2,
      id: 'test-widget-1',
      type: 'test',
      locked: false
    };

    component.toggleLock(widget);
    expect(widget.locked).toBe(true);
    expect(widget.dragEnabled).toBe(false);
    expect(widget.resizeEnabled).toBe(false);

    component.toggleLock(widget);
    expect(widget.locked).toBe(false);
    expect(widget.dragEnabled).toBe(true);
    expect(widget.resizeEnabled).toBe(true);
  });

  it('should emit widgetsChange when adding a widget', () => {
    jest.spyOn(component.widgetsChange, 'emit');

    component.addWidget();

    expect(component.widgetsChange.emit).toHaveBeenCalledWith(component.widgets);
  });

  it('should emit onSaveLayout when saveLayout is called', () => {
    jest.spyOn(component.onSaveLayout, 'emit');

    component.saveLayout();

    expect(component.onSaveLayout.emit).toHaveBeenCalledWith(component.widgets);
  });

  it('should emit onResetLayout when resetLayout is confirmed', () => {
    jest.spyOn(component.onResetLayout, 'emit');
    jest.spyOn(window, 'confirm').mockReturnValue(true);

    component.resetLayout();

    expect(component.onResetLayout.emit).toHaveBeenCalled();
    expect(component.widgets.length).toBe(0);
  });

  it('should not reset layout when resetLayout is cancelled', () => {
    const widget: WidgetItem = {
      x: 0,
      y: 0,
      cols: 2,
      rows: 2,
      id: 'test-widget-1',
      type: 'test'
    };

    component.widgets = [widget];
    jest.spyOn(component.onResetLayout, 'emit');
    jest.spyOn(window, 'confirm').mockReturnValue(false);

    component.resetLayout();

    expect(component.onResetLayout.emit).not.toHaveBeenCalled();
    expect(component.widgets.length).toBe(1);
  });

  it('should clear all widgets when deleteAllWidgets is confirmed', () => {
    const widget: WidgetItem = {
      x: 0,
      y: 0,
      cols: 2,
      rows: 2,
      id: 'test-widget-1',
      type: 'test'
    };

    component.widgets = [widget];
    jest.spyOn(window, 'confirm').mockReturnValue(true);

    component.deleteAllWidgets();

    expect(component.widgets.length).toBe(0);
  });

  it('should not clear widgets when deleteAllWidgets is cancelled', () => {
    const widget: WidgetItem = {
      x: 0,
      y: 0,
      cols: 2,
      rows: 2,
      id: 'test-widget-1',
      type: 'test'
    };

    component.widgets = [widget];
    jest.spyOn(window, 'confirm').mockReturnValue(false);

    component.deleteAllWidgets();

    expect(component.widgets.length).toBe(1);
  });

  it('should close drawer after adding a widget', () => {
    component.drawerOpen = true;
    component.addWidget();

    expect(component.drawerOpen).toBe(false);
  });

  it('should respect permissions for drag and resize', () => {
    component.permissions = {
      canDragWidgets: false,
      canResizeWidgets: false
    };

    component.ngOnInit();

    expect(component.options.draggable?.enabled).toBe(false);
    expect(component.options.resizable?.enabled).toBe(false);
  });

  it('should call itemChange when grid item changes', () => {
    jest.spyOn(component, 'saveLayout');
    jest.spyOn(component.widgetsChange, 'emit');

    component.itemChange();

    expect(component.saveLayout).toHaveBeenCalled();
    expect(component.widgetsChange.emit).toHaveBeenCalledWith(component.widgets);
  });

  it('should load components after view init', () => {
    jest.spyOn(component, 'loadAllComponents');

    component.ngAfterViewInit();

    expect(component.loadAllComponents).toHaveBeenCalled();
  });

  it('should handle itemInitCallback for locked widgets', () => {
    const lockedItem: any = {
      id: 'test-1',
      locked: true
    };

    component.options.itemInitCallback?.(lockedItem, null as any);

    expect(lockedItem.dragEnabled).toBe(false);
    expect(lockedItem.resizeEnabled).toBe(false);
  });

  it('should handle itemInitCallback for unlocked widgets', () => {
    const unlockedItem: any = {
      id: 'test-2',
      locked: false
    };

    component.options.itemInitCallback?.(unlockedItem, null as any);

    expect(unlockedItem.dragEnabled).toBe(true);
    expect(unlockedItem.resizeEnabled).toBe(true);
  });

  it('should toggle lock respecting permissions when canDragWidgets is false', () => {
    component.permissions = {
      canDragWidgets: false,
      canResizeWidgets: true
    };

    const widget: WidgetItem = {
      x: 0,
      y: 0,
      cols: 2,
      rows: 2,
      id: 'test-widget-1',
      type: 'test',
      locked: false
    };

    component.toggleLock(widget);
    expect(widget.locked).toBe(true);

    component.toggleLock(widget);
    expect(widget.locked).toBe(false);
    expect(widget.dragEnabled).toBe(false); // Should respect permission
    expect(widget.resizeEnabled).toBe(true);
  });

  it('should toggle lock respecting permissions when canResizeWidgets is false', () => {
    component.permissions = {
      canDragWidgets: true,
      canResizeWidgets: false
    };

    const widget: WidgetItem = {
      x: 0,
      y: 0,
      cols: 2,
      rows: 2,
      id: 'test-widget-1',
      type: 'test',
      locked: false
    };

    component.toggleLock(widget);
    expect(widget.locked).toBe(true);

    component.toggleLock(widget);
    expect(widget.locked).toBe(false);
    expect(widget.dragEnabled).toBe(true);
    expect(widget.resizeEnabled).toBe(false); // Should respect permission
  });

  it('should generate unique IDs for widgets based on timestamp', (done) => {
    const firstWidget = component.widgets.length;
    component.addWidget();
    const firstId = component.widgets[firstWidget].id;

    setTimeout(() => {
      component.addWidget();
      const secondId = component.widgets[firstWidget + 1].id;
      
      expect(firstId).not.toBe(secondId);
      expect(parseInt(firstId)).toBeLessThan(parseInt(secondId));
      done();
    }, 10);
  });

  it('should maintain widget count when removing non-existent widget', () => {
    const widget1: WidgetItem = { x: 0, y: 0, cols: 2, rows: 2, id: '1', type: 'test' };
    const widget2: WidgetItem = { x: 2, y: 0, cols: 2, rows: 2, id: '2', type: 'test' };
    
    component.widgets = [widget1, widget2];
    const initialCount = component.widgets.length;
    
    component.removeWidget('non-existent');
    
    expect(component.widgets.length).toBe(initialCount);
  });

  it('should handle multiple widgets being added', () => {
    const widgetType: WidgetType = {
      type: 'stats',
      name: 'Stats Widget',
      icon: 'stats',
      component: null,
      defaultConfig: {
        cols: 3,
        rows: 2,
        title: 'Statistics'
      }
    };

    component.addWidget(widgetType);
    component.addWidget(widgetType);
    component.addWidget(widgetType);

    expect(component.widgets.length).toBe(3);
    expect(component.widgets.every(w => w.type === 'stats')).toBe(true);
  });

  it('should preserve widget properties when toggling lock', () => {
    const widget: WidgetItem = {
      x: 5,
      y: 10,
      cols: 3,
      rows: 4,
      id: 'test-preserve',
      type: 'chart',
      title: 'Test Chart',
      locked: false
    };

    component.toggleLock(widget);

    expect(widget.x).toBe(5);
    expect(widget.y).toBe(10);
    expect(widget.cols).toBe(3);
    expect(widget.rows).toBe(4);
    expect(widget.id).toBe('test-preserve');
    expect(widget.type).toBe('chart');
    expect(widget.title).toBe('Test Chart');
  });

  it('should close drawer when deleteAllWidgets is confirmed', () => {
    component.drawerOpen = true;
    component.widgets = [{ x: 0, y: 0, cols: 2, rows: 2, id: '1', type: 'test' }];
    jest.spyOn(window, 'confirm').mockReturnValue(true);

    component.deleteAllWidgets();

    expect(component.drawerOpen).toBe(false);
  });

  it('should close drawer when resetLayout is confirmed', () => {
    component.drawerOpen = true;
    jest.spyOn(window, 'confirm').mockReturnValue(true);

    component.resetLayout();

    expect(component.drawerOpen).toBe(false);
  });

  it('should not close drawer when deleteAllWidgets is cancelled', () => {
    component.drawerOpen = true;
    jest.spyOn(window, 'confirm').mockReturnValue(false);

    component.deleteAllWidgets();

    expect(component.drawerOpen).toBe(true);
  });

  it('should not close drawer when resetLayout is cancelled', () => {
    component.drawerOpen = true;
    jest.spyOn(window, 'confirm').mockReturnValue(false);

    component.resetLayout();

    expect(component.drawerOpen).toBe(true);
  });

  it('should initialize with provided gridType', () => {
    const customGridType = 'fit' as any;
    component.gridType = customGridType;
    
    component.ngOnInit();

    expect(component.options.gridType).toBe(customGridType);
  });

  it('should call saveLayout when removing a widget', () => {
    const widget: WidgetItem = { x: 0, y: 0, cols: 2, rows: 2, id: 'test-1', type: 'test' };
    component.widgets = [widget];
    
    jest.spyOn(component, 'saveLayout');

    component.removeWidget('test-1');

    expect(component.saveLayout).toHaveBeenCalled();
  });

  it('should emit widgetsChange when resetting layout', () => {
    component.widgets = [{ x: 0, y: 0, cols: 2, rows: 2, id: '1', type: 'test' }];
    jest.spyOn(component.widgetsChange, 'emit');
    jest.spyOn(window, 'confirm').mockReturnValue(true);

    component.resetLayout();

    expect(component.widgetsChange.emit).toHaveBeenCalledWith([]);
  });

  it('should emit widgetsChange when deleting all widgets', () => {
    component.widgets = [{ x: 0, y: 0, cols: 2, rows: 2, id: '1', type: 'test' }];
    jest.spyOn(component.widgetsChange, 'emit');
    jest.spyOn(window, 'confirm').mockReturnValue(true);

    component.deleteAllWidgets();

    expect(component.widgetsChange.emit).toHaveBeenCalledWith([]);
  });

  it('should create widget with custom content when provided', () => {
    const widgetType: WidgetType = {
      type: 'custom',
      name: 'Custom Widget',
      icon: 'custom',
      component: null,
      defaultConfig: {
        cols: 4,
        rows: 3,
        title: 'Custom',
        content: { data: 'test data', value: 42 }
      }
    };

    component.addWidget(widgetType);

    expect(component.widgets[0].content).toEqual({ data: 'test data', value: 42 });
  });

  it('should handle drawer state independently of widget operations', () => {
    component.openDrawer();
    expect(component.drawerOpen).toBe(true);

    component.addWidget();
    expect(component.drawerOpen).toBe(false);

    component.openDrawer();
    expect(component.drawerOpen).toBe(true);

    component.closeDrawer();
    expect(component.drawerOpen).toBe(false);
  });
});
