import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { IList, ITask } from 'src/app/models';
import { TaskDialogComponent } from 'src/app/shared/components/task-dialog/task-dialog.component';
import { APIService } from './../../shared/services/api.service';
import { ListDialogComponent } from './../../shared/components/list-dialog/list-dialog.component';
import { ListService } from './services/list.service';

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
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private service: APIService,
    private listService: ListService
  ) {
    this.route.params.subscribe((params) => {
      this.listID = params['list'];
      this.getList();
      this.getTasks();
    });
  }

  ngOnInit(): void {}
  getTasks() {
    this.service.get(`api/tasks/query/${this.listID}`).subscribe(
      (data) => {
        if (!data.error) {
          this.tasks = data.filter((task: ITask) => task.done !== true);
        }
      },
      (err) => {}
    );
  }

  onClickAddTask() {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '350px',
      data: {
        title: '',
        description: '',
        list: '',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getTasks();
    });
  }
  getList() {
    this.service.get(`api/lists/${this.listID}`).subscribe(
      (data) => {
        if (!data.error) {
          this.list = data;
          this.title = data.title;
        }
      },
      (err) => {}
    );
  }
  onDeleteList() {
    this.service.delete(`api/lists/${this.listID}`).subscribe(
      (data) => {
        if (!data.error) {

        }
      },
      (err) => {}
    );
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
      this.getList();
      this.listService.setLists();
    });
  }
}
