import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { APIService } from '../../services/api.service';
import { IList } from './../../../models';

@Component({
  selector: 'app-list-dialog',
  templateUrl: './list-dialog.component.html',
  styleUrls: ['./list-dialog.component.scss']
})
export class ListDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public list: IList,
    private service: APIService
  ) { }

  ngOnInit(): void {
  }
  onCancleClick() {
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
            this.dialogRef.close();
          }
        },
        (err) => {}
      );
    } else {
      this.service
        .put<IList>(`api/lists/${this.list._id}`, bodyParams)
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
