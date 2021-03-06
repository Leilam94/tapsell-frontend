import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { IList, ITask } from 'src/app/models';
import { TaskDialogComponent } from 'src/app/shared/components/task-dialog/task-dialog.component';
import { APIService } from './../../shared/services/api.service';
import { ListDialogComponent } from './../../shared/components/list-dialog/list-dialog.component';
import { ListService } from './services/list.service';
import { ToastMessageService } from 'src/app/shared/services/toast-message.service';
import { HandleServerErrorsService } from 'src/app/shared/services/handle-server-errors.service';
import { ScreenSizeService } from './../../shared/services/screen-size.service';
import { DeleteDialogComponent } from 'src/app/shared/components/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss'],
})
export class ListsComponent implements OnInit {
  listID: string = '';
  tasks: ITask[] = [];
  title = '';
  list?: IList;
  isLoading: boolean = true;
  mainListId = '';
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private service: APIService,
    private toastService: ToastMessageService,
    private errorService: HandleServerErrorsService,
    private listService: ListService,
    private router: Router,
    private screen: ScreenSizeService
  ) {
    this.route.params.subscribe((params) => {
      this.listID = params['list'];
      this.getList();
      this.getMainList();
      this.getTasks();
    });
  }

  ngOnInit(): void {}
  getTasks() {
    this.service.get(`api/tasks/query/${this.listID}`).subscribe(
      (data) => {
        if (!data.error) {
          this.isLoading = false;
          this.tasks = data.filter((task: ITask) => task.done !== true);
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

  onAddTask() {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '350px',
      data: {
        title: '',
        description: '',
        list: this.listID,
        date: new Date(),
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.getTasks();
    });
  }
  getList() {
    this.service.get(`api/lists/${this.listID}`).subscribe(
      (data) => {
        if (!data.error) {
          this.list = data;
          this.title = data.title;
        } else {
          this.router.navigateByUrl('/');
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
  onDeleteList() {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '350px',
      data: {
        id: this.listID,
        type: 'lists',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listService.setLists();
        this.router.navigateByUrl('/');
      }
    });
  }
  onEditList() {
    const dialogRef = this.dialog.open(ListDialogComponent, {
      width: '350px',
      data: {
        _id: this.list!._id,
        title: this.list!.title,
        date: this.list!.date,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getList();
        this.listService.setLists();
      }
    });
  }
  getMainList() {
    this.service.get(`api/mainList`).subscribe(
      (data) => {
        if (!data.error) {
          this.mainListId = data._id;
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
  isMobileScreen() {
    if (this.screen.sizes['screen-x-small']) {
      return true;
    }
    return false;
  }
}
