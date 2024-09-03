import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { log } from "console";
import { Subject } from "rxjs";
import { filter } from "rxjs/operators";
import { Config } from "src/assets/config";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
 
  constructor(private http: HttpClient) {
    this.user_id = localStorage.getItem("user_id");
  }

  ip: any = Config.BASE_URI;
  // ip2: any = Config.BASE_URI2;
  user_id: any = 0;
  private dataSource = new Subject();
  data = this.dataSource.asObservable();

  // ip: any = 'http://192.168.3.162:8080/audit/';

  // ip: any='http://192.168.3.142:8080/audit/';
  // ip: any = 'http://192.168.3.189:8080/audit/';
  // ip: any = 'http://192.168.3.94:8080/audit/';
  // ip: any = 'http://192.168.3.162:8080/audit/';

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
    }),
    withCredentials: true,
  };

  updatedDownloadStatus(data) {
    this.dataSource.next(data);
  }

  login(credentials: any) {
    // let body=JSON.stringify(credentials)
    const url = this.ip + "pictureLogin";
    return this.http.post(url, credentials);
    // .pipe(
    //   timeout(60000),
    //   catchError(e => {
    //     this.toastr.error('Due to limited connectivity your request could not be completed, please try again', 'Request Timeout')
    //     return of(null);
    //   })
    // );
  }

  updatePassword(obj) {
    const url = this.ip + "change-password";
    return this.http.post(url, obj, this.httpOptions);
  }

  removePlanedCall(obj) {
    obj = this.UrlEncodeMaker(obj);
    const url = this.ip + "remove-plan-call";
    return this.http.post(url, obj, this.httpOptions);
  }

  editRole(type_description, selectedRoleId ) {
    const filter = JSON.stringify({
      // act: 1,
      type_description: type_description,
      selectedRoleId:selectedRoleId              
    });
    const url = this.ip + "editRoleController";
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

  getDashboardData(obj) {
    let body = null;
    if (obj != null) {
      body = this.UrlEncodeMaker(obj);
      // `zoneId=${obj.zoneId}&regionId=${obj.regionId}&endDate=${obj.endDate}&startDate=${obj.startDate}&distributionId=${obj.distributionId}&cityId=${obj.cityId}&storeType=${obj.storeType}&channelId=${obj.channelId}`;
    }
    const url = this.ip + "dashboardDataSummary";
    return this.http.post(url, body, this.httpOptions);
    // .pipe(
    //   timeout(60000),
    //   catchError(e => {
    //     this.toastr.error('Due to limited connectivity your request could not be completed, please try again', 'Request Timeout');
    //     return of(null);
    //   })
    // );
  }

  checkDate() {
    // let date=new Date()
    // let today=localStorage.getItem('today');
    // if(today && moment(date).format('YYYY-MM-DD')!==today){
    //   localStorage.clear();
    //   alert('Your session is expired ,please login again.');
    //   this.router.navigate(['/login']);
    // }
  }

  getLineChartData() {
    const url = this.ip + "completionData";
    return this.http.post(url, {}, this.httpOptions);
    // .pipe(
    //   timeout(60000),
    //   catchError(e => {
    //     this.toastr.error('Due to limited connectivity your request could not be completed, please try again', 'Request Timeout');
    //     return of(null);
    //   })
    // );
  }

  getTableList(obj) {
    const body = this.UrlEncodeMaker(obj);
    // `zoneId=${obj.zoneId}&regionId=${obj.regionId}&endDate=${obj.endDate}&startDate=${obj.startDate}&merchandiserId=${obj.merchandiserId}`;
    const url = this.ip + "completedShopList";
    return this.http.post(url, body, this.httpOptions);
    // .pipe(
    //   timeout(60000),
    //   catchError(e => {
    //     this.toastr.error('Due to limited connectivity your request could not be completed, please try again', 'Request Timeout');
    //     return of(null);
    //   })
    // );
  }

  getTableSroList(obj) {
    const body = this.UrlEncodeMaker(obj);
    // `zoneId=${obj.zoneId}&regionId=${obj.regionId}&endDate=${obj.endDate}&startDate=${obj.startDate}&merchandiserId=${obj.merchandiserId}`;
    const url = this.ip + "completedSroShopList";
    return this.http.post(url, body, this.httpOptions);
    // .pipe(
    //   timeout(60000),
    //   catchError(e => {
    //     this.toastr.error('Due to limited connectivity your request could not be completed, please try again', 'Request Timeout');
    //     return of(null);
    //   })
    // );
  }

  getMerchandiserListForEvaluation(obj) {
    const urlEncode = this.UrlEncodeMaker(obj);
    const url = this.ip + "merchandiserList";
    return this.http.post(url, urlEncode, this.httpOptions);
  }

  merchandiserShopList(obj) {
    const urlEncode = this.UrlEncodeMaker(obj);
    const url = this.ip + "merchandiserShopList";
    return this.http.post(url, urlEncode, this.httpOptions);
    // .pipe(
    //   timeout(60000),
    //   catchError(e => {
    //     this.toastr.error('Due to limited connectivity your request could not be completed, please try again', 'Request Timeout');
    //     return of(null);
    //   })
    // );
  }

  //#region FILTER CALL
  getZone() {
    this.user_id = localStorage.getItem("user_id");
    const filter = JSON.stringify({ act: 0, userId: this.user_id });
    const url = this.ip + "loadFilters";
    return this.http.post(url, filter);
  }

  getZoneByCluster(clusterId) {
    this.user_id = localStorage.getItem("user_id");
    const filter = JSON.stringify({
      act: 18,
      userId: this.user_id,
      clusterId: clusterId,
    });
    const url = this.ip + "loadFilters";
    return this.http.post(url, filter);
  }

  // for system attendance remarks
  getSystemAttendanceRemarks() {
    this.user_id = localStorage.getItem("user_id");
    const filter = JSON.stringify({
      act: 40,
      userId: this.user_id,
    });
    const url = this.ip + "loadFilters";
    return this.http.post(url, filter);
  }

  getAllClusters() {
    this.user_id = localStorage.getItem("user_id");
    const filter = JSON.stringify({ act: 17, userId: this.user_id });
    const url = this.ip + "loadFilters";
    return this.http.post(url, filter);
  }

  getQueryTypeList(reportId) {
    this.user_id = localStorage.getItem("user_id");

    const filter = JSON.stringify({ act: 12, reportId: reportId });
    const url = this.ip + "loadFilters";
    return this.http.post(url, filter);
  }

  getQueryList(reportId) {
    this.user_id = localStorage.getItem("user_id");
    const filter = JSON.stringify({
      act: 30,
      userId: this.user_id,
      reportId: reportId,
    });
    const url = this.ip + "loadFilters";
    return this.http.post(url, filter);
  }

  getChillerList(channelId) {
    const filter = JSON.stringify({ act: 20, channelId: channelId });
    const url = this.ip + "loadFilters";
    return this.http.post(url, filter);
  }

  getChillerListNew(channelId) {
    const filter = JSON.stringify({ act: 32, channelId: channelId });
    const url = this.ip + "loadFilters";
    return this.http.post(url, filter);
  }

  getDistinctChillerList() {
    const filter = JSON.stringify({ act: 20 });
    const url = this.ip + "loadFilters";
    return this.http.post(url, filter);
  }
  getReportList() {
    this.user_id = localStorage.getItem("user_id");

    const filter = JSON.stringify({ act: 14, userId: this.user_id });
    const url = this.ip + "loadFilters";
    return this.http.post(url, filter);
  }

  updateRouteStatus(obj) {
    const url = this.ip + "shopWiseRouteCount"; //surveyorroutelistcontroller
    return this.http.post(url, obj);
  }

  insertShopsIds(data) {
    const obj2 = {
      obj: data,
    };
    const url = this.ip + "insertShopsIds"; //surveyorroutelistcontroller
    return this.http.post(url, obj2);
  }

  updateMenus(roleId, menus) {
    //const filter = JSON.stringify({ act: 30, obj: obj });
    const obj = JSON.stringify({
      // act: 2,
      roleId: roleId,
      menus: menus,
    });
    const url = this.ip + "updateMenu";
    return this.http.post(url, obj);
  }

  insertRole(type_description, active) {
    const filter = JSON.stringify({
      // act: 1,
      type_description: type_description,
      active: active,
    });
    const url = this.ip + "createRoleController";
    return this.http.post(url, filter);
  }

  insertUser(data) {
    const filter = JSON.stringify({
      // act: 1,
      obj: data,
    });
    const url = this.ip + "createUserController";
    return this.http.post(url, filter);
  }

  insertSurveyor(obj) {
    console.log("insertSurveyor: ", obj);
    const filter = JSON.stringify({
      obj: obj,
    }); 
    //return obj;
    const url = this.ip + "addSurveyorController";
    return this.http.post(url, filter);
  }

  getAppBuilds() {
    console.log("getAppBuilds: ");
    const filter = JSON.stringify({
      obj: "appBuildReq",
    });
    //return obj;
    const url = this.ip + "appBuildsController";
    // return this.http.get(url);
    return this.http.post(url, filter);
  }

  updateUserData(
    id,
    name,
    password,
    active,
    roleId,
    clusterIds,
    zoneIds,
    regionIds
  ) {
    const filter = JSON.stringify({
      // act: 1,
      id: id,
      name: name,
      password: password,
      active: active,
      roleId: roleId,
      clusterIds: clusterIds,
      zoneIds: zoneIds,
      regionIds: regionIds,
    });
    const url = this.ip + "updateUserController";
    return this.http.post(url, filter);
  }

  getProductList(obj) {
    const urlencoded = this.UrlEncodeMaker(obj);
    const url = this.ip + "viewProductDetail"; //----------> ViewProductDetailsController
    return this.http.post(url, urlencoded, this.httpOptions);
  }

  getShopWiseRoutes(obj) {
    const urlencoded = this.UrlEncodeMaker(obj); // ------------> ShopWiseRoutesController
    const url = this.ip + "shopWiseRoutes";
    return this.http.post(url, urlencoded, this.httpOptions);
  }

  deleteShopWiseRoutes(obj) {
    const url = this.ip + "deleteShopWhopWiseRoutes"; // -----------> DeleteShopWiseRouteController
    return this.http.post(url, obj);
  }

  updateCategory(obj) {
    const url = this.ip + "updateProduct";
    return this.http.post(url, obj);
  }

  displayRouteStatus(obj) {
    const url = this.ip + "shopWiseRouteCount"; // SurveyorRouteListController
    return this.http.post(url, obj);
  }

  displayMenus(roleId) {
    //type_description
    const filter = JSON.stringify({ roleId: roleId });
    const url = this.ip + "menusListController";
    return this.http.post(url, filter);
  }

  displayUsers(roleId) {
    const filter = JSON.stringify({ roleId: roleId });
    const url = this.ip + "usersListController";
    return this.http.post(url, filter);
  }

  deleteRoutes(obj) {
    const url = this.ip + "shopWiseRouteCount";
    return this.http.post(url, obj);
  }

  getRemarksList() {
    const filter = JSON.stringify({ act: 11 });
    const url = this.ip + "loadFilters";
    return this.http.post(url, filter);
  }

  getRegions() {
    const url = this.ip + "loadFilters";
    const filter = JSON.stringify({ act: 13 });
    return this.http.post(url, filter);
  }

  getRoutes() {
    const url = this.ip + "loadFilters";
    const filter = JSON.stringify({ act: 29 });
    return this.http.post(url, filter);
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

  getRoles() {
    const url = this.ip + "loadFilters";
    const filter = JSON.stringify({ act: 28 });
    return this.http.post(url, filter);
  }

  getCities(regionId) {
    this.user_id = localStorage.getItem("user_id");

    const filter = JSON.stringify({
      act: 2,
      regionId: regionId,
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

  getProducts(categoryId) {
    this.user_id = localStorage.getItem("user_id");

    const filter = JSON.stringify({
      act: 5,
      category: categoryId,
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

  getAreas(channelId) {
    this.user_id = localStorage.getItem("user_id");

    const filter = JSON.stringify({
      act: 3,
      channelId: channelId,
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

  getMerchandiserList(obj) {
    this.user_id = localStorage.getItem("user_id");

    const filter = JSON.stringify({
      act: 4,
      regionId: obj.regionId,
      zoneId: obj.zoneId,
      date: obj.startDate,
      userId: this.user_id,
    });
    const url = this.ip + "loadFilters";

    // const url = this.ip + 'cbl-pdf';
    return this.http.post(url, filter);
    // .pipe(
    //   timeout(60000),
    //   catchError(e => {
    //     this.toastr.error('Due to limited connectivity your request could not be completed, please try again', 'Request Timeout');
    //     return of(null);
    //   })
    // );
  }

  //#endregion

  downloadMerchandiserPDF(obj) {
    const httpParams = new FormData();
    httpParams.append("reportType", "");
    httpParams.append("zoneId", obj.zoneId);
    httpParams.append("regionId", obj.regionId);
    httpParams.append("startDate", obj.startDate);
    httpParams.append("surveyorId", obj.surveyorId);

    const url = this.ip + `cbl-pdf`;
    const o = `surveyorId=${obj.surveyorId}&startDate=${obj.startDate}`;
    return this.http.post(url, o, this.httpOptions);
    // .pipe(
    //   timeout(60000),
    //   catchError(e => {
    //     this.toastr.error('Due to limited connectivity your request could not be completed, please try again', 'Request Timeout');
    //     return of(null);
    //   })
    // );
  }

  getShopLocationApprovalData(obj) {
    const filter = JSON.stringify({
      regionId: obj.regionId,
      zoneId: obj.zoneId,
    });
    const url = this.ip + "shopLocationApprovalController";
    return this.http.post(url, filter);
  }
  updateShopLocationApproval(obj) {
    const filter = JSON.stringify({ obj: obj });
    const url = this.ip + "/updateShopLocationApprovalController";
    return this.http.post(url, filter);
  }

  getSamsungClaimData(obj) {
    const filter = JSON.stringify({
      regionId: obj.regionId,
      zoneId: obj.zoneId,
      claimId: obj.claimId,
      surveyorIds: obj.surveyorIds,
    });
    const body = this.UrlEncodeMaker(obj);
    const url = this.ip + "samsungClaimManagementController";
    return this.http.post(url, body, this.httpOptions);
  }

  getSystemAttendanceData(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url = this.ip + "systemAttendanceDataController";
    return this.http.post(url, body, this.httpOptions);
  }

  updatetSystemAttendanceDataRemarks(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url = this.ip + "systemAttendanceDataController";
    return this.http.post(url, body, this.httpOptions);
  }

  updateSamsungClaimData(obj) {
    const filter = JSON.stringify({ obj: obj });
    const url = this.ip + "/updateSamsungClaimManagementController";
    return this.http.post(url, filter);
  }

  getKeyForProductivityReport(body, reportUrl) {
    this.updatedDownloadStatus(true);
    const url = this.ip + reportUrl;
    return this.http.post(url, body, this.httpOptions);
    // .pipe(
    //   timeout(60000),
    //   catchError(e => {
    //     this.toastr.error('Due to limited connectivity your request could not be completed, please try again', 'Request Timeout');
    //     return of(null);
    //   })
    // );
  }

  getKeyForDashboardReport(reportUrl, obj) {
    this.updatedDownloadStatus(true);
    const url = this.ip + reportUrl;
    return this.http.post(url, obj);
  }


  getKeyForDashboardReportNew(reportUrl, obj) {
    // this.updatedDownloadStatus(true);
    const url = this.ip + reportUrl;
    return this.http.post(url, obj);
  }

  public DownloadResource(obj, url) {
    let path;

    path = this.ip + url;

    const form = document.createElement("form");

    form.setAttribute("action", path);

    form.setAttribute("method", "post");
    // form.setAttribute('target', '_blank');

    document.body.appendChild(form);

    this.appendInputToForm(form, obj);

    form.submit();

    document.body.removeChild(form);
  }

  private appendInputToForm(form, obj) {
    Object.keys(obj).forEach((key) => {
      const input = document.createElement("input");

      input.setAttribute("value", obj[key]);

      input.setAttribute("name", key);

      form.appendChild(input);
    });
  }

  updateImeiStatus(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url = this.ip + "add-imei-update-imei-status";
    return this.http.post(url, body, this.httpOptions);
  }

  getImeis() {
    const url = this.ip + "add-imei-update-imei-status";
    return this.http.get(url, this.httpOptions);
  }

  uploadImei(obj) {
    const url = this.ip + "add-imei-update-imei-status";
    // @ts-ignore
    return this.http.post(url, obj);
  }

  uploadRoutes(obj) {
    const url = this.ip + "UploadRoutesControllerNew";
    return this.http.post(url, obj);
  }

  uploadSpinTheWheel(obj) {
    let params = new HttpParams();
    params = params.set("user_id", this.user_id);
    const url = this.ip + "/uploadSpinTheWheelController";
    return this.http.post(url, obj, { params: params });
  }

  getSpinTheWheelFilesList() {
    const filter = JSON.stringify({ act: 36 });
    const url = this.ip + "loadFilters";
    return this.http.post(url, filter);
  }

  getSpinTheWheelPrizesList() {
    const filter = JSON.stringify({ act: 37 });
    const url = this.ip + "loadFilters";
    return this.http.post(url, filter);
  }

  getSpinTheWheelPrizesListWithWinnersCount(fileId) {
    const filter = JSON.stringify({
      act: 38,
      fileId: fileId,
    });
    const url = this.ip + "loadFilters";
    return this.http.post(url, filter);
  }

  startSpinTheWheel(fileId, prizeId, totalWinners) {
    let obj = {
      user_id: this.user_id,
      fileId: fileId,
      prizeId: prizeId,
      totalWinners: totalWinners,
    };
    const url = this.ip + "/spinTheWheelDrawController";
    return this.http.post(url, obj);
  }

  uploadSamsungSalesAchievement(obj) {
    const url = this.ip + "/uploadSamsungSalesAchievemnetController";
    return this.http.post(url, obj);
  }

  uploadSamsungRetailerData(obj) {
    const url = this.ip + "/uploadSamsungRetailerDataController";
    return this.http.post(url, obj);
  }

  uploadHurdleRates(obj) {
    const url = this.ip + "update-hurdle-rates"; //  ---------> UploadHurdleRatesController
    return this.http.post(url, obj);
  }

  uploadSOS(obj) {
    const url = this.ip + "update-desied-sos"; //  ---------> UploadDesiredSOSController
    return this.http.post(url, obj);
  }

  uploadVDHurdleRate(obj) {
    const url = this.ip + "update-vd-hurdle-rates"; //  ---------> UploadHurdleRatesController
    return this.http.post(url, obj);
  }
  getKey(obj) {
    const body = this.UrlEncodeMaker(obj);
    return this.http.post(this.ip + "tableauTicket", body, this.httpOptions);
  }

  getMerchandiserScore(obj) {
    const urlEncode = this.UrlEncodeMaker(obj);
    const url = this.ip + "merchandiserScore";
    return this.http.post(url, urlEncode, this.httpOptions);
  }
  getMerchandiserWiseScore(obj) {
    const urlEncode = this.UrlEncodeMaker(obj);
    const url = this.ip + "merchandiserWiseScore";
    return this.http.post(url, urlEncode, this.httpOptions);
  }

  getEvaluationSummary(obj) {
    const urlEncode = this.UrlEncodeMaker(obj);
    const url = this.ip + "evaluatorSummaryData";
    return this.http.post(url, urlEncode, this.httpOptions);
  }

  getEvaluatorList() {
    const filter = JSON.stringify({ act: 15 });
    const url = this.ip + "loadFilters";
    return this.http.post(url, filter);
  }

  getEvaluatorData() {
    const filter = JSON.stringify({ act: 26 });
    const url = this.ip + "loadFilters";
    return this.http.post(url, filter);
  }

  getSurveyors(clusterId, zoneId, regionId) {
    const filter = JSON.stringify({
      act: 19,
      clusterId: clusterId,
      zoneId: zoneId,
      regionId: regionId,
    });
    const url = this.ip + "loadFilters";
    return this.http.post(url, filter);
  }

  updateSurveyorData(obj) {
    const url = this.ip + "updateSurveyor"; // -----------> UpdateSurveyorController
    return this.http.post(url, obj);
  }

  getAllShops(zoneId, regionId) {
    const filter = JSON.stringify({
      act: 16,
      zoneId: zoneId,
      regionId: regionId,
    });
    const url = this.ip + "loadFilters";
    return this.http.post(url, filter);
  }

  getMerchandiserRoaster(obj) {
    const urlEncode = this.UrlEncodeMaker(obj);
    const url = this.ip + "/merchandiser-roaster";
    return this.http.post(url, urlEncode, this.httpOptions);
  }

  getHurdleRates(obj) {
    const urlEncode = this.UrlEncodeMaker(obj); //------------> DisplayHurdleRatesController
    const url = this.ip + "get_hurdle_rates";
    return this.http.post(url, urlEncode, this.httpOptions);
  }

  getDesiredSOS(obj) {
    const urlEncode = this.UrlEncodeMaker(obj);
    const url = this.ip + "get_desired_sos";
    return this.http.post(url, urlEncode, this.httpOptions);
  }
  getChillerProductList(obj) {
    const urlEncode = this.UrlEncodeMaker(obj); // ---------> ChillerProductListMapController
    const url = this.ip + "chillerProductList";
    return this.http.post(url, urlEncode, this.httpOptions);
  }

  updateChillerProductList(obj) {
    const url = this.ip + "updateChillerProductData"; //----------> UpdateChillerProductStatus
    return this.http.post(url, obj);
  }
  insertChiller(obj, urlMapping) {
    const url = this.ip + urlMapping; // -----------> CreateChillerController || UpdateChillerController
    return this.http.post(url, obj);
  }
  getUniqueChillerProductList() {
    const filter = JSON.stringify({ act: 23 });
    const url = this.ip + "loadFilters";
    return this.http.post(url, filter);
  }
  updateChillerPlanograms(obj) {
    const url = this.ip + "updateChillerPlanogram"; //----------> UpdateChillerPlanogramController
    return this.http.post(url, obj);
  }
  getChillerPlanogramList(obj) {
    const urlEncode = this.UrlEncodeMaker(obj); // ---------> ChillerPlanogramListController
    const url = this.ip + "chillerPlanogramList";
    return this.http.post(url, urlEncode, this.httpOptions);
  }
  insertChillerPlanogram(obj) {
    const url = this.ip + "insert-chiller-planogram"; // -----------> InsertChillerPlanogramController
    return this.http.post(url, obj);
  }
  getVDHurdleRate(obj) {
    const urlEncode = this.UrlEncodeMaker(obj);
    const url = this.ip + "vdHurdleRateList"; // ---------> VdHurdleRateListController
    return this.http.post(url, urlEncode, this.httpOptions);
  }

  getFilterData(obj) {
    const url = this.ip + "loadFilters";
    return this.http.post(url, obj);
  }

  addUpdateEmail(obj, url) {
    return this.http.post(this.ip + url, obj);
  }

  addUpdateEmailById(obj) {
    // const objId={
    //   id: id
    // }
    const obj2 = this.UrlEncodeMaker(obj);
    const url = this.ip + "/updateEmail";
    return this.http.post(url, obj2, this.httpOptions);
  }

  getProductSets() {
    const filter = JSON.stringify({ act: 25 });
    const url = this.ip + "loadFilters";
    return this.http.post(url, filter);
  }

  downloadFile(obj, url) {
    let path;

    path = this.ip + url;

    const form = document.createElement("form");

    form.setAttribute("action", path);

    form.setAttribute("method", "post");

    document.body.appendChild(form);

    this.appendInputToForm(form, obj);

    form.submit();

    document.body.removeChild(form);
  }

  getDistributionCheckInList(obj) {
    const urlEncode = this.UrlEncodeMaker(obj);
    const url = this.ip + "distCheckInList";
    return this.http.post(url, urlEncode, this.httpOptions);
  }

  // compliance tags working
  getComplianceTableData(obj) {
    const urlEncode = this.UrlEncodeMaker(obj);
    const url = this.ip + "complianceTableDataController";
    return this.http.post(url, urlEncode, this.httpOptions);
  }

  getPtcFileData(obj) {
    const urlEncode = this.UrlEncodeMaker(obj);
    const url = this.ip + "ptcFileDataController";
    return this.http.post(url, urlEncode, this.httpOptions);
  }

  updateComplianceTableData(obj) {
    const urlEncode = this.UrlEncodeMaker(obj);
    const url = this.ip + "complianceTableDataController";
    return this.http.post(url, urlEncode, this.httpOptions);
  }
  // compliance tags working end

  // employe list working
  getEmployeeList(obj) {
    // const body = this.UrlEncodeMaker(obj);
    const body = JSON.stringify({
      surveyorType: obj.surveyorType,
      mustHave: obj.mustHave,
    });
    const url = this.ip + "/employeeListController";
    return this.http.post(url, body);
  }

  insertEmployeeFromPortal(obj) {
    const url = this.ip + "/insertEmployeeController";
    return this.http.post(url, obj);
  }

  updateEmployeeStatus(obj) {
    const body = JSON.stringify({ obj: obj });
    const url = this.ip + "/updateEmployeeStatusController";
    return this.http.post(url, body);
  }

  updateDate(obj) {
    const body = JSON.stringify({ obj: obj });
    const url = this.ip + "/updateEmployeeInActivatedDateController";
    return this.http.post(url, body);
  }

  updateEmployeeName(obj) {
    // const body = JSON.stringify({ obj: obj });
    const body = obj;
    const url = this.ip + "/updateEmployeeNameController";
    return this.http.post(url, body);
  }
  // employe list working end

  getHrIncentiveData(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url = this.ip + "samsungHrIncentivesController";
    return this.http.post(url, body, this.httpOptions);
  }

  updateHrIncentives(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url = this.ip + "samsungHrIncentivesController";
    return this.http.post(url, body, this.httpOptions);
  }

  insertHrIncentives(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url = this.ip + "samsungHrIncentivesController";
    return this.http.post(url, body, this.httpOptions);
  }

  uploadHrIncentives(obj) {
    const url = this.ip + "/uploadSamsungHrIncentiveController";
    return this.http.post(url, obj);
  }

  getTsmTargetSummary(obj) {
    const url = this.ip + "/app/tsm-target-summary"; // TsmTargetSummaryController
    return this.http.post(url, obj);
  }
  getTsmProductivitySummaryData(obj) {
    const url = this.ip + "/app/tsm-productivity-summary"; // TsmProductivitySummaryController
    return this.http.post(url, obj);
  }

  getMarketIntelligenceData(obj) {
    const url = this.ip + "/marketIntelligenceData"; // -----------> MarketIntelligenceDataController
    const body = this.UrlEncodeMaker(obj);
    return this.http.post(url, body, this.httpOptions);
  }
  getMarketIntelligenceDetail(obj) {
    const url = this.ip + "/marketIntelligenceDetailController"; // -----------> MarketIntelligenceDetailController
    const body = this.UrlEncodeMaker(obj);
    return this.http.post(url, body, this.httpOptions);
  }

  // payroll working methods //
  getPayrollProcessMonth(obj){
    debugger;
    const body = this.UrlEncodeMaker(obj);
    const url = this.ip +"/payrollProcessController";
    return this.http.post(url,body, this.httpOptions);
  }

  getPayrollUnprocessMonth(obj){
    debugger;
    const body = this.UrlEncodeMaker(obj);
    const url = this.ip +"/payrollUnprocessController";
    return this.http.post(url,body, this.httpOptions);
  }

  savePayrollProcess(obj){
    debugger;
    const body = this.UrlEncodeMaker(obj);
    const url = this.ip +"/payrollProcessController";
    return this.http.post(url,body, this.httpOptions);
  }

  savePayrollUnprocess(obj){
    debugger;
    const body = this.UrlEncodeMaker(obj);
    const url = this.ip +"/payrollUnprocessController";
    return this.http.post(url,body, this.httpOptions);
  }

  // payroll working methods end //


  uploadTgtFile(obj) {
    const url = this.ip + "/uploadTgtFile";
    return this.http.post(url, obj);
  }
  uploadSalesFile(obj) {
    const url = this.ip + "/uploadSalesFile";
    return this.http.post(url, obj);
  }

  getSndKpisData(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url = this.ip + "viewSndKpisData";
    return this.http.post(url, body, this.httpOptions);
    // const filter = JSON.stringify(obj);
    // const url = this.ip + "viewSndKpisData";
    // return this.http.post(url, filter);
  }

  uploadSndKpisData(obj) {
    const url = this.ip + "/uploadSndKpisData";
    return this.http.post(url, obj);
  }

  uploadReportTemplate(obj) {
    const url = this.ip + "/uploadReportTemplateController";
    return this.http.post(url, obj);
  }

  getDashboardReorts(reportId) {
    this.user_id = localStorage.getItem("user_id");

    const filter = JSON.stringify({ act: 44, reportId: reportId });
    const url = this.ip + "loadFilters";
    return this.http.post(url, filter);
  }

  uploadComplianceData(file: any, userId: string, userName: string) {
    const url = this.ip + "/upload-compliance";
    let formData=new FormData()
    formData.append("file",file)
    formData.append("userId",userId)
    formData.append("userName",userName)
      return this.http.post(url,formData);
  }

  uploadPtcFileData(file: any, userId: string, userName: string) {
    const url = this.ip + "/uploadPtcFile";
    let formData=new FormData()
    formData.append("file",file)
    formData.append("userId",userId)
    formData.append("userName",userName)
      return this.http.post(url,formData);
  }

  samlLogin(){
    const url = this.ip + "/saml/login";
    return this.http.post(url, {}, { responseType: 'text' });
  }

  enableForceRelogIn(obj){
    const url = this.ip + "update-survey";
    const body = this.UrlEncodeMaker(obj);
    return this.http.post(url,body,this.httpOptions);
  }
}
