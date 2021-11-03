import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { APIService } from '../../services/api.service';
import { HandleServerErrorsService } from '../../services/handle-server-errors.service';
import { ToastMessageService } from '../../services/toast-message.service';
import { IList } from './../../../models';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-list-dialog',
  templateUrl: './list-dialog.component.html',
  styleUrls: ['./list-dialog.component.scss'],
})
export class ListDialogComponent implements OnInit {
  formTitle: string = '';
  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
  });
  constructor(
    public dialogRef: MatDialogRef<ListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public list: IList,
    private service: APIService,
    private toastService: ToastMessageService,
    private errorService: HandleServerErrorsService
  ) {
    this.setValue(list);
    if (!list._id) {
      this.formTitle = 'New List';
    } else {
      this.formTitle = 'Rename List';
    }
  }

  ngOnInit(): void {}
  get title() {
    return this.form.get('title');
  }
  setValue(list: IList) {
    this.form.setValue({
      title: list.title,
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
      isMain: false,
    };
    if (!this.list._id) {
      this.service.post<IList>('api/lists', bodyParams).subscribe(
        (data) => {
          if (!data.error) {
            this.dialogRef.close(data);
            this.toastService.openSnackBar(
              'List added successfully',
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
        .put<IList>(`api/lists/${this.list._id}`, bodyParams)
        .subscribe(
          (data) => {
            if (!data.error) {
              this.dialogRef.close(data);
              this.toastService.openSnackBar(
                'List edited successfully',
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
}
