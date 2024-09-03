import { Component, OnInit, ViewChild } from "@angular/core";
import { VirtualViewService } from "../virtual-view.service";
import { environment } from "src/environments/environment";
import { MatCardModule } from "@angular/material/card";
import { Config } from "src/assets/config";
import { Toast, ToastrService } from "ngx-toastr";
import * as moment from "moment";
import { NgModel } from "@angular/forms";
import { ModalDirective } from "ngx-bootstrap/modal";
import { ActivatedRoute, Router } from "@angular/router";
import * as _ from "lodash";
import { reduce } from "rxjs/operators";

@Component({
  selector: "app-vo-live-tracking",
  templateUrl: "./vo-live-tracking.component.html",
  styleUrls: ["./vo-live-tracking.component.scss"],
})
export class VoLiveTrackingComponent implements OnInit {
  @ViewChild("childModal") childModal: ModalDirective;
  title = "VO-Live-Tracking";

  supervisor: any = [];
  surveyor: any = [];
  selectedRegionFilter: any = -1;
  selectedSupervisorFilter: any = -1;
  selectedSurveyorFilter: any = -1;
  selectedDe: any = -1;
  selectedDsr: any = -1;
  chooseDate = new Date();
  startDate = new Date();
  endDate = new Date();
  userType: any = -1;
  latitude;
  longitude;
  trackedShops: any = [];
  trackedShops2: any = [];
  loadingFilter: boolean = false;
  prodata: any = [];
  minDate = new Date(2000, 0, 1);
  maxDate = new Date();
  legends;
  projectType;
  loadingMap = false;
  showMap = false;
  show: boolean;
  surveyorId: any;
  params: any = {};
  selectedZone: any = {};
  selectedRegion: any = {};
  selectedArea: any = {};
  selectedCity: any = {};
  selectedDistribution: any = {};
  regions: any = [];
  areas: any = [];
  zones: any = [];

  loadingData: boolean;

  colorType1 = "../../../../../assets/map-marker-icons/";
  colorType = Config.BASE_URI + "/images/map-marker-icons/";
  color = "red";
  loading = false;
  matLgened = false;
  labels: any = [];
  sortOrder = true;
  sortBy: "m_code";
  lastUpdateBeforeList: any = [
    { id: -1, value: "All" },
    { id: 1, value: "(<=30 Min)" },
    { id: 2, value: "(<=120 Min)" },
    { id: 3, value: "(>120 Min)" },
  ];
  selectedUpdate: any;

  constructor(
    private httpService: VirtualViewService,
    private toastr: ToastrService,
    private activeRoute: ActivatedRoute
  ) {
    // this.activeRoute.queryParams.subscribe((p) => {
    //   console.log("active params", p);
    //   this.params = p;
    //   if (p.surveyorId && p.startDate && p.userType) {
    //     this.getShopsTrackingBySurveyorId(p);
    //   }
    // });
    this.zones = JSON.parse(localStorage.getItem("zoneList"));
    this.labels = JSON.parse(localStorage.getItem("labelProperties"));
  }

  ngOnInit() {
    this.selectedUpdate = this.lastUpdateBeforeList[0];
    // tslint:disable-next-line:radix

    this.getSupervisorData();
    this.sortIt("m_code");
    this.latitude = 30.644579;
    this.longitude = 73.0948515;
    this.projectType = localStorage.getItem("projectType");
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

  getSupervisorData() {
    this.loading = true;
    const obj = {
      act: 21,
      userType: parseInt(localStorage.getItem("user_type")),
      userId: parseInt(localStorage.getItem("user_id")),
      surveyorId: parseInt(localStorage.getItem("u_surveyor_id")),
    };
    this.httpService.getSupervisorList(obj).subscribe((data) => {
      this.supervisor = data;
      this.loading = false;
    });
  }

  getSurveyourData() {
    this.loading = true;
    const obj = {
      act: 21,
      userType: parseInt(localStorage.getItem("user_type")),
      userId: parseInt(localStorage.getItem("user_id")),
      surveyorId: this.selectedSupervisorFilter,
    };
    this.httpService.getSupervisorList(obj).subscribe((data) => {
      this.surveyor = data;
      this.loading = false;
    });
  }

  // goToEvaluation(id, visitType) {
  //   window.open(
  //     `${environment.hash}dashboard/evaluation/list/details/${id}/${visitType}`,
  //     "_blank"
  //   );
  // }

  modifyDate(date) {
    return moment(date).format("YYYY-MM-DD");
  }

  goToEvaluation(shop) {
    console.log("shop", shop);
    if(this.projectType=='Resource Management'){
      window.open(
        `${
          environment.hash
        }dashboard/virtual_view/list/route-tracker-pmirm?surveyorId=${
          shop.surveyorId
        }&startDate=${this.modifyDate(
          shop.visit_date
        )}&userType=${localStorage.getItem("user_id")}`,
        "_blank"
      );
    }
    else{
      window.open(
        `${
          environment.hash
        }dashboard/virtual_view/list/route-tracker?surveyorId=${
          shop.surveyorId
        }&startDate=${this.modifyDate(
          shop.visit_date
        )}&userType=${localStorage.getItem("user_id")}`,
        "_blank"
      );
    }
  }
  // goToMap(){

  // }
  zoneChange() {
    //this.loadingData = true;
    // this.regions = [];
    // this.channels = [];
    this.selectedRegion = {};
    this.selectedArea = {};
    this.selectedCity = {};
    this.selectedDistribution = {};
    // if (
    //   this.router.url === "/dashboard/productivity_report" ||
    //   this.router.url === "/dashboard/merchandiser_attendance"
    // )
    // {
    //   this.getTabsData();
    // }

    this.httpService.getRegion(this.selectedZone.id).subscribe(
      (data) => {
        const res: any = data;
        if (res) {
          this.regions = res;
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
  regionChange() {
    this.selectedArea = {};
    this.selectedCity = {};
    this.selectedDistribution = {};
    // if (this.router.url === "/dashboard/daily_visit_report") {
    //   this.getMerchandiserList(this.startDate);
    // }

    // if (
    //   this.router.url === "/dashboard/productivity_report" ||
    //   this.router.url === "/dashboard/merchandiser_attendance"
    // ) {
    //   this.getTabsData();
    // }
    // if (this.accessProperties.is_area_allowed) {
    this.loadingData = true;
    this.httpService.getAreaByRegion(this.selectedRegion.id || -1).subscribe(
      (data) => {
        // this.channels = data[0];
        const res: any = data;
        if (res) {
          this.areas = res;
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
    // }
    // if (this.router.url === "/dashboard/daily_visit_report") {
    //   this.getMerchandiserList(this.startDate);
    // }
  }
  clearLoading() {
    this.loading = false;
    // this.loadingData = false;
    // this.loadingReportMessage = false;
  }

  resetFilters() {
    this.selectedSupervisorFilter = -1;
    this.selectedSurveyorFilter = -1;
    this.selectedZone = -1;
    this.selectedCity = -1;
    this.selectedArea = -1;
    this.selectedRegion = -1;
    this.startDate = new Date();
    this.prodata = -1;
  }
  getShopsTracking() {
    // this.matLgened=true;
    this.loading = true;
    const obj = {
      supervisorId: this.selectedSupervisorFilter,
      surveyorId: this.selectedSurveyorFilter,
      startDate: moment(this.startDate).format("YYYY-MM-DD"),
      userId: localStorage.getItem("user_id"),
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
    };
    this.httpService.getShopsForSurveyorLiveTracking(obj).subscribe((res: any) => {
      if (res.length <= 0) {
        this.toastr.error("Shop Not Found");
        this.loading = false;
      } else {
        this.trackedShops = [];
        this.trackedShops = res;
        this.trackedShops2 = res;
        console.log("tracked shop: ", this.trackedShops);
        this.loading = false;
        this.latitude = parseFloat(this.trackedShops[0].latitude);
        this.longitude = parseFloat(this.trackedShops[0].longitude);
        const alldata = this.trackedShops.map((id) => {
          return id.surveyorId;
        });

        this.legends = new Set(alldata);
      }
    });

    this.getProductivityData();
    this.matLgened = true;
    // }
  }

  getProductivityData() {
    const obj = {
      act: 22,
      supervisorId: this.selectedSupervisorFilter,
      surveyorId: this.selectedSurveyorFilter,
      startDate: moment(this.startDate).format("YYYY-MM-DD"),
      userId: localStorage.getItem("user_id"),
    };
    this.httpService.getProdata(obj).subscribe((data) => {
      this.prodata = data;
    });
  }

  selectedUpdateChange() {
    console.log(this.selectedUpdate);
    if (this.selectedUpdate.id == 1) {
      this.trackedShops2 = this.trackedShops.filter(
        (t) => t.last_update_before <= 30
      );
    } else if (this.selectedUpdate.id == 2) {
      this.trackedShops2 = this.trackedShops.filter(
        (t) => t.last_update_before > 30 && t.last_update_before <= 120
      );
    } else if (this.selectedUpdate.id == 3) {
      this.trackedShops2 = this.trackedShops.filter(
        (t) => t.last_update_before > 120
      );
    } else {
      this.trackedShops2 = this.trackedShops;
    }
  }
}
