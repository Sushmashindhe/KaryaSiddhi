import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tasks.html',
  styleUrls: ['./tasks.css']
})
export class TasksComponent implements OnInit {

  tasks$!: Observable<any[]>;

  filters = {
    status: 'all',
    priority: 'all' as 'all' | number
  };

  sortOrder: 'near' | 'far' = 'near';

  filteredTasks$!: Observable<any[]>;

  constructor(public taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.tasks$ = this.taskService.getTasks();

    this.filteredTasks$ = this.tasks$.pipe(
      map(tasks => {
        return tasks
          .map(task => ({
            ...task,
            status: task.status ?? false
          }))
          .filter(task => this.applyFilters(task))
          .sort((a, b) => this.applySort(a, b));
      })
    );
  }

  applyFilters(task: any): boolean {
    if (this.filters.status === 'completed' && !task.status) return false;
    if (this.filters.status === 'pending' && task.status) return false;

    if (this.filters.priority !== 'all' && task.priority !== this.filters.priority) {
      return false;
    }

    return true;
  }

  applySort(a: any, b: any): number {
    const dateA = this.parseDate(a.dueDate);
    const dateB = this.parseDate(b.dueDate);

    return this.sortOrder === 'near'
      ? dateA - dateB
      : dateB - dateA;
  }

  parseDate(date: string): number {
    if (!date) return 0;

    if (date.includes('/')) {
      const [day, month, year] = date.split('/');
      return new Date(`${year}-${month}-${day}`).getTime();
    }

    return new Date(date).getTime();
  }

  toggleStatus(task: any) {
    if (task.status) return;

    task.status = true;

    const updatedTask = {
      ...task,
      status: true
    };

    this.taskService.updateTask(updatedTask).subscribe({
      next: () => this.loadTasks(),
      error: () => task.status = false
    });
  }

  trackById(index: number, item: any) {
    return item.id;
  }
}