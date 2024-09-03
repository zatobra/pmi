import { Component, OnInit, ViewChildren } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Config } from "src/assets/config";
import { environment } from "src/environments/environment";
import { ActivatedRoute } from "@angular/router";

import { EvaluationService } from "../evaluation.service";
import { DashboardService } from "../../dashboard.service";
import * as moment from "moment";

@Component({
  selector: "app-zsm-redflag-shops",
  templateUrl: "./zsm-redflag-shops.component.html",
  styleUrls: ["./zsm-redflag-shops.component.scss"],
})
export class ZsmRedflagShopsComponent implements OnInit {
  minDate = new Date(2000, 0, 1);
  maxDate = new Date();
  startDate = new Date();
  endDate = new Date();
  sortOrder: any;
  sortBy: any;
  // ip = environment.ip;
  @ViewChildren("checked") private myCheckbox: any;
  ip: any = Config.BASE_URI;
  tableData: any = [];
  headingsList: any = [];
  reevaluatorRole: any;
  userType: any;
  loading = false;
  isExternalUrl = false;
  zsmRole: any;
  isEvaluationEnabled = false;
  selectedSurveys: any = [];
  loadingData = false;
  programId = -1;
  labels: any;
  zones: any = [];
  clusterList: any = [];
  selectedZone: any = {};
  selectedRegion: any = {};
  regions: any = [];
  stats: any = {};

  constructor(
    private toastr: ToastrService,
    private httpService: EvaluationService,
    public activatedRoutes: ActivatedRoute,
    private dashboardService: DashboardService
  ) {
    this.zones = JSON.parse(localStorage.getItem("zoneList"));
    this.labels = JSON.parse(localStorage.getItem("labelProperties"));
    this.clusterList = JSON.parse(localStorage.getItem("clusterList"));
    this.activatedRoutes.params.subscribe((params) => {
      this.getTableData();
      if (params.programId) {
        this.programId = params.programId;
      }
    });
    // this.getTableData();
  }

  ngOnInit() {
    // this.getAllRegions();
    // this.getTableData();
    // const that = this;
    // document.addEventListener("visibilitychange", function (e) {
    //   console.log(document.hidden);
    //   if (!document.hidden) {
    //     that.getTableData();
    //   }
    // });
    this.getTableData();
  }

  getTableData() {
    this.tableData = [];
    this.loadingData = true;
    const obj = {
      userId: localStorage.getItem("u_surveyor_id"),
      zoneId: this.selectedZone.id
        ? this.selectedZone.id == -1
          ? localStorage.getItem("zoneId")
          : this.selectedZone.id
        : localStorage.getItem("zoneId"),
      regionId: this.selectedRegion.id
        ? this.selectedRegion.id == -1
          ? localStorage.getItem("regionId")
          : this.selectedRegion.id
        : localStorage.getItem("regionId"),
      startDate: moment(this.startDate).format("YYYY-MM-DD"),
      endDate: moment(this.endDate).format("YYYY-MM-DD"),
    };
    this.httpService.getZsmRedFlagShops(obj).subscribe(
      (data) => {
        // console.log(data);
        this.tableData = data;
        this.getStats();
        this.loadingData = false;
        if (this.tableData.length === 0) {
          this.loading = false;

          this.toastr.info("No record found.");
        }
      },
      (error) => {
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
        this.loading = false;
        this.loadingData = false;
      }
    );
  }

  gotoNewPage(item) {
    window.open(
      `${environment.hash}dashboard/evaluation/list/details/${item.surveyId}?shopId=${item.shopId}&surveyorId=${item.surveyorId}&visitDate=${item.visitDate}&surveyorType=2`,
      "_blank"
    );
  }

  checkUncheckSingle(event, item) {
    if (event.checked === true) {
      this.selectedSurveys.push(item.surveyId);
    } else {
      const i = this.selectedSurveys.indexOf(item.surveyId);
      this.selectedSurveys.splice(i, 1);
    }
    console.log(
      "checkUncheckSingle this. selectedSurveys: ",
      this.selectedSurveys
    );
  }

  checkUncheckAll(event) {
    let data = this.tableData?.filter(
      (e) =>
        e.programId == this.programId &&
        // e.zsmVerifiedStatus == "Disapproved" ||
        e.zsmVerifiedStatus == "Pending"
    );
    console.log("data: ", data);
    if (event.checked === true) {
      for (let i = 0; i < data?.length; i++) {
        if (this.selectedSurveys.indexOf(data[i].surveyId) == -1) {
          this.selectedSurveys.push(data[i].surveyId);
        }
      }
      for (let index = 0; index < this.myCheckbox._results.length; index++) {
        this.myCheckbox._results[index]._checked = true;
      }
    } else {
      for (let i = 0; i < data?.length; i++) {
        const i = this.selectedSurveys.indexOf("surveyId");
        this.selectedSurveys.splice(i, 1);
        this.selectedSurveys = [];
      }
      for (let index = 0; index < this.myCheckbox._results.length; index++) {
        this.myCheckbox._results[index]._checked = false;
      }
    }
    console.log(
      "checkUncheckAll this. selectedSurveys: ",
      this.selectedSurveys
    );
  }

  evaluateShops(status) {
    this.loading = true;
    const obj = {
      userId: localStorage.getItem("u_surveyor_id"),
      isZsmRedFlagShopRequest: true,
      surveyIds: this.selectedSurveys,
      status: status,
    };
    this.httpService.evaluateZsmShops(obj).subscribe(
      (data: any) => {
        if (data.id == 1) {
          this.toastr.success(data.title, data.description);
          this.selectedSurveys = [];
          for (
            let index = 0;
            index < this.myCheckbox._results.length;
            index++
          ) {
            this.myCheckbox._results[index]._checked = false;
          }
          this.getTableData();
          this.loading = false;
        } else {
          this.toastr.error(data.title, data.description);
        }
      },
      (error) => {
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
        this.loading = false;
      }
    );
  }

  zoneChange() {
    this.loadingData = true;
    this.selectedRegion = {};

    this.dashboardService.getRegion(this.selectedZone.id).subscribe(
      (data) => {
        const res: any = data;
        if (res) {
          this.regions = res;
          console.log("getAllRegions: ", this.regions);
        } else {
          this.clearLoading();

          this.toastr.info(
            "Something went wrong,Please retry",
            "Connectivity Message"
          );
        }

        setTimeout(() => {
          this.loadingData = false;
        }, 500);
      },
      (error) => {
        this.clearLoading();
      }
    );
  }

  getAllRegions() {
    this.loadingData = true;
    this.dashboardService.getRegions().subscribe(
      (data) => {
        const res: any = data;
        if (res.regionList) {
          this.regions = res.regionList;
          console.log("getAllRegions: ", this.regions);

          // localStorage.setItem('regionList', JSON.stringify(res.regionList));
        }
        if (!res.regionList) {
          this.toastr.info("No data Found", "Info");
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

  clearLoading() {
    this.loadingData = false;
  }

  getArrowType(key) {
    if (key === this.sortBy) {
      return this.sortOrder ? "arrow_upward" : "arrow_downward";
    } else {
      return "";
    }
  }

  sortIt(key) {
    this.sortBy = key;
    this.sortOrder = !this.sortOrder;
  }

  sortColumn = "name";
  sortOrder2 = "asc";

  toggleSortOrder() {
    console.log("toggleSortOrder: ");
    this.sortOrder2 = this.sortOrder2 === "asc" ? "desc" : "asc";
    this.sortData();
  }

  sortData() {
    this.tableData.sort((a, b) => {
      const aValue = a[this.sortColumn];
      const bValue = b[this.sortColumn];

      if (aValue < bValue) {
        return this.sortOrder2 === "asc" ? -1 : 1;
      } else if (aValue > bValue) {
        return this.sortOrder2 === "asc" ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  toggleSortOrder2() {
    console.log("toggleSortOrder2: ");
    this.sortOrder2 = this.sortOrder2 === "asc" ? "desc" : "asc";
    this.sortData2();
  }

  sortData2() {
    this.tableData.forEach((item) => {
      item.surveyorList.sort((a, b) => {
        const aValue = a[this.sortColumn];
        const bValue = b[this.sortColumn];

        if (aValue < bValue) {
          return this.sortOrder2 === "asc" ? -1 : 1;
        } else if (aValue > bValue) {
          return this.sortOrder2 === "asc" ? 1 : -1;
        } else {
          return 0;
        }
      });
    });
  }

  getStats() {
    this.stats.total = this.tableData.reduce((visit) => {
      return visit + 1;
    }, 0);
    this.stats.ww = this.tableData.reduce((visit, val) => {
      if (val.programId == 1) return visit + 1;
      return visit;
    }, 0);
    this.stats.wwPending =
      this.stats.ww -
      this.tableData.reduce((visit, val) => {
        if (val.programId == 1 && val.zsmVerifiedStatus != "Pending")
          return visit + 1;
        return visit;
      }, 0);
    this.stats.wr = this.tableData.reduce((visit, val) => {
      if (val.programId == 2) return visit + 1;
      return visit;
    }, 0);
    this.stats.wrPending =
      this.stats.wr -
      this.tableData.reduce((visit, val) => {
        if (val.programId == 2 && val.zsmVerifiedStatus != "Pending")
          return visit + 1;
        return visit;
      }, 0);
    this.stats.perClosed = this.tableData.reduce((visit, val) => {
      if (val.programId == 3) return visit + 1;
      return visit;
    }, 0);
    this.stats.perClosedPending =
      this.stats.perClosed -
      this.tableData.reduce((visit, val) => {
        if (val.programId == 3 && val.zsmVerifiedStatus != "Pending")
          return visit + 1;
        return visit;
      }, 0);
    this.stats.newShops = this.tableData.reduce((visit, val) => {
      if (val.programId == 4) return visit + 1;
      return visit;
    }, 0);
    this.stats.newShopsPending =
      this.stats.newShops -
      this.tableData.reduce((visit, val) => {
        if (val.programId == 4 && val.zsmVerifiedStatus != "Pending")
          return visit + 1;
        return visit;
      }, 0);
    this.stats.editShops = this.tableData.reduce((visit, val) => {
      if (val.programId == 5) return visit + 1;
      return visit;
    }, 0);
    this.stats.editShopsPending =
      this.stats.editShops -
      this.tableData.reduce((visit, val) => {
        if (val.programId == 5 && val.zsmVerifiedStatus != "Pending")
          return visit + 1;
        return visit;
      }, 0);
  }

  showList(programId) {
    this.programId = programId;
  }
}
