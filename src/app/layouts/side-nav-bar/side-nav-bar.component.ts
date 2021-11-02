import { Component, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef } from '@angular/core';
import { APIService } from './../../shared/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { ListDialogComponent } from './../../shared/components/list-dialog/list-dialog.component';
import { ListService } from './../../pages/lists/services/list.service';
import { IList } from './../../models';
import { Subscription } from 'rxjs';
import { ToastMessageService } from 'src/app/shared/services/toast-message.service';
import { HandleServerErrorsService } from 'src/app/shared/services/handle-server-errors.service';

@Component({
  selector: 'app-side-nav-bar',
  templateUrl: './side-nav-bar.component.html',
  styleUrls: ['./side-nav-bar.component.scss'],
})
export class SideNavBarComponent implements OnInit {
  mobileQuery: MediaQueryList;
  fillerNav: IList[] = [];
  mainListTitle: string = '';
  mainListId: string = '';
  subscription: Subscription;
  private _mobileQueryListener: () => void;
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private service: APIService,
    public dialog: MatDialog,
    private listService: ListService,
    private toastService: ToastMessageService,
    private errorService: HandleServerErrorsService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.subscription = this.listService.getLists().subscribe((lists) => {
      if (lists) {
        this.fillerNav = lists.filter(
          (list: IList) => list._id !== this.mainListId
        );
      } else {
        this.fillerNav = [];
      }
    });
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
          this.listService.setLists();
        }
      },
      (err) => {
        this.toastService.openSnackBar(
          this.errorService.getServerErrorMessage(err)
        );
      }
    );
  }
  onClickAddList() {
    const dialogRef = this.dialog.open(ListDialogComponent, {
      width: '350px',
      data: {
        title: '',
        description: '',
        list: '',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.listService.setLists();
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
