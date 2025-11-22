import { Component, Input, Output, EventEmitter, OnInit, ViewContainerRef, ComponentRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { WidgetItem, WidgetType, DashboardWidgetPermissionsConfig } from '../../models/widget.model';
import { DashboardService } from '../../services/dashboard.service';
import { ChartWidgetComponent } from '../widgets/chart-widget/chart-widget.component';
import { StatsWidgetComponent } from '../widgets/stats-widget/stats-widget.component';

/**
 * Dashboard Widget Manager Component
 * 
 * A flexible dashboard component that supports drag-and-drop, resize, and dynamic widget management.
 * 
 * @example
 * ```html
 * <app-dashboard-widget-manager 
 *   [(widgets)]="widgets" 
 *   [apiEnabled]="true"
 *   [availableWidgets]="availableWidgets">
 * </app-dashboard-widget-manager>
 * ```
 * 
 * @Input widgets - Array of widget items to display on the dashboard
 * @Input apiEnabled - Enable/disable API-based persistence (falls back to localStorage if false)
 * @Input availableWidgets - Array of widget types that can be added to the dashboard
 * @Input gridType - Grid type for the dashboard (default: GridType.Fixed)
 * @Input permissions - Permission flags to control feature visibility and functionality
 * @Output widgetsChange - Emits when widgets array changes (for two-way binding)
 */
@Component({
  selector: 'app-dashboard-widget-manager',
  standalone: false,
  templateUrl: './dashboard-widget-manager.component.html',
  styleUrls: ['./dashboard-widget-manager.component.scss']
})
export class DashboardWidgetManagerComponent implements OnInit, AfterViewInit {
  @Input() widgets: WidgetItem[] = [];
  @Input() apiEnabled: boolean = true; // Toggle API usage
  @Input() availableWidgets: WidgetType[] = []; // Widget types provided by parent component
  @Input() gridType: GridType = GridType.Fixed; // Grid type (default: Fixed)
  @Input() permissions: DashboardWidgetPermissionsConfig = {
    canShowDrawer: true,
    canManageLayout: true,
    canAddWidgets: true,
    canEditWidgets: true,
    canDeleteWidgets: true,
    canResizeWidgets: true,
    canDragWidgets: true
  };
  @Output() widgetsChange = new EventEmitter<WidgetItem[]>();
  @ViewChildren('widgetContainer', { read: ViewContainerRef }) widgetContainers!: QueryList<ViewContainerRef>;

  drawerOpen: boolean = false;

  options: GridsterConfig = {
    gridType: this.gridType,
    draggable: { 
      enabled: true,
      ignoreContent: true,
      dragHandleClass: 'drag-handle'
    },
    resizable: { 
      enabled: true 
    },
    pushItems: true,
    displayGrid: 'onDrag&Resize',
    itemChangeCallback: this.itemChange.bind(this),
    itemInitCallback: (item: any) => {
      if (item.locked) {
        item.dragEnabled = false;
        item.resizeEnabled = false;
      } else {
        // Apply permission-based restrictions
        item.dragEnabled = this.permissions.canDragWidgets !== false;
        item.resizeEnabled = this.permissions.canResizeWidgets !== false;
      }
    }
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    // Update gridType in options after input is set
    this.options.gridType = this.gridType;
    // Apply permission-based configuration
    if (this.options.draggable) {
      this.options.draggable.enabled = this.permissions.canDragWidgets !== false;
    }
    if (this.options.resizable) {
      this.options.resizable.enabled = this.permissions.canResizeWidgets !== false;
    }
    this.loadLayout();
  }

  ngAfterViewInit() {
    this.loadAllComponents();
    // Subscribe to changes in widget containers
    this.widgetContainers.changes.subscribe(() => {
      this.loadAllComponents();
    });
  }

  loadAllComponents() {
    if (this.widgetContainers) {
      const containersArray = this.widgetContainers.toArray();
      this.widgets.forEach((widget, index) => {
        if (containersArray[index]) {
          this.loadComponent(widget, containersArray[index]);
        }
      });
    }
  }

  itemChange() {
    this.saveLayout();
    this.widgetsChange.emit(this.widgets);
  }

  saveLayout() {
    if (this.apiEnabled) {
      this.dashboardService.saveLayout(this.widgets).subscribe();
    } else {
      localStorage.setItem('dashboard-layout', JSON.stringify(this.widgets));
    }
  }

  loadLayout() {
    if (this.apiEnabled) {
      this.dashboardService.loadLayout().subscribe(layout => {
        if (layout && layout.length > 0) {
          this.widgets = layout;
          // Restore component references based on type
          this.widgets.forEach(widget => {
            if (widget.type && !widget.component) {
              const widgetType = this.availableWidgets.find(wt => wt.type === widget.type);
              if (widgetType) {
                widget.component = widgetType.component;
              }
            }
          });
          setTimeout(() => this.loadAllComponents(), 0);
        }
      });
    } else {
      const saved = localStorage.getItem('dashboard-layout');
      if (saved) {
        this.widgets = JSON.parse(saved);
        // Restore component references based on type
        this.widgets.forEach(widget => {
          if (widget.type && !widget.component) {
            const widgetType = this.availableWidgets.find(wt => wt.type === widget.type);
            if (widgetType) {
              widget.component = widgetType.component;
            }
          }
        });
        setTimeout(() => this.loadAllComponents(), 0);
      }
    }
  }

  openDrawer() {
    this.drawerOpen = true;
  }

  closeDrawer() {
    this.drawerOpen = false;
  }

  addWidget(widgetType?: WidgetType) {
    if (widgetType) {
      const newWidget: WidgetItem = {
        x: 0,
        y: 0,
        cols: widgetType.defaultConfig.cols,
        rows: widgetType.defaultConfig.rows,
        id: Date.now().toString(),
        type: widgetType.type,
        title: widgetType.defaultConfig.title,
        component: widgetType.component,
        content: widgetType.defaultConfig.content
      };
      this.widgets.push(newWidget);
    } else {
      // Default widget if no type specified
      this.widgets.push({ 
        x: 0, 
        y: 0, 
        cols: 2, 
        rows: 2, 
        id: Date.now().toString(),
        type: 'default',
        title: 'New Widget'
      });
    }
    this.saveLayout();
    this.widgetsChange.emit(this.widgets);
    this.closeDrawer();
    // Load components after a short delay to ensure DOM is updated
    setTimeout(() => this.loadAllComponents(), 0);
  }

  removeWidget(id: string) {
    this.widgets = this.widgets.filter(w => w.id !== id);
    this.saveLayout();
  }

  deleteAllWidgets() {
    if (confirm('Are you sure you want to delete all widgets?')) {
      // Clear all widget containers
      if (this.widgetContainers) {
        this.widgetContainers.forEach(container => container.clear());
      }
      this.widgets = [];
      this.saveLayout();
      this.widgetsChange.emit(this.widgets);
      this.closeDrawer();
    }
  }

  resetLayout() {
    if (confirm('Are you sure you want to reset the layout?')) {
      // Clear all widget containers
      if (this.widgetContainers) {
        this.widgetContainers.forEach(container => container.clear());
      }
      localStorage.removeItem('dashboard-layout');
      this.widgets = [];
      this.loadLayout();
      this.closeDrawer();
    }
  }

  toggleLock(widget: WidgetItem) {
    widget.locked = !widget.locked;
    // Disable/enable drag and resize for this specific widget, respecting permissions
    widget.dragEnabled = !widget.locked && this.permissions.canDragWidgets !== false;
    widget.resizeEnabled = !widget.locked && this.permissions.canResizeWidgets !== false;
    this.saveLayout();
    // Force gridster to update
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  loadComponent(widget: WidgetItem, container: ViewContainerRef) {
    if (widget.component) {
      container.clear();
      const componentRef = container.createComponent(widget.component);
      // Pass data to component if needed
      if (widget.content) {
        Object.assign(componentRef.instance as any, widget.content);
      }
    }
  }
}
