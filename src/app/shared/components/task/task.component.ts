import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { ITask } from 'src/app/models';
import { HandleServerErrorsService } from '../../services/handle-server-errors.service';
import { APIService } from './../../services/api.service';
import { ToastMessageService } from './../../services/toast-message.service';
import { TaskDialogComponent } from './../task-dialog/task-dialog.component';
import { ScreenSizeService } from './../../services/screen-size.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
  @Input() task?: ITask;
  @Input() mainListId?: string;
  @Output() getData = new EventEmitter<string>();
  isLoading = false;
  isMoving = false;
  constructor(
    public dialog: MatDialog,
    private service: APIService,
    private toastService: ToastMessageService,
    private errorService: HandleServerErrorsService,
    private screen: ScreenSizeService
  ) {}

  ngOnInit(): void {}

  onDeleteTask(id?: string) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '350px',
      data: {
        id: id,
        type: 'tasks',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.getData.next();
    });
  }
  onEditTask(task?: ITask) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '350px',
      data: {
        _id: task!._id,
        title: task!.title,
        description: task!.description || '',
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
            setTimeout(() => {
              this.getData.next();
              this.toastService.openSnackBar(
                'Task Completed',
                'success-snackbar'
              );
            }, 1000);
          }
        },
        (err) => {
          this.toastService.openSnackBar(
            this.errorService.getServerErrorMessage(err),
            'error-snackbar'
          );
        }
      );
    }
  }

  onMoveToDaily(task: ITask) {
    this.isMoving = true;
    const bodyParams = { ...task, list: this.mainListId };
    this.service.put<ITask>(`api/tasks/${task!._id}`, bodyParams).subscribe(
      (res) => {
        if (!res.error) {
          setTimeout(() => {
            this.getData.next();
            this.isMoving = false;
            this.toastService.openSnackBar(
              'Task moved successfully',
              'success-snackbar'
            );
          }, 1000);
        }
      },
      (err) => {
        this.toastService.openSnackBar(
          this.errorService.getServerErrorMessage(err),
          'error-snackbar'
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
            this.toastService.openSnackBar(
              'Date changed successfully',
              'success-snackbar'
            );
          }
        },
        (err) => {
          this.toastService.openSnackBar(
            this.errorService.getServerErrorMessage(err),
            'error-snackbar'
          );
        }
      );
    }
  }
  isMobileScreen() {
    if (this.screen.sizes['screen-x-small']) {
      return true;
    }
    return false;
  }
}
