import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { APIService } from './../../services/api.service';
import { IList, ITask } from '../../../models';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  options: Array<IList> = [];
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public task: ITask,
    private service: APIService
  ) {
    this.getLists();
  }

  ngOnInit(): void {}
  getLists() {
    this.service.get(`api/lists`).subscribe(
      (data) => {
        if (!data.error) {
          this.options = data;
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
    if(!this.task._id){
      this.service.post<ITask>('api/tasks', bodyParams).subscribe(
        (data) => {
          if (!data.error) {
            this.dialogRef.close();
          }
        },
        (err) => {}
      );
    }else{
      this.service.put<ITask>(`api/tasks/${this.task._id}`, bodyParams).subscribe(
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
