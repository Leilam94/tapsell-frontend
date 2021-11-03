import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ToastMessageService {
  constructor(private _snackBar: MatSnackBar) {}

  openSnackBar(message: string, className: string) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'start',
      verticalPosition: 'bottom',
      duration: 2000,
      panelClass: [className],
    });
  }
}
