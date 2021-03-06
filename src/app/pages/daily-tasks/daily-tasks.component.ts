import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ITask } from 'src/app/models';
import { APIService } from './../../shared/services/api.service';
import { ToastMessageService } from './../../shared/services/toast-message.service';
import { TaskDialogComponent } from './../../shared/components/task-dialog/task-dialog.component';
import { HandleServerErrorsService } from 'src/app/shared/services/handle-server-errors.service';
import { ScreenSizeService } from './../../shared/services/screen-size.service';

@Component({
  selector: 'app-daily-tasks',
  templateUrl: './daily-tasks.component.html',
  styleUrls: ['./daily-tasks.component.scss'],
})
export class DailyTasksComponent implements OnInit {
  listID: string = '';
  title: string = '';
  tasks: ITask[] = [];
  isLoading: boolean = true;
  constructor(
    public dialog: MatDialog,
    private service: APIService,
    private toastService: ToastMessageService,
    private errorService: HandleServerErrorsService,
    private screen:ScreenSizeService
  ) {}
  ngOnInit(): void {
    this.getMainList();
  }
  getMainList() {
    this.service.get(`api/mainList`).subscribe(
      (data) => {
        if (!data.error) {
          this.title = data.title;
          this.listID = data._id;
          this.getTasks();
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
  getTasks() {
    if (this.listID) {
      this.service.get(`api/tasks/query/${this.listID}`).subscribe(
        (data) => {
          if (!data.error) {
            this.isLoading = false;
            this.tasks = data.filter((task: ITask) => task.done !== true);
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

  onAddTask() {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '350px',
      data: {
        title: '',
        description: '',
        list: this.listID,
        date: new Date()
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.getTasks();
    });
  }
  isMobileScreen() {
    if (this.screen.sizes['screen-x-small']) {
      return true;
    }
    return false;
  }
}
