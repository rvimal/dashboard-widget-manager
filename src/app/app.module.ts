import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { GridsterModule } from 'angular-gridster2';
import { AppComponent } from './app.component';
import { DashboardWidgetManagerComponent } from './components/dashboard-widget-manager/dashboard-widget-manager.component';
import { DemoDashboardComponent } from './components/demo-dashboard/demo-dashboard.component';
import { ChartWidgetComponent } from './components/widgets/chart-widget/chart-widget.component';
import { StatsWidgetComponent } from './components/widgets/stats-widget/stats-widget.component';
import { DashboardService } from './services/dashboard.service';

@NgModule({
  declarations: [
    AppComponent, 
    DashboardWidgetManagerComponent, 
    DemoDashboardComponent,
    ChartWidgetComponent,
    StatsWidgetComponent
  ],
  imports: [BrowserModule, CommonModule, HttpClientModule, GridsterModule],
  providers: [DashboardService],
  exports: [DashboardWidgetManagerComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
