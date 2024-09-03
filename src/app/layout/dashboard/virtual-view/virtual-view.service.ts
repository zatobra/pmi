import { Injectable, Output, EventEmitter } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Subject, of, BehaviorSubject } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { timeout, catchError } from "rxjs/operators";
import * as moment from "moment";
import { Router } from "@angular/router";
import { Config } from "src/assets/config";
@Injectable({
  providedIn: "root",
})
export class VirtualViewService {
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.user_id = localStorage.getItem("user_id");
  }
  ip: any = Config.BASE_URI;
  user_id: any = 0;
  private dataSource = new Subject();
  data = this.dataSource.asObservable();

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
    }),
    withCredentials: true,
  };

  getSupervisorList(obj) {
    const filter = JSON.stringify(obj);
    const url = this.ip + "/loadFilters";
    return this.http.post(url, filter);
  }
  getProdata(obj) {
    const filter = JSON.stringify(obj);
    const url = this.ip + "/loadFilters";
    return this.http.post(url, filter);
  }
  getShopsForTracking(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url = this.ip + "/vo-tracking";
    return this.http.post(url, body, this.httpOptions);
  }
  getShopsForLiveTracking(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url = this.ip + "/vo-live-tracking";
    return this.http.post(url, body, this.httpOptions);
  }
  getShopsForSurveyorTracking(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url = this.ip + "/vo-tracking";
    return this.http.post(url, body, this.httpOptions);
  }
  getShopsForSurveyorLiveTracking(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url = this.ip + "/live-tracking";
    return this.http.post(url, body, this.httpOptions);
  }
  getShopsForSurveyorLiveTrackingById(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url = this.ip + "/vo-live-tracking";
    return this.http.post(url, body, this.httpOptions);
  }
  getRegion(zoneId) {
    this.user_id = localStorage.getItem("user_id");

    const filter = JSON.stringify({
      act: 1,
      zoneId: zoneId,
      userId: this.user_id,
    });
    const url = this.ip + "loadFilters";
    return this.http.post(url, filter);
    // .pipe(
    //   timeout(60000),
    //   catchError(e => {
    //     this.toastr.error('Due to limited connectivity your request could not be completed, please try again', 'Request Timeout');
    //     return of(null);
    //   })
    // );
  }
  getAreaByRegion(regionId) {
    this.user_id = localStorage.getItem("user_id");

    const filter = JSON.stringify({
      act: 27,
      regionId: regionId,
      userId: this.user_id,
    });
    const url = this.ip + "loadFilters";
    return this.http.post(url, filter);
  }

  

  UrlEncodeMaker(obj) {
    let url = "";
    for (const key in obj) {
      url += `${key}=${obj[key]}&`;
    }
    const newUrl = url.substring(0, url.length - 1);
    return newUrl;
  }
}
