import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from '../../environments/environment';


export interface Employees {
  EmployeeName: string;
  StarTimeUtc: string;
  EndTimeUtc: string;
}

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private httpClient = inject(HttpClient);

  private data = new BehaviorSubject<any[]>([]);
  data$ = this.data.asObservable();

  private header = new HttpHeaders({
    'key': environment.apiKey
  });

  private api = `${environment.apiUrl}?code=${environment.apiKey}`;
    
  constructor(private http: HttpClient) {
    this.getData();
  }

  getData() {
    this.http.get<Employees[]>(this.api, { headers: this.header })
      .pipe(
        map(data => {
          const employeeHoursMap = data.reduce((acc, employee) => {
            const hours = (new Date(employee.EndTimeUtc).getTime() - new Date(employee.StarTimeUtc).getTime()) / (1000 * 60 * 60);

            const employeeName = employee.EmployeeName || 'Unknown Employee';

            if (!acc[employeeName]) {
              acc[employeeName] = 0;
            }
            acc[employeeName] += Math.max(hours, 0); 

            return acc;
          }, {} as { [key: string]: number });

          return Object.keys(employeeHoursMap).map(name => ({
            name: name,
            totalTimeInHours: Math.ceil(employeeHoursMap[name])
          }));
        })
      )
      .subscribe(groupedData => {
        this.data.next(groupedData);
      });
  }
}
