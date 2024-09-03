import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable({
  providedIn: 'root',
})
export class RefreshComService {
  invokeFirstComponentFunction = new EventEmitter();
  regionId = 1;
  subsVar: Subscription;

  constructor() {}

  onFirstComponentButtonClick() {
    debugger;
    this.invokeFirstComponentFunction.emit();
  }

  public notify = new BehaviorSubject<any>('');

notifyObservable$ = this.notify.asObservable();

    public notifyOther(data: any) {
        debugger;
    if (data) {
        this.notify.next(data);
    }
}
}
