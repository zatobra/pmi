import { Component, OnInit, Input, Output } from "@angular/core";
import { DashboardService } from "../../dashboard.service";
import * as moment from "moment";
import { environment } from "src/environments/environment";
import { ToastrService } from "ngx-toastr";
import { NgxPaginationModule } from "ngx-pagination";
@Component({
  selector: "app-merchandiser-list",
  templateUrl: "./merchandiser-list.component.html",
  styleUrls: ["./merchandiser-list.component.scss"],
})
export class MerchandiserListComponent implements OnInit {
  title = "";
  value: String;
  // searchvalue: boolean= false;
  minDate = new Date(2000, 0, 1);
  maxDate: any = new Date();
  startDate: any = new Date();
  endDate = new Date();
  loadingReportMessage = false;
  selectedEvaluator: any = {};
  evaluatorList: any = [];
  userTypeId: any;
  ReEvaluatorId: any;
  userId: any;
  merchandiserList: any = [];
  filteredList: any = [];
  loading = true;
  loadingData: boolean;
  cardLoading: boolean;
  evaluationSummary: any = {};
  p = 1;
  sortOrder = true;
  sortBy: "m_code";
  labels: any;
  zsmRole: any;
  projectType: any;
  constructor(
    private httpService: DashboardService,
    private toastr: ToastrService
  ) {
    this.projectType = localStorage.getItem("projectType");
    this.maxDate.setDate(this.maxDate.getDate());
    this.startDate.setDate(this.startDate.getDate() - 1);
    this.endDate.setDate(this.endDate.getDate() - 1);
    this.labels = JSON.parse(localStorage.getItem("labelProperties"));
    this.title = this.labels.surveyorLabel + " List";
    this.userTypeId = localStorage.getItem("user_type");
    this.ReEvaluatorId = localStorage.getItem("Reevaluator");
    this.zsmRole = localStorage.getItem("Zsm");
  }

  ngOnInit() {
    this.loadingData = false;
    this.getMerchandiserList();
    this.sortIt("m_code");
    this.loadEvaluators();
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
    this.loadingData = true;
    const obj = {
      evaluatorId:
        this.userTypeId == this.zsmRole
          ? localStorage.getItem("u_surveyor_id")
          : localStorage.getItem("user_id"),
      selectedEvaluator: this.selectedEvaluator.id || -1,
      userTypeId: this.userTypeId,
      startDate: moment(this.startDate).format("YYYY-MM-DD"),
      endDate: moment(this.endDate).format("YYYY-MM-DD"),
    };

    this.httpService
      .getMerchandiserListForEvaluation(obj)
      .subscribe((data: any) => {
        // console.log('merchandiser list for evaluation',data);
        if (data.length > 0) {
          this.merchandiserList = data;
          this.filteredList = data;
          this.setEvaluationSummary();
        }
        this.loading = false;
        this.loadingData = false;
      });
  }

  modifyDate(date) {
    return moment(date).format("YYYY-MM-DD");
  }

  gotoNewPage(item) {
    window.open(
      `${environment.hash}dashboard/evaluation/list/home?surveyorId=${
        item.id
      }&startDate=${this.modifyDate(this.startDate)}&endDate=${this.modifyDate(
        this.endDate
      )} &userType=${this.userTypeId}`,
      "_blank"
    );
  }

  loadEvaluators() {
    this.httpService.getEvaluatorList().subscribe(
      (data) => {
        if (data) {
          this.evaluatorList = data;
        }
      },
      (error) => {
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
      }
    );
  }

  // loadEvaluationSummary() {
  //   this.cardLoading = true;
  //   const obj = {
  //     evaluatorId:
  //       this.userTypeId == this.ReEvaluatorId
  //         ? this.selectedEvaluator.id || -1
  //         : localStorage.getItem("user_id"),
  //     startDate: moment(this.startDate).format("YYYY-MM-DD"),
  //     endDate: moment(this.endDate).format("YYYY-MM-DD"),
  //   };

  //   this.httpService.getEvaluationSummary(obj).subscribe((data: any) => {
  //     // console.log('merchandiser list for evaluation',data);
  //     if (data) {
  //       this.evaluationSummary = data;
  //       this.cardLoading = false;
  //     }
  //   });
  // }

  onNotifyClicked(filteredlist: any) {
    this.filteredList = filteredlist;
  }

  setEvaluationSummary() {
    this.evaluationSummary.totalMerchandisers = this.filteredList.length;
    this.evaluationSummary.totalCaptured = this.filteredList
      .map((a) => a.captured_shops)
      .reduce(function (a, b) {
        return a + b;
      });
    this.evaluationSummary.totalEvaluated = this.filteredList
      .map((a) => a.evaluated_shops)
      .reduce(function (a, b) {
        return a + b;
      });

    this.evaluationSummary.totalApproved = this.filteredList
      .map((a) => a.approved_shops)
      .reduce(function (a, b) {
        return a + b;
      });
    this.evaluationSummary.totalDisApproved = this.filteredList
      .map((a) => a.disapproved_shops)
      .reduce(function (a, b) {
        return a + b;
      });
    this.evaluationSummary.totalPending =
      this.evaluationSummary.totalCaptured -
      this.evaluationSummary.totalEvaluated;

    this.evaluationSummary.evaluated = this.filteredList
      .map((a) => a.evaluated)
      .reduce(function (a, b) {
        return a + b;
      });

    this.evaluationSummary.physicalVerified = this.filteredList
      .map((a) => a.physical_verified)
      .reduce(function (a, b) {
        return a + b;
      });

      this.evaluationSummary.portalVerified = this.filteredList
      .map((a) => a.portal_verified)
      .reduce(function (a, b) {
        return a + b;
      });
  }
}
