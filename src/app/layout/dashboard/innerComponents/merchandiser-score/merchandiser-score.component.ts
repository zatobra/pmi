import { Component, OnInit } from "@angular/core";
import { DashboardService } from "../../dashboard.service";
import * as moment from "moment";
import { environment } from "src/environments/environment";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
@Component({
  selector: "app-merchandiser-score",
  templateUrl: "./merchandiser-score.component.html",
  styleUrls: ["./merchandiser-score.component.scss"],
})
export class MerchandiserScoreComponent implements OnInit {
  title = "Shop Wise Score";
  minDate = new Date(2000, 0, 1);
  maxDate: any = new Date();
  startDate: any = new Date();
  endDate: any = new Date();
  loadingReportMessage = false;
  selectedEvaluator = -1;
  selectedZone: any = {};
  selectedRegion: any = {};
  evaluatorList: any = [];
  userTypeId: any;
  ReEvaluatorId: any;
  userId: any;
  merchandiserList: any = [];
  loading = true;
  loadingData: boolean;
  zones: any = [];
  regions: any = [];
  params: any = {};
  p = 1;
  sortOrder = true;
  sortBy: "merchandiser_code";
  clusterList: any = [];
  selectedCluster: any = {};
  labels: any;
  constructor(
    private httpService: DashboardService,
    private toastr: ToastrService,
    private router: Router,
    public activatedRoute: ActivatedRoute
  ) {
    this.maxDate.setDate(this.maxDate.getDate() - 1);
    this.zones = JSON.parse(localStorage.getItem("zoneList"));
    this.clusterList = JSON.parse(localStorage.getItem("clusterList"));
    this.activatedRoute.queryParams.subscribe((p) => {
      if (p.surveyorId && p.startDate && p.endDate) {
        this.params = p;
        this.startDate = p.startDate;
        this.endDate = p.endDate;
        this.getMerchandiserWiseScore(p);
      } else {
        this.startDate.setDate(this.startDate.getDate() - 1);
        this.startDate = moment(this.startDate).format("YYYY-MM-DD");
        this.endDate.setDate(this.endDate.getDate() - 1);
        this.endDate = moment(this.endDate).format("YYYY-MM-DD");
        this.getMerchandiserList();
      }
    });
    this.labels = JSON.parse(localStorage.getItem("labelProperties"));
  }

  ngOnInit() {
    this.loadingData = false;
    this.userTypeId = localStorage.getItem("user_type");
    this.ReEvaluatorId = localStorage.getItem("Reevaluator");

    this.sortIt("merchandiser_code");
    this.userId = localStorage.getItem("user_id");
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

  getMerchandiserList() {
    this.startDate = moment(this.startDate).format("YYYY-MM-DD");
    this.endDate = moment(this.endDate).format("YYYY-MM-DD");
    this.loadingData = true;
    if (this.endDate >= this.startDate) {
      const obj = {
        surveyorId: -1,
        startDate: this.startDate,
        endDate: this.startDate,
        clusterId: this.selectedCluster.id
          ? this.selectedCluster.id == -1
            ? localStorage.getItem("clusterId")
            : this.selectedCluster.id
          : localStorage.getItem("clusterId"),
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

      this.httpService.getMerchandiserScore(obj).subscribe((data: any) => {
        // console.log('merchandiser list for evaluation',data);
        if (data) {
          this.merchandiserList = data;
          this.loading = false;
          this.loadingData = false;
        }
      });
    } else {
      this.loading = false;
      this.loadingData = false;
      this.toastr.info(
        "End date must be greater than start date",
        "Date Selection"
      );
    }
  }

  modifyDate(date) {
    return moment(date).format("YYYY-MM-DD");
  }

  gotoNewPage(item) {
    window.open(
      `${environment.hash}dashboard/evaluation/list/details/${item.survey_id}/${item.shop_id}`
    );
  }

  zoneChange() {
    this.loadingData = true;
    this.getMerchandiserList();

    this.httpService.getRegion(this.selectedZone.id).subscribe(
      (data) => {
        const res: any = data;
        if (res) {
          this.regions = res;
        } else {
          this.loadingData = false;
          this.loading = false;
          this.toastr.info(
            "Something went wrong,Please retry",
            "Connectivity Message"
          );
        }

        setTimeout(() => {
          this.loadingData = false;
          this.loading = false;
        }, 500);
      },
      (error) => {
        this.loadingData = false;
        this.loading = false;
      }
    );
  }

  getMerchandiserWiseScore(params) {
    this.loadingData = true;
    if (params.endDate >= params.startDate) {
      const obj = {
        surveyorId: params.surveyorId,
        startDate: params.startDate,
        endDate: params.endDate,
        clusterId: this.selectedCluster.id
          ? this.selectedCluster.id == -1
            ? localStorage.getItem("clusterId")
            : this.selectedCluster.id
          : localStorage.getItem("clusterId"),
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

      this.httpService.getMerchandiserScore(obj).subscribe((data: any) => {
        if (data) {
          this.merchandiserList = data;
          this.loading = false;
          this.loadingData = false;
        }
      });
    } else {
      this.loading = false;
      this.loadingData = false;
      this.toastr.info(
        "End date must be greater than start date",
        "Date Selection"
      );
    }
  }

  getZoneByCluster() {
    this.loadingData = true;
    this.selectedZone = {};
    this.selectedRegion = {};
    this.getMerchandiserList();
    this.httpService.getZoneByCluster(this.selectedCluster.id || -1).subscribe(
      (data) => {
        const res: any = data;
        if (res) {
          this.zones = res;
        }
        this.loadingData = false;
      },
      (error) => {
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
        this.loadingData = false;
      }
    );
  }
}
