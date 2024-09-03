import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Config } from "src/assets/config";

@Injectable({
  providedIn: "root",
})
export class InstotrackerService {
  isUserExist = false;
  ip = Config.BASE_URI;
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };
  user: any = 0;
  user_id: string;
  constructor(private http: HttpClient) {
    this.user = localStorage.getItem("user_id");

    this.httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
  }

  isUserLoginIn() {
    return this.isUserExist;
  }

  headerCTJson() {
    let header = new Headers({ "content-type": "application/json" });
    // header.append("userId",'80')
    // let header = new Headers({'userId':localStorage.getItem('Authorized')})
    // new Headers({ 'Access-Control-Allow-Origin': '*',
    // 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    // 'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
    // 'Access-Control-Allow-Credentials': true });
    return header;
  }

  // public getData(){
  //   let url=this.ip+'shopFacia?regionId&zoneId&startDate=2018-07-01&endDate=2018-07-01&shopIds=undefined&assetIds=undefined&competId=1&primId=1&channelId=undefined&json=y';
  //   // let httpOption = this.headerCTJson();
  //   // const option = new RequestOptions({ headers: httpOption });
  //   return this.http.post(url,null).map(
  //     response => response.json()
  //   );
  // }

  public getDataByDateRange(range: any) {
    let url = this.ip + "clientShopFacia";    // ClientShopImagesController
    return this.http.post(url, range, this.httpOptions);
  }

  public getSingleShop(obj: any) {
    let url = this.ip + "singleShop-images";
    return this.http.post(url, obj, this.httpOptions);
  }

  login(cradentials: any) {
    // console.log(cradentials)

    let url = this.ip + "pictureLogin";
    return this.http.post(url, cradentials, this.httpOptions);
  }

  getZone() {
    var filter = JSON.stringify({ act: 0, userId: this.user });
    let url = this.ip + "loadFilters";

    return this.http.post(url, filter);

    // return this.http.post(url,filter).map(
    //   response => response.json()
    // );
  }

  getRegion(zoneId) {
    var filter = JSON.stringify({ act: 1, zoneId: zoneId, userId: this.user });
    let url = this.ip + "loadFilters";
    return this.http.post(url, filter);
  }

  getCities(regionId) {
    var filter = JSON.stringify({
      act: 2,
      regionId: regionId,
      userId: this.user,
    });
    let url = this.ip + "loadFilters";
    return this.http.post(url, filter);
  }

  getCategories(channelId) {
    var filter = JSON.stringify({
      act: 3,
      channelId: channelId,
      userId: this.user,
    });
    let url = this.ip + "loadFilters";
    return this.http.post(url, filter);
  }

  getDetailDataForShop(shopId: any, survayId?) {
    let obj = {
      shop_id: shopId,
      survey_id: -1,
      zone: "",
      region: "",
      city: "",
      channel_name: "",
      asset_name: "",
      image_type: "",
      userId: this.user,
    };

    let url = this.ip + "shopfacia-details";  // ClientShopImagesDetailController
    return this.http.post(url, JSON.stringify(obj));
  }

  getSuperSearch(search: String) {
    let obj = {
      shop_name: search,
      zone: "",
      region: "",
      city: "",
      channel_name: "",
      asset_name: "",
      image_type: "",
      userId: this.user,
    };

    let url = this.ip + "shopfacia-details";  // ClientShopImagesDetailController
    return this.http.post(url, JSON.stringify(obj));
  }

  getRegions() {
    const url = this.ip + "loadFilters";
    const filter = JSON.stringify({ act: 13 });
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

  // getRegion(zoneId) {
  //   this.user_id = localStorage.getItem("user_id");

  //   const filter = JSON.stringify({
  //     act: 1,
  //     zoneId: zoneId,
  //     userId: this.user_id,
  //   });
  //   const url = this.ip + "loadFilters";
  //   return this.http.post(url, filter);
  //   // .pipe(
  //   //   timeout(60000),
  //   //   catchError(e => {
  //   //     this.toastr.error('Due to limited connectivity your request could not be completed, please try again', 'Request Timeout');
  //   //     return of(null);
  //   //   })
  //   // );
  // }
}
