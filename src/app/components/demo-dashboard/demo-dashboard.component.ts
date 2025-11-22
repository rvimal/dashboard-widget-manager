import { Component } from '@angular/core';
import { WidgetItem, WidgetType, DashboardWidgetPermissionsConfig } from '../../models/widget.model';
import { ChartWidgetComponent } from '../widgets/chart-widget/chart-widget.component';
import { StatsWidgetComponent } from '../widgets/stats-widget/stats-widget.component';
import { GridType } from 'angular-gridster2';

@Component({
  selector: 'app-demo-dashboard',
  standalone: false,
  templateUrl: './demo-dashboard.component.html',
  styleUrls: ['./demo-dashboard.component.scss']
})
export class DemoDashboardComponent {
  // Optional: Define gridType here (can be changed dynamically)
  gridType: GridType = GridType.Fixed; // or GridType.Fit, GridType.ScrollVertical, etc.

  // Define permissions configuration
  // Set to true/false or remove properties to use defaults (all true)
  dashboardPermissions: DashboardWidgetPermissionsConfig = {
    canShowDrawer: true,        // Show/hide FAB and drawer
    canManageLayout: true,      // Show/hide layout actions (save, reset, delete all)
    canAddWidgets: true,        // Show/hide add widget section
    canEditWidgets: true,       // Show/hide widget headers
    canDeleteWidgets: false,     // Show/hide delete buttons
    canResizeWidgets: true,     // Enable/disable resize
    canDragWidgets: true        // Enable/disable drag
  };

  // Example: Read-only mode (uncomment to test)
  // dashboardPermissions: DashboardWidgetPermissionsConfig = {
  //   canShowDrawer: false,
  //   canManageLayout: false,
  //   canAddWidgets: false,
  //   canEditWidgets: false,
  //   canDeleteWidgets: false,
  //   canResizeWidgets: false,
  //   canDragWidgets: false
  // };

  // Example: View-only with drawer (uncomment to test)
  // dashboardPermissions: DashboardWidgetPermissionsConfig = {
  //   canShowDrawer: true,
  //   canManageLayout: false,
  //   canAddWidgets: false,
  //   canEditWidgets: false,
  //   canDeleteWidgets: false,
  //   canResizeWidgets: false,
  //   canDragWidgets: false
  // };

  availableWidgets: WidgetType[] = [
    {
      type: 'chart',
      name: 'Chart Widget',
      icon: 'bar_chart',
      component: ChartWidgetComponent,
      defaultConfig: {
        cols: 2,
        rows: 2,
        title: 'Chart Widget',
        content: { 
          data: { sales: [10, 20, 30, 40, 50] }, 
          chartType: 'bar' 
        }
      }
    },
    {
      type: 'stats',
      name: 'Stats Widget',
      icon: 'analytics',
      component: StatsWidgetComponent,
      defaultConfig: {
        cols: 2,
        rows: 2,
        title: 'Stats Widget',
        content: { 
          title: 'Total Count', 
          value: 0, 
          change: 0 
        }
      }
    },
    {
      type: 'line-chart',
      name: 'Line Chart',
      icon: 'show_chart',
      component: ChartWidgetComponent,
      defaultConfig: {
        cols: 4,
        rows: 2,
        title: 'Line Chart',
        content: { 
          data: { revenue: [100, 200, 150, 300, 250] }, 
          chartType: 'line' 
        }
      }
    },
    {
      type: 'kpi',
      name: 'KPI Card',
      icon: 'speed',
      component: StatsWidgetComponent,
      defaultConfig: {
        cols: 2,
        rows: 1,
        title: 'KPI',
        content: { 
          title: 'Performance', 
          value: 95, 
          change: 5.2 
        }
      }
    }
  ];

  widgets: WidgetItem[] = [
    { 
      x: 0, y: 0, cols: 2, rows: 2, id: '1', 
      title: 'Sales Overview', 
      component: ChartWidgetComponent,
      content: { data: { sales: [10, 20, 30, 40] }, chartType: 'bar' }
    },
    { 
      x: 2, y: 0, cols: 2, rows: 2, id: '2', 
      title: 'Total Users', 
      component: StatsWidgetComponent,
      content: { title: 'Active Users', value: 1234, change: 12.5 }
    },
    { 
      x: 0, y: 2, cols: 4, rows: 2, id: '3', 
      title: 'Revenue Chart', 
      component: ChartWidgetComponent,
      content: { data: { revenue: [100, 200, 150, 300] }, chartType: 'line' }
    }
  ];
}
