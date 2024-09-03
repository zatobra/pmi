import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { DashboardService } from "../dashboard.service";

@Injectable({
  providedIn: "root",
})
export class EvaluationService {
  // ip:any=environment.ip;

  ip: any = "";
  user_id: string;
  // 'http://192.168.3.94:8080/audit/';

  constructor(
    private http: HttpClient,
    private dashboardService: DashboardService
  ) {
    this.ip = dashboardService.ip;
    this.user_id = localStorage.getItem("user_id");
  }
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
    }),
    withCredentials: true,
  };

  UrlEncodeMaker(obj) {
    let url = "";
    for (const key in obj) {
      url += `${key}=${obj[key]}&`;
    }
    const newUrl = url.substring(0, url.length - 1);
    return newUrl;
  }

  getData(obj) {
    const urlencoded = this.UrlEncodeMaker(obj);
    const url = this.ip + "shopList";    //ShopListController
    return this.http.post(url, urlencoded, this.httpOptions);
  }

  getZsmRedFlagShops(obj) {
    const url = this.ip + "app/redflag-shoplist";   // RedFlagShopsController
    return this.http.post(url, obj);
  }

  getShopDetails(obj) {
    const urlencoded = this.UrlEncodeMaker(obj);
    const url = this.ip + "evaluationManager"; //EvaluationController
    return this.http.post(url, urlencoded, this.httpOptions);
  }

  getShopFascia(obj) {
    const urlencoded = this.UrlEncodeMaker(obj);
    const url = this.ip + "shopFascia"; //VisitShopFasciaController
    return this.http.post(url, urlencoded, this.httpOptions);
  }

  getShopCoordinates(obj) {
    const urlencoded = this.UrlEncodeMaker(obj);
    const url = this.ip + "visitLocations"; //VisitShopLocationController
    return this.http.post(url, urlencoded, this.httpOptions);
  }

  evaluateShop(obj) {
    const url = this.ip + "evaluateShopNew";    //EvaluationShopControllerNew
    return this.http.post(url, obj);
  }

  evaluateZsmShops(obj) {
    const urlencoded = this.UrlEncodeMaker(obj);
    const url = this.ip + "zsm-survey-validation"; //ZsmSurveyValidationController
    return this.http.post(url, obj);
  }
  updateMSLStatus(obj) {
    const urlencoded = this.UrlEncodeMaker(obj);

    const url = this.ip + "updateMSL";
    return this.http.post(url, urlencoded, this.httpOptions);
  }

  updateChillerData(obj) {
    const urlencoded = this.UrlEncodeMaker(obj);
    const url = this.ip + "updateChiller";
    return this.http.post(url, urlencoded, this.httpOptions);
  }

  updateSOS(obj) {
    const urlEncode = this.UrlEncodeMaker(obj);
    const url = this.ip + "update-shopsos";
    return this.http.post(url, urlEncode, this.httpOptions);
  }

  updateData(obj) {
    const urlencoded = this.UrlEncodeMaker(obj);

    const url = this.ip + "updateEvaluationData";
    return this.http.post(url, urlencoded, this.httpOptions);
  }

  updateConditionalFieldData(obj) {
    const url = this.ip + "updateSupervisorFormData";
    return this.http.post(url, obj);
  }
}
