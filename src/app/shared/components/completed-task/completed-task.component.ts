import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ITask } from 'src/app/models';
import { APIService } from './../../services/api.service';
import { ToastMessageService } from './../../services/toast-message.service';

@Component({
  selector: 'app-completed-task',
  templateUrl: './completed-task.component.html',
  styleUrls: ['./completed-task.component.scss'],
})
export class CompletedTaskComponent implements OnInit {
  @Input() task?: ITask;
  @Output() getData = new EventEmitter<string>();
  isLoading =false;
  constructor(
    private service: APIService,
    private toastService: ToastMessageService
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

            console.log(res);
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }
  onDeleteTask(id: any) {
    this.service.delete(`api/tasks/${id}`).subscribe(
      (res) => {
        if (!res.error) {
          // this.tableLoading = false;
          console.log(res);
          this.getData.next();
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
