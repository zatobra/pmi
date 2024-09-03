import { Component, OnInit, ViewChildren, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Config } from "src/assets/config";
import { environment } from "src/environments/environment";
import { ModalDirective } from "ngx-bootstrap/modal";
import { EvaluationService } from "../evaluation.service";
import { ThemeService } from "ng2-charts";

@Component({
  selector: "app-details-page",
  templateUrl: "./details-page.component.html",
  styleUrls: ["./details-page.component.scss"],
})
export class DetailsPageComponent implements OnInit {
  // ip = environment.ip;
  @ViewChildren("checked") private myCheckbox: any;
  @ViewChild("imageModal", { static: true }) imageModal: ModalDirective;
  selectedItem: any = {};
  ip: any = Config.BASE_URI;
  tableData: any = [];
  headingsList: any = [];
  reevaluatorRole: any;
  userType: any;
  loading = false;
  p = 0;
  params: any = {};
  isExternalUrl = false;
  zsmRole: any;
  isEvaluationEnabled = false;
  selectedSurveys: any = [];
  loadingData = true;
  selectedZsmStatus = -1;
  sortOrder = true;
  sortBy: "chiller_allocated";
  projectType: string;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private httpService: EvaluationService,
    private activeRoute: ActivatedRoute
  ) {
    this.reevaluatorRole = localStorage.getItem("Reevaluator");
    this.projectType = localStorage.getItem("projectType");
    this.userType = localStorage.getItem("user_type");
    this.zsmRole = localStorage.getItem("Zsm");
    if (this.userType == this.zsmRole) {
      this.isEvaluationEnabled = true;
    }
    this.activeRoute.queryParams.subscribe((p) => {
      this.params = p;
      if (p.surveyorId && p.startDate && p.endDate && p.userType) {
        this.getTableData(p);
      }
    });
  }

  ngOnInit() {
    // this.getTableData();

    const that = this;
    const flag = false;
    document.addEventListener("visibilitychange", function (e) {
      if (!document.hidden) {
        that.getTableData(that.params);
      }
    });
    this.sortIt("chiller_allocated");
  }

  getTableData(obj) {
    this.httpService.getData(obj).subscribe(
      (data) => {
        this.tableData = data;
        this.setImageUrl();
        if (this.tableData.length === 0) {
          this.loading = false;
          this.toastr.info("No record found.");
          setTimeout(() => {
            this.router.navigate(["/dashboard/merchandiser_List"]);
          }, 3000);
        }
        this.headingsList = Object.keys(data);
      },
      (error) => {}
    );
  }

  gotoNewPage(item) {
    const surveyorType = item.surveyorType || 1;
    window.open(
      `${environment.hash}dashboard/evaluation/list/details/${item.survey_id}?shopId=${item.shop_id}&surveyorId=${this.params.surveyorId}&visitDate=${item.visit_date}&surveyorType=${surveyorType}`,
      "_blank"
    );
  }

  setImageUrl() {
    for (const element of this.tableData) {
      if (element?.shop_image_url.indexOf("http") >= 0) {
        this.isExternalUrl = true;
      }
    }
  }

  checkUncheckSingle(event, item, index) {
    if (event.checked === true) {
      this.selectedSurveys.push(item.survey_id);
    } else {
      const i = this.selectedSurveys.indexOf(item.survey_id);
      this.selectedSurveys.splice(i, 1);
    }
  }

  checkUncheckAll(event) {
    if (event.checked === true) {
      for (let i = 0; i < this.tableData.length; i++) {
        if (
          this.selectedSurveys.indexOf(this.tableData[i].survey_id) == -1 &&
          this.tableData[i].evaluation_status == "Pending"
        ) {
          this.selectedSurveys.push(this.tableData[i].survey_id);
        }
      }
      for (let index = 0; index < this.myCheckbox._results.length; index++) {
        this.myCheckbox._results[index]._checked = true;
      }
    } else {
      for (let i = 0; i < this.tableData.length; i++) {
        const i = this.selectedSurveys.indexOf("survey_id");
        this.selectedSurveys.splice(i, 1);
        this.selectedSurveys = [];
      }
      for (let index = 0; index < this.myCheckbox._results.length; index++) {
        this.myCheckbox._results[index]._checked = false;
      }
    }
  }

  evaluateShops(status) {
    this.selectedZsmStatus = status;
    this.loading = true;
    const obj = {
      surveyIds: this.selectedSurveys,
      userId: localStorage.getItem("u_surveyor_id"),
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
          this.getTableData(this.params);
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

  showImageModal(item) {
    this.selectedItem = item;
    this.imageModal.show();
  }
  hideImageModal() {
    this.imageModal.hide();
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
}
