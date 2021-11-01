import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ITask } from 'src/app/models';
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
  subscription: any;
  isLoading = false;
  constructor(
    public dialog: MatDialog,
    private service: APIService,
    private toastService: ToastMessageService
  ) {}

  ngOnInit(): void {}

  onDeleteTask(id: any) {
    this.service.delete(`api/tasks/${id}`).subscribe(
      (res) => {
        if (!res.error) {
          // this.tableLoading = false;
          this.getData.next();
        }
      },
      (err) => {
        console.log(err);
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
      this.getData.next();
    });
  }

  onChangeSelectedTask(task?: ITask) {
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
          console.log(err);
        }
      );
    }
  }
}
