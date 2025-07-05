import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmployeesTableComponent } from './employees-table/employees-table.component';
import { EmployeesChartComponent } from './employees-chart/employees-chart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EmployeesTableComponent, EmployeesChartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'RareCrewAngular';
}