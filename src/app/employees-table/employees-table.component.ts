import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-employees-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employees-table.component.html',
  styleUrl: './employees-table.component.css'
})
export class EmployeesTableComponent implements OnInit{
  employees:any;
  constructor(private sharedService: SharedService){
  }
  ngOnInit() {
    this.sharedService.getData();
    this.sharedService.data$.subscribe(employee =>{
      this.employees=employee
      this.sortEmployeesByHours();
    });
  }
  sortEmployeesByHours() {
    this.employees.sort((a: { totalTimeInHours: number; }, b: { totalTimeInHours: number; }) => b.totalTimeInHours - a.totalTimeInHours);
  }
}
