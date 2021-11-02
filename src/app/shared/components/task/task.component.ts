import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  enableProdMode,
} from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { ITask } from 'src/app/models';
import { DailyTasksComponent } from 'src/app/pages/daily-tasks/daily-tasks.component';
import { HandleServerErrorsService } from '../../services/handle-server-errors.service';
import { APIService } from './../../services/api.service';
import { ToastMessageService } from './../../services/toast-message.service';
import { TaskDialogComponent } from './../task-dialog/task-dialog.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
  @Input() task?: ITask;
  @Output() getData = new EventEmitter<string>();
  isLoading = false;
  mainListId = '';
  constructor(
    public dialog: MatDialog,
    private service: APIService,
    private toastService: ToastMessageService,
    private errorService: HandleServerErrorsService
  ) {}

  ngOnInit(): void {
    this.getMainList();
  }

  onDeleteTask(id?: string) {
    this.service.delete(`api/tasks/${id}`).subscribe(
      (res) => {
        if (!res.error) {
          // this.tableLoading = false;
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
  onEditTask(task?: ITask) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '350px',
      data: {
        _id: task!._id,
        title: task!.title,
        description: task!.description,
        list: task!.list,
        date: task!.date,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.getData.next();
    });
  }

  onCompleteTask(task?: ITask) {
    this.isLoading = true;
    if (task) {
      const bodyParams = { ...task, done: true };
      this.service.put<ITask>(`api/tasks/${task!._id}`, bodyParams).subscribe(
        (res) => {
          if (!res.error) {
            // this.tableLoading = false;
            setTimeout(() => {
              this.getData.next();
              this.toastService.openSnackBar('Task Completed');
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
  getMainList() {
    this.service.get(`api/mainList`).subscribe(
      (data) => {
        if (!data.error) {
          this.mainListId = data._id;
        }
      },
      (err) => {
        this.toastService.openSnackBar(
          this.errorService.getServerErrorMessage(err)
        );
      }
    );
  }
  onMoveToDaily(task: ITask) {
    const bodyParams = { ...task, list: this.mainListId };
    this.service.put<ITask>(`api/tasks/${task!._id}`, bodyParams).subscribe(
      (res) => {
        if (!res.error) {
          // this.tableLoading = false;
          setTimeout(() => {
            this.getData.next();
            this.toastService.openSnackBar('Task moved successfully');
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
  onDateChange(e: MatDatepickerInputEvent<Date>, task: ITask): void {
    if (e.value) {
      const bodyParams = { ...task, date: e.value };
      this.service.put<ITask>(`api/tasks/${task!._id}`, bodyParams).subscribe(
        (res) => {
          if (!res.error) {
            console.log(res);
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
}
