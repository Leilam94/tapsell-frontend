import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { APIService } from '../../services/api.service';
import { HandleServerErrorsService } from '../../services/handle-server-errors.service';
import { ToastMessageService } from '../../services/toast-message.service';
import { IList } from './../../../models';
import { FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-list-dialog',
  templateUrl: './list-dialog.component.html',
  styleUrls: ['./list-dialog.component.scss'],
})
export class ListDialogComponent implements OnInit {
  title: string = '';
  Title = new FormControl('', [Validators.required]);
  constructor(
    public dialogRef: MatDialogRef<ListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public list: IList,
    private service: APIService,
    private toastService: ToastMessageService,
    private errorService: HandleServerErrorsService
  ) {
    if (!list._id) {
      this.title = 'New List';
    } else {
      this.title = 'Rename List';
    }
  }

  ngOnInit(): void {}
  onCancleClick() {
    this.dialogRef.close();
  }
  onCloseClick(){
    this.dialogRef.close();
  }
  onSaveClick() {
    const bodyParams = {
      title: this.list.title,
      date: this.list.date,
      isMain: false,
    };
    if (!this.list._id) {
      this.service.post<IList>('api/lists', bodyParams).subscribe(
        (data) => {
          if (!data.error) {
            this.dialogRef.close(data);
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
