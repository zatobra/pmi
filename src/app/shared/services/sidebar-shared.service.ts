// src/app/shared/notification.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
export interface UserData {
  vendorId: number;
  hospitalId: string;
  roleStatus: string;
}
@Injectable({
  providedIn: 'root',
})
export class SidebarSharedService {
  private hideSidebar = new BehaviorSubject<boolean>(false);
  hideSidebar$ = this.hideSidebar.asObservable();

  setHideSidebar(visible: boolean) {
    this.hideSidebar.next(visible);
  }

  // private notificationCount = new BehaviorSubject<number>(0);
  // notificationCount$ = this.notificationCount.asObservable();

  // setNotificationUserId(count: number) {
  //   this.notificationCount.next(count);
  // }

  // private userData = new BehaviorSubject<UserData>({ vendorId: 0, hospitalId: '',  roleStatus : '' });
  // userData$ = this.userData.asObservable();

  // setUserData(data: UserData) {
  //   this.userData.next(data);
  // }

  // private notificationData = new BehaviorSubject<any[]>([]);
  // notificationData$ = this.notificationData.asObservable();

  // setNotificationData(data: any[]) {
  //   this.notificationData.next(data);
  // }

  // private serverIsDown = new BehaviorSubject<boolean>(false);
  // serverIsDown$ = this.serverIsDown.asObservable();

  // setServerIsDown(bool: any) {
  //   this.serverIsDown.next(bool);
  // }
}
