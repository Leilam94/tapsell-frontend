import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HandleServerErrorsService } from '../../services/handle-server-errors.service';
import { ToastMessageService } from '../../services/toast-message.service';
import { APIService } from './../../services/api.service';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss'],
})
export class DeleteDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    private service: APIService,
    private toastService: ToastMessageService,
    private errorService: HandleServerErrorsService,
    @Inject(MAT_DIALOG_DATA) public data: {id:number, type:string},
  ) {}

  ngOnInit(): void {}
  onNoClick() {
    this.dialogRef.close();
  }
  onYesClick() {
    this.service.delete(`api/${this.data.type}/${this.data.id}`).subscribe(
      (res) => {
        if (!res.error) {
        }
      },
      (err) => {
        this.toastService.openSnackBar(
          this.errorService.getServerErrorMessage(err)
        );
      }
    );
  }
}
