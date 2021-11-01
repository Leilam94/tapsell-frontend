import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ITask } from 'src/app/models';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { APIService } from './../../shared/services/api.service';
import { ToastMessageService } from './../../shared/services/toast-message.service';

@Component({
  selector: 'app-daily-tasks',
  templateUrl: './daily-tasks.component.html',
  styleUrls: ['./daily-tasks.component.scss'],
})
export class DailyTasksComponent implements OnInit {
  listID: string = '617e7a911ad6751354c24780';
  title: string = 'Daily Tasks';
  tasks: ITask[] = [];
  subscription: any;
  constructor(
    public dialog: MatDialog,
    private service: APIService,
    private toastService: ToastMessageService
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
      (err) => {}
    );
  }

  onClickAddTask() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '350px',
      data: {
        title: '',
        description: '',
        list: '',
        editMode:false
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getTasks();
    });
  }
}
