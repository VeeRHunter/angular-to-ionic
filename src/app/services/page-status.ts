import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class PageStatusService {

  public status = '';

  constructor() { }

  public setStatus(status: string) {
    this.status = status;
  }

  public getStatus(): string {
    return this.status;
  }
}
