import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IList } from 'src/app/models';
import { APIService } from './../../../shared/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  private lists = new Subject<Array<IList>>();
  constructor(private service: APIService) {}

  setLists() {
    this.service.get(`api/lists`).subscribe((data) => {
      this.lists.next(data);
    });
  }
  getLists(): Observable<any> {
    return this.lists.asObservable();
  }
}
