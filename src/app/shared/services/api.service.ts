import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppInfoService } from './app-info.service';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  constructor(private http: HttpClient, private appInfo: AppInfoService) {}

  get<Type>(nameSpace: string): Observable<any> {
    return this.http.get(`${this.appInfo.baseAPI}/${nameSpace}`);
  }
  post<Type>(nameSpace: string, bodyParam: Type): Observable<any> {
    return this.http.post(`${this.appInfo.baseAPI}/${nameSpace}`, bodyParam);
  }
  put<Type>(nameSpace: string, bodyParam: Type): Observable<any> {
    return this.http.put(`${this.appInfo.baseAPI}/${nameSpace}`, bodyParam);
  }
  delete(nameSpace: string): Observable<any> {
    return this.http.delete(`${this.appInfo.baseAPI}/${nameSpace}`);
  }
}
