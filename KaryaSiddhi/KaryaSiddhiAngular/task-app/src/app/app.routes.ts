import { Routes } from '@angular/router';
import { AddTaskComponent } from './add-task/add-task.component';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./tasks/tasks.component').then(m => m.TasksComponent)
  },
  {
    path: 'help',
    loadComponent: () =>
      import('./helpp/helpp.component').then(m => m.HelppComponent)
  },
  {
    path: 'add-task',
    component: AddTaskComponent
  }
];