import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stats-widget',
  standalone: false,
  templateUrl: './stats-widget.component.html',
  styleUrls: ['./stats-widget.component.scss']
})
export class StatsWidgetComponent {
  @Input() title: string = 'Statistics';
  @Input() value: number = 0;
  @Input() change: number = 0;
}
