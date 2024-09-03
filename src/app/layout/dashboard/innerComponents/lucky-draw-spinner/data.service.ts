import { Injectable, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { DashboardService } from "../../dashboard.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";

import { BehaviorSubject, Subject } from "rxjs";
import { Config } from "src/assets/config";

@Injectable({
  providedIn: "root",
})
export class DataService implements OnInit {
  public data: any[];
  loadingData: boolean;
  private filesList: any = [];
  ip: any = Config.BASE_URI;
  user_id: any = 0;

  private sharedDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  private sharedDataSubjectBoolean: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
    }),
    withCredentials: true,
  };

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) {
    // this.form = formBuilder.group({
    //   avatar: null,
    // });
    // this.user_id = localStorage.getItem("user_id");
    this.user_id = localStorage.getItem("user_id");
  }
  ngOnInit(): void {
  }

  getSharedData(): any {
    // return this.filesList;
    return this.sharedDataSubject.asObservable();
  }

  setSharedData(data: any): void {
    // this.filesList = data;
    this.sharedDataSubject.next(data);
  }

  getSharedDataBoolean(): any {
    // return this.filesList;
    return this.sharedDataSubjectBoolean.asObservable();
  }

  setSharedDataBoolean(data: any): void {
    // this.filesList = data;
    this.sharedDataSubjectBoolean.next(data);
  }


}
