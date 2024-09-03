import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DashboardService } from "../dashboard.service";
import { ToastrService } from "ngx-toastr";
import * as moment from "moment";
import { NgModel } from "@angular/forms";
@Component({
  selector: "app-dashboard-data-menu",
  templateUrl: "./dashboard-data-menu.component.html",
  styleUrls: ["./dashboard-data-menu.component.scss"],
})
export class DashboardDataMenuComponent implements OnInit {

  @Input("queryId") queryId;
  @Output("data") data: any = new EventEmitter<any>();

  minDate = new Date(2000, 0, 1);
  maxDate = new Date();
  startDate = new Date();
  endDate = new Date();
  singleDate = new Date();
  queryList: any = [];
  selectedQuery: any = {};
  loadingData: boolean;
  loadingReportMessage = false;
  p: any = {};
  reportId = -1;
  title = "";
  selectedReportUrl = "";
  clusterList: any = [];
  zones: any = [];
  regions: any = [];
  selectedZone: any = {};
  selectedRegion: any = {};
  selectedBrand: any = {};
  selectedCluster: any = {};
  clusterId: any;
  labels: any;
  projectType: any;
  queryParams: any = [];
  selectedArea: any = {};
  areas: any = [];
  categories : any= [];
  selectedFold: any = {};
  selectedChannel: any = {};
  selectedCategory: any={};
  selectedChannelMulti: any = [];
  selectedCategoryMulti: any=[];
  reportData: any = {};
  channels: any = [];

  constructor(
    private activatedRoutes: ActivatedRoute,
    private httpService: DashboardService,
    public router: Router,
    private toastr: ToastrService
  ) {
    this.projectType = localStorage.getItem("projectType");
    this.labels = JSON.parse(localStorage.getItem("labelProperties"));
  }

  ngOnInit() {
    debugger;
    this.activatedRoutes.params.subscribe((params) => {
      if (params.reportId) {
        this.reportId = params.reportId;
      }
      if(!this.queryId){
        this.getQueryTypeList(this.reportId);
      }
      
    });

    if(this.queryId){
      this.getQueryTypeList(this.queryId);
    }

    // this.activatedRoutes.queryParams.subscribe((params) => {
    //   if (params.reportId) {
    //     this.reportId = params.reportId;
    //   }
    //   this.getQueryTypeList(this.reportId);
    // });
  }

  selectAll(select: NgModel, values) {
    select.update.emit(values);
  }

  deselectAll(select: NgModel) {
    select.update.emit([]);
  }

  equals(objOne, objTwo) {
    if (typeof objOne !== "undefined" && typeof objTwo !== "undefined") {
      return objOne.id === objTwo.id;
    }
  }

  getQueryTypeList(reportId: number) {
    debugger;
    this.loadingData = true;
    this.httpService.getQueryList(reportId).subscribe(
      (data: any) => {
        if (data) {
          this.reportData = data;
          this.queryList = data.reportList;
          this.loadQuery(reportId);
        }
        this.loadingData = false;
      },
      (error) => {
        this.loadingData = false;
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
      }
    );
  }

  showSuperviserInfoModal(surveyor) {
    this.data.emit(surveyor);
  }

  getDashboardData() {
    if (this.endDate >= this.startDate) {
      this.loadingData = true;
      // this.loadingReportMessage = true;
      // tslint:disable-next-line:triple-equals
      const url = "dashboard-data-new";
      this.httpService
        .getKeyForDashboardReportNew(url, this.getReportDataObj())
        .subscribe(
          (data: any) => {
            const res: any = data;

            if (res) {
              this.data.emit(res);
              this.clearLoading();
              // const obj2 = {
              //   key: res.key,
              //   fileType: res.fileType,
              // };
              // if (this.selectedQuery.type == 1) {
              //   this.selectedReportUrl = "downloadcsvReport";
              // } else {
              //   this.selectedReportUrl = "downloadReport";
              // }

              // this.getproductivityDownload(obj2, this.selectedReportUrl);
            } else {
              this.clearLoading();

              this.toastr.info(
                "Something went wrong,Please retry",
                "Connectivity Message"
              );
            }
          },
          (error) => {
            this.clearLoading();
          }
        );
    } else {
      this.clearLoading();
      this.toastr.info(
        "End date must be greater than start date",
        "Date Selection"
      );
    }
  }

  getReportDataObj() {
    let obj: any = {};
    obj.queryId = this.selectedQuery.id;
    for (const param of this.selectedQuery.parameterList) {
      if (param.populatedFrom == "Cluster") {
        obj.Cluster = this.selectedCluster.id
          ? this.selectedCluster.id == -1
            ? localStorage.getItem("clusterId")
            : this.selectedCluster.id
          : localStorage.getItem("clusterId");
      } else if (param.populatedFrom == "Zone") {
        obj.Zone = this.selectedZone.id
          ? this.selectedZone.id == -1
            ? localStorage.getItem("zoneId")
            : this.selectedZone.id
          : localStorage.getItem("zoneId");
      } else if (param.populatedFrom == "Region") {
        obj.Region = this.selectedRegion.id
          ? this.selectedRegion.id == -1
            ? localStorage.getItem("regionId")
            : this.selectedRegion.id
          : localStorage.getItem("regionId");
      } else if (param.populatedFrom == "Area") {
        obj.Area = this.selectedArea.id
          ? this.selectedArea.id == -1
            ? localStorage.getItem("areaId")
            : this.selectedArea.id
          : localStorage.getItem("areaId");
      } else if (param.populatedFrom == "start_date") {
        obj.start_date = moment(this.startDate).format("YYYY-MM-DD");
      } else if (param.populatedFrom == "end_date") {
        obj.end_date = moment(this.endDate).format("YYYY-MM-DD");
      } else if (param.populatedFrom == "date") {
        obj.date = moment(this.singleDate).format("YYYY-MM-DD");
      } else if (param.populatedFrom == "Fold") {
        obj.Fold = this.selectedFold.id || -1;
      }
      else if (param.populatedFrom == "Channel" && param.type == 'Single_Select') {
        obj.Channel = this.selectedChannel.id
        ? this.selectedChannel.id == -1
          ? localStorage.getItem("channelId")
          : this.selectedChannel.id
        : localStorage.getItem("channelId");
      }

      else if (param.populatedFrom == 'Channel' && param.type == 'Multi_Select') {
        obj.Channel = this.arrayAndStringMaker(this.selectedChannelMulti) || -1;
      }

      else if (param.populatedFrom == "Category" && param.type == 'Single_Select') {
        obj.Category = this.selectedCategory.id || -1;
      }

      else if (param.populatedFrom == "Category" && param.type == 'Multi_Select') {
        obj.Category = this.arrayAndStringMaker(this.selectedCategoryMulti) || -1;
      }

      // brand filter
      else if (param.populatedFrom == "Brand") {
        obj.Brand = this.selectedBrand.id || -1;
      }

        // Criteria filter
        // else if (param.populatedFrom == "Criteria") {
        //   obj.Criteria = this.selectedCriteria.title;
        // }
      
      
      // else if (
      //   param.populatedFrom == "Channel" &&
      //   param.type == "Single_Select"
      // ) {
      //   obj.Channel = this.selectedChannel.id || -1;
      // } else if (
      //   param.populatedFrom == "Channel" &&
      //   param.type == "Multi_Select"
      // ) {
      //   obj.Channel = this.arrayAndStringMaker(this.selectedChannelMulti) || -1;
      // }

    }
    return obj;
  }

  getproductivityDownload(obj: { key: any; fileType: any }, url: string) {
    const u = url;
    this.httpService.DownloadResource(obj, u);
    setTimeout(() => {
      this.loadingData = false;
      this.loadingReportMessage = false;
      this.httpService.updatedDownloadStatus(false);
    }, 1000);
  }

  clearLoading() {
    this.loadingData = false;
    this.loadingReportMessage = false;
  }

  loadQuery(reportId: number) {
    debugger;
    this.selectedQuery = this.queryList[0];
    if (reportId > -1 || this.queryId > -1) {
      this.title = this.selectedQuery.title;
    } else {
      this.title = "Raw Data";
    }
    this.clusterList = this.reportData.clusterList;
    this.zones = this.reportData.zoneList;
    this.regions = this.reportData.regionList;
    this.areas = this.reportData.areaList;
    this.categories = this.reportData.categoryList;
    this.channels =
      this.reportData.channelList ;
      console.log("channel",this.channels)
    this.setparamsVisibility(-1);
  }

  setparamsVisibility(parentId) {
    debugger;
    
    for (let i = 0; i < this.selectedQuery.parameterList.length; i++) {
      if (this.selectedQuery.parameterList[i].parentId == parentId) {
        if (parentId > -1) {
          this.loadFilters(i);
        }
        this.selectedQuery.parameterList[i].isVisible = true;
      }
    }
  }

  loadFilters(index) {
    debugger;
    if (this.selectedQuery.parameterList[index].populatedFrom == "Zone") {
      this.reportData.zoneList =
        this.selectedCluster.id == -1
          ? localStorage.getItem("zoneId") == "-1"
            ? this.zones
            : this.zones.filter((z) =>
                z.cluster
                  ? localStorage
                      .getItem("clusterId")
                      .split(",")
                      .includes(z.cluster.id + "")
                  : z
              )
          : localStorage.getItem("zoneId") == "-1"
          ? this.zones.filter((z) =>
              z.cluster ? z.cluster.id == this.selectedCluster.id : -1
            )
          : this.zones.filter((z) =>
              z.cluster
                ? z.cluster.id == this.selectedCluster.id &&
                  localStorage
                    .getItem("clusterId")
                    .split(",")
                    .includes(z.cluster.id + "")
                : z
            );
    } else if (
      this.selectedQuery.parameterList[index].populatedFrom == "Region"
    ) {
      this.reportData.regionList =
        this.selectedZone.id == -1
          ? localStorage.getItem("regionId") == "-1"
            ? this.regions
            : this.regions.filter((r) =>
                r.id == -1
                  ? r
                  : localStorage
                      .getItem("zoneId")
                      .split(",")
                      .includes(r.zone_id + "")
              )
          : localStorage.getItem("regionId") == "-1"
          ? this.regions.filter((r) =>
              r.id == -1 ? r : r.zone_id == this.selectedZone.id
            )
          : this.regions.filter((r) =>
              r.id == -1
                ? r
                : r.zone_id == this.selectedZone.id &&
                  localStorage
                    .getItem("zoneId")
                    .split(",")
                    .includes(r.zone_id + "")
            );
    } 


    // else if (
    //   this.selectedQuery.parameterList[index].populatedFrom == "Area"
    // ) {
    //   this.reportData.areaList =
    //     this.selectedRegion.id == -1
    //       ? localStorage.getItem("areaId") == "-1"
    //         ? this.areas

    //         // : this.areas.filter((a) =>
    //         //     a.id == -1 ? a : a.regionId == this.selectedRegion.id
    //         //   )


    //         : this.areas.filter((a) =>
    //             a.id == -1
    //               ? a
    //               : localStorage
    //                   .getItem("areaId")
    //                   .split(",")
    //                   .includes(a.id + "")
    //           )


    //       : localStorage.getItem("areaId") == "-1"
    //       ? this.areas.filter((a) =>
    //           a.id == -1 ? a : a.regionId == this.selectedRegion.id
    //         )
    //       : this.areas.filter((a) =>
    //           a.id == -1
    //             ? a
    //             : a.regionId == this.selectedRegion.id &&
    //               localStorage
    //                 .getItem("areaId")
    //                 .split(",")
    //                 .includes(a.id + "")
    //         );
    // }
    
    
    else if (
      this.selectedQuery.parameterList[index].populatedFrom == "Area"
    ) {
      this.reportData.areaList =
        this.selectedRegion.id == -1
          ? localStorage.getItem("areaId") == "-1"
            ? this.areas
            : this.areas.filter((a) =>
                a.id == -1 ? a : a.regionId == this.selectedRegion.id
              )
          : localStorage.getItem("areaId") == "-1"
          ? this.areas.filter((a) =>
              a.id == -1 ? a : a.regionId == this.selectedRegion.id
            )
          : this.areas.filter((a) =>
              a.id == -1
                ? a
                : a.regionId == this.selectedRegion.id &&
                  localStorage
                    .getItem("regionId")
                    .split(",")
                    .includes(a.regionId + "")
            );
    }


    // brand filter
    else if (
      this.selectedQuery.parameterList[index].populatedFrom == "Category"
    ) {
      debugger;
      this.reportData.categoryList =
      this.selectedBrand.id == -1
        ? this.categories
        : this.categories.filter((c) =>
            c.brand_id == this.selectedBrand.id
          )
     
    }
  }

  arrayAndStringMaker(selectedChannelMulti) {
    // console.log("(selectedChannelMulti)", selectedChannelMulti);
    // console.log(
    //   "this.arrayMaker(this.selectedChannel)",
    //   this.arrayMaker(selectedChannelMulti)
    // );
    let arr = this.arrayMaker(selectedChannelMulti);
    let str = arr.toString();
    console.log("arr: ", arr, "Returned string is : " + str);
    return str;
  }

  arrayMaker(arr) {
    const all = arr.filter((a) => a === "all");
    const result: any = [];
    if (all[0] === "all") {
      arr = this.channels;
    }
    arr.forEach((e) => {
      result.push(e.id);
    });
    return result;
  }
}
