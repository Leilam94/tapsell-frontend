import { Component, OnInit } from '@angular/core';
import { APIService } from './../../shared/services/api.service';
import { ITask } from 'src/app/models';
import { ToastMessageService } from 'src/app/shared/services/toast-message.service';
import { HandleServerErrorsService } from 'src/app/shared/services/handle-server-errors.service';

@Component({
  selector: 'app-completed-tasks',
  templateUrl: './completed-tasks.component.html',
  styleUrls: ['./completed-tasks.component.scss'],
})
export class CompletedTasksComponent implements OnInit {
  title = 'Completed Tasks';
  completedTasks: Array<ITask> = [];
  isLoading: boolean = true;
  constructor(
    private service: APIService,
    private toastService: ToastMessageService,
    private errorService: HandleServerErrorsService
  ) {}

  ngOnInit(): void {
    this.getTasks();
  }
  getTasks() {
    this.service.get('api/compeleted').subscribe(
      (data) => {
        if (!data.error) {
          this.isLoading = false;
          this.completedTasks = data;
        }
      },
      (err) => {
        this.toastService.openSnackBar(
          this.errorService.getServerErrorMessage(err)
        );
      }
    );
  }
}
