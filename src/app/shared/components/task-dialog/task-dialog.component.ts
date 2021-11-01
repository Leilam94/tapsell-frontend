import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { APIService } from './../../services/api.service';
import { IList, ITask } from '../../../models';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss'],
})
export class TaskDialogComponent implements OnInit {
  options: Array<IList> = [];
  mainListId: string = '';
  title: string = '';
  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public task: ITask,
    private service: APIService
  ) {
    this.getMainList();
    if (!task._id) {
      this.title = 'New Task';
    } else {
      this.title = 'Edit Task';
    }
  }

  ngOnInit(): void {}
  getMainList() {
    this.service.get(`api/mainList`).subscribe(
      (data) => {
        if (!data.error) {
          this.mainListId = data._id;
          this.getAllLists();
        }
      },
      (err) => {}
    );
  }
  getAllLists() {
    this.service.get(`api/lists`).subscribe(
      (data) => {
        if (!data.error) {
          this.options = data.filter(
            (list: IList) =>
              list._id === this.mainListId || list._id === this.task.list
          );
        }
      },
      (err) => {}
    );
  }

  onCancleClick() {
    this.dialogRef.close();
  }
  onSaveClick() {
    const bodyParams = {
      title: this.task.title,
      description: this.task.description,
      done: false,
      list: this.task.list,
      date: this.task.date,
    };
    if (!this.task._id) {
      this.service.post<ITask>('api/tasks', bodyParams).subscribe(
        (data) => {
          if (!data.error) {
            this.dialogRef.close();
          }
        },
        (err) => {}
      );
    } else {
      this.service
        .put<ITask>(`api/tasks/${this.task._id}`, bodyParams)
        .subscribe(
          (data) => {
            if (!data.error) {
              this.dialogRef.close();
            }
          },
          (err) => {}
        );
    }
  }
}
