import { Component, OnInit } from '@angular/core';
import { APIService } from './../../shared/services/api.service';
import { ITask } from 'src/app/models';

@Component({
  selector: 'app-completed-tasks',
  templateUrl: './completed-tasks.component.html',
  styleUrls: ['./completed-tasks.component.scss'],
})
export class CompletedTasksComponent implements OnInit {
  title = 'Completed Tasks';
  completedTasks: Array<ITask> = [];
  constructor(private service: APIService) {}

  ngOnInit(): void {
    this.getTasks();
  }
  getTasks() {
    this.service.get('api/compeleted').subscribe(
      (data) => {
        if (!data.error) {
          // this.tableLoading = false;
          this.completedTasks = data;
        }
      },
      (err) => {}
    );
  }
}
