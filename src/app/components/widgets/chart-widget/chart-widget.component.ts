import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chart-widget',
  standalone: false,
  templateUrl: './chart-widget.component.html',
  styleUrls: ['./chart-widget.component.scss']
})
export class ChartWidgetComponent {
  @Input() data: any;
  @Input() chartType: string = 'line';
}
