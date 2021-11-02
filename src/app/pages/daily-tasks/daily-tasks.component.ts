import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ITask } from 'src/app/models';
import { APIService } from './../../shared/services/api.service';
import { ToastMessageService } from './../../shared/services/toast-message.service';
import { TaskDialogComponent } from './../../shared/components/task-dialog/task-dialog.component';
import { HandleServerErrorsService } from 'src/app/shared/services/handle-server-errors.service';

@Component({
  selector: 'app-daily-tasks',
  templateUrl: './daily-tasks.component.html',
  styleUrls: ['./daily-tasks.component.scss'],
})
export class DailyTasksComponent implements OnInit {
  listID: string = '617e7a911ad6751354c24780';
  title: string = 'Daily Tasks';
  tasks: ITask[] = [];
  constructor(
    public dialog: MatDialog,
    private service: APIService,
    private toastService: ToastMessageService,
    private errorService: HandleServerErrorsService
  ) {}
  ngOnInit(): void {
    this.getTasks();
  }
  getTasks() {
    this.service.get(`api/tasks/query/${this.listID}`).subscribe(
      (data) => {
        if (!data.error) {
          this.tasks = data.filter((task: ITask) => task.done !== true);
        }
      },
      (err) => {
        this.toastService.openSnackBar(
          this.errorService.getServerErrorMessage(err)
        );
      }
    );
  }

  onClickAddTask() {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '350px',
      data: {
        title: '',
        description: '',
        list: this.listID
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getTasks();
    });
  }
}
