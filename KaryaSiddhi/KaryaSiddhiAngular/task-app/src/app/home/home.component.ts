import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgZone } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {

  currentDate = '';
  greeting = '';

  isDropdownOpen = false;
  selectedFilter = 'This Week';

  selectedFilter$ = new BehaviorSubject<string>('This Week');

  tasks$!: Observable<any[]>;
  filteredTasks$!: Observable<any[]>;
  taskCount$!: Observable<number>;
  completedTaskCount$!: Observable<number>;

  constructor(
    public taskService: TaskService,
    private zone: NgZone
  ) { }

  ngOnInit(): void {
    this.updateTime();

    this.tasks$ = this.taskService.getTasks();

    this.filteredTasks$ = combineLatest([
      this.tasks$,
      this.selectedFilter$
    ]).pipe(
      map(([tasks, filter]) => this.filterTasks(tasks, filter))
    );

    this.taskCount$ = this.tasks$.pipe(
      map(tasks => tasks.length)
    );

    this.completedTaskCount$ = this.tasks$.pipe(
      map(tasks => tasks.filter(t => t.status === true).length)
    );

    setInterval(() => this.updateTime(), 60000);
  }


  filterTasks(tasks: any[], filter: string): any[] {
    const today = new Date();

    return tasks.filter(task => {
      if (!task?.dueDate) return false;

      let taskDate: Date;

      if (task.dueDate.includes('/')) {
        const [d, m, y] = task.dueDate.split('/');
        taskDate = new Date(+y, +m - 1, +d);
      } else {
        taskDate = new Date(task.dueDate);
      }

      if (isNaN(taskDate.getTime())) return false;

      if (+task.priority !== 1 || task.status === true) return false;

      switch (filter) {

        case 'Today':
          return taskDate.toDateString() === today.toDateString();

        case 'This Week': {
          const start = new Date(today);
          start.setDate(today.getDate() - today.getDay());

          const end = new Date(start);
          end.setDate(start.getDate() + 6);

          return taskDate >= start && taskDate <= end;
        }

        case 'This Month':
          return (
            taskDate.getMonth() === today.getMonth() &&
            taskDate.getFullYear() === today.getFullYear()
          );

        case 'Last Week': {
          const start = new Date(today);
          start.setDate(today.getDate() - today.getDay() - 7);

          const end = new Date(start);
          end.setDate(start.getDate() + 6);

          return taskDate >= start && taskDate <= end;
        }

        default:
          return true;
      }
    });
  }


  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectFilter(value: string) {
    this.selectedFilter = value;
    this.isDropdownOpen = false;
    this.selectedFilter$.next(value);
  }

  updateTime() {
    const now = new Date();

    const istTime = new Date(
      now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
    );

    this.currentDate = istTime.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const hours = istTime.getHours();

    if (hours < 12) this.greeting = 'Good morning';
    else if (hours < 17) this.greeting = 'Good afternoon';
    else if (hours < 21) this.greeting = 'Good evening';
    else this.greeting = 'Good night';
  }
}