import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ITask } from 'src/app/models';
import { APIService } from './../../services/api.service';
import { ToastMessageService } from './../../services/toast-message.service';
import { HandleServerErrorsService } from './../../services/handle-server-errors.service';

@Component({
  selector: 'app-completed-task',
  templateUrl: './completed-task.component.html',
  styleUrls: ['./completed-task.component.scss'],
})
export class CompletedTaskComponent implements OnInit {
  @Input() task?: ITask;
  @Output() getData = new EventEmitter<string>();
  isLoading = false;
  constructor(
    private service: APIService,
    private toastService: ToastMessageService,
    private errorService: HandleServerErrorsService
  ) {}

  ngOnInit(): void {}
  onMoveBackToUncomplete(task?: ITask) {
    if (task) {
      this.isLoading = true;
      const bodyParams = { ...task, done: false };
      this.service.put<ITask>(`api/tasks/${task!._id}`, bodyParams).subscribe(
        (res) => {
          if (!res.error) {
            setTimeout(() => {
              this.getData.next();
              this.toastService.openSnackBar('Task marked uncompleted');
            }, 1000);
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
  onDeleteTask(id?: string) {
    this.service.delete(`api/tasks/${id}`).subscribe(
      (res) => {
        if (!res.error) {
          this.getData.next();
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
