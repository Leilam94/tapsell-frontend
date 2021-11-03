import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ITask } from 'src/app/models';
import { APIService } from './../../services/api.service';
import { ToastMessageService } from './../../services/toast-message.service';
import { HandleServerErrorsService } from './../../services/handle-server-errors.service';
import { ScreenSizeService } from './../../services/screen-size.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

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
    private errorService: HandleServerErrorsService,
    private screen: ScreenSizeService,
    public dialog: MatDialog
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
              this.toastService.openSnackBar(
                'Task marked uncompleted',
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
  isMobileScreen() {
    if (
      this.screen.sizes['screen-x-small'] ||
      this.screen.sizes['screen-small']
    ) {
      return true;
    }
    return false;
  }
}
