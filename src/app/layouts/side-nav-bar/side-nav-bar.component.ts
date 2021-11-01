import { Component, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef } from '@angular/core';
import { APIService } from './../../shared/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { ListDialogComponent } from './../../shared/components/list-dialog/list-dialog.component';

export interface List {
  _id: string;
  title: string;
}
@Component({
  selector: 'app-side-nav-bar',
  templateUrl: './side-nav-bar.component.html',
  styleUrls: ['./side-nav-bar.component.scss'],
})
export class SideNavBarComponent implements OnInit {
  mobileQuery: MediaQueryList;
  fillerNav: List[] = [];
  mainListTitle: string = '';
  mainListId: string = '';
  private _mobileQueryListener: () => void;
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private service: APIService,
    public dialog: MatDialog,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.getMainList();
  }
  getMainList() {
    this.service.get(`api/mainList`).subscribe(
      (data) => {
        if (!data.error) {
          this.mainListTitle = data.title;
          this.mainListId = data._id;
          this.getLists();
        }
      },
      (err) => {}
    );
  }
  getLists() {
    this.service.get(`api/lists`).subscribe(
      (data) => {
        if (!data.error) {
          this.fillerNav = data.filter(
            (list: List) => list._id !== this.mainListId
          );
        }
      },
      (err) => {}
    );
  }
  onClickAddList() {
    const dialogRef = this.dialog.open(ListDialogComponent, {
      width: '350px',
      data: {
        title: '',
        description: '',
        list: ''
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getLists();
    });
  }
}
