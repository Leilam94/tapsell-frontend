import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { APIService } from './../../services/api.service';
import { ITask } from '../../../models';
import { ToastMessageService } from '../../services/toast-message.service';
import { HandleServerErrorsService } from '../../services/handle-server-errors.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss'],
})
export class TaskDialogComponent implements OnInit {
  mainListId: string = '';
  formTitle: string = '';
  options: Array<ITask> = [];
  withSelectBox: boolean = false;
  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    selectBox: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    date: new FormControl(''),
  });
  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public task: ITask,
    private service: APIService,
    private toastService: ToastMessageService,
    private errorService: HandleServerErrorsService
  ) {
    this.setValue(task);
    if (!task._id) {
      this.formTitle = 'New Task';
    } else {
      this.formTitle = 'Edit Task';
    }
    if (!task.list) {
      this.withSelectBox = true;
      this.getLists();
    }
  }

  ngOnInit(): void {}
  get title() {
    return this.form.get('title');
  }
  get selectBox() {
    return this.form.get('selectBox');
  }

  setValue(task: ITask) {
    this.form.setValue({
      title: task.title,
      description: task.description,
      date: task.date,
      selectBox: task.list,
    });
  }
  onCancleClick() {
    this.dialogRef.close();
  }
  onCloseClick() {
    this.dialogRef.close();
  }
  onSubmit(e: Event) {
    e.preventDefault();
    const bodyParams = {
      title: this.form.value['title'],
      description: this.form.value['description'],
      list: this.form.value['selectBox'],
      date: this.form.value['date'] || new Date(),
      done: false,
    };
    if (!this.task._id) {
      this.service.post<ITask>('api/tasks', bodyParams).subscribe(
        (data) => {
          if (!data.error) {
            this.dialogRef.close(data);
            this.toastService.openSnackBar(
              'Task added successfully',
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
    } else {
      this.service
        .put<ITask>(`api/tasks/${this.task._id}`, bodyParams)
        .subscribe(
          (data) => {
            if (!data.error) {
              this.dialogRef.close(data);
              this.toastService.openSnackBar(
                'Task edited successfully',
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
  getLists() {
    this.service.get(`api/lists`).subscribe(
      (data) => {
        if (!data.error) {
          this.options = data;
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
