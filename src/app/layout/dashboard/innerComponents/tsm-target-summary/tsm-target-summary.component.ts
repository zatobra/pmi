import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { DashboardService } from "../../dashboard.service";
import { Logger } from "html2canvas/dist/types/core/logger";

@Component({
  selector: "app-tsm-target-summary",
  templateUrl: "./tsm-target-summary.component.html",
  styleUrls: ["./tsm-target-summary.component.scss"],
})
export class TsmTargetSummaryComponent implements OnInit {
  tsmId = -1;
  tableData: any = [];
  tableDataNew: any = [];
  loading: boolean;
  loadingNew : boolean;
  constructor(
    private activeRoute: ActivatedRoute,
    private toastr: ToastrService,
    private httpService: DashboardService
  ) {
    this.activeRoute.queryParams.subscribe((p) => {
      if (p.tsmId) {
        this.tsmId = p.tsmId;
        this.getTableData();
        this.getTsmProductivitySummary();
      }
    });
  }

  ngOnInit(): void {}

  getTableData() {
    this.loading = true;
    const obj = {
      tsmId: this.tsmId,
    };
    this.httpService.getTsmTargetSummary(obj).subscribe(
      (data) => {
        // console.log(data);
        this.tableData = data;
        this.loading = false;
        if (this.tableData.length === 0) {
          this.loading = false;
          this.toastr.info("No record found for Target Summary.");
        }
      },
      (error) => {
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
        this.loading = false;
        this.loading = false;
      }
    );
  }

  getTsmProductivitySummary() {
  console.log("getTsmProductivitySummary");
    this.loadingNew = true;
    const obj = {
      tsmId: this.tsmId,
    };
    this.httpService.getTsmProductivitySummaryData(obj).subscribe(
      (data) => {
        console.log(data);
        this.tableDataNew = data;
        this.loadingNew = false;
        if (this.tableDataNew.length === 0) {
          this.loadingNew = false;
          this.toastr.info("No record found For Productivity Summary.");
        }
      },
      (error) => {
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
        this.loadingNew = false;
        this.loadingNew = false;
      }
    );
  }
}
