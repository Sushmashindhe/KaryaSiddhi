import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../services/task';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-task.html',
  styleUrls: ['./add-task.css']
})
export class AddTaskComponent {

  constructor(
    private taskService: TaskService,
    private router: Router
  ) {}

  newTask = {
    title: '',
    description: '',
    priority: 'null',
    dueDate: ''
  };
get priorityOptions() {
  return this.taskService.priorityOptions;
}
  saveTask(form: any) {
    if (form.invalid) return;

    const date = new Date(this.newTask.dueDate);

    const formattedDate =
      ('0' + date.getDate()).slice(-2) + '/' +
      ('0' + (date.getMonth() + 1)).slice(-2) + '/' +
      date.getFullYear();

   

const taskToSend = {
  ...this.newTask,
  priority: this.newTask.priority, 
  dueDate: formattedDate,
  status: false
};
console.log('SENDING:', taskToSend);
    this.taskService.addTask(taskToSend).subscribe(() => {
      form.resetForm();

      
      this.router.navigate(['/tasks']);
    });
  }

  cancel() {
    this.router.navigate(['/']);
  }
}