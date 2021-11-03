import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppInfoService {
  constructor() {}

  public get baseAPI(): string {
    return 'http://localhost:3000';
  }
}
