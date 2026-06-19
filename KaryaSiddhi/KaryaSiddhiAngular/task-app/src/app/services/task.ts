import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'https://localhost:7017/api/tasks';
  priorityOptions: any[] = [];

  constructor(private http: HttpClient) { }

  addTask(task: any): Observable<any> {
    return this.http.post(this.apiUrl, task);
  }

  getTasks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  updateTask(task: any) {
    return this.http.put(`${this.apiUrl}/${task.id}`, task);
  }
  getPriorities() {
    return this.http.get<any[]>('https://localhost:7017/api/tasks/priorities');
  }
  getPriorityLabel(value: number): string {
    const found = this.priorityOptions.find(p => p.id === value);
    return found ? found.name : '';
  }

  setPriorities(data: any[]) {
    this.priorityOptions = data;
  }

}