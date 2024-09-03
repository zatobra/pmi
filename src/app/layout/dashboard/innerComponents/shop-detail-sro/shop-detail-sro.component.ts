import { Component, OnInit, ViewChild } from "@angular/core";
import { DashboardService } from "../../dashboard.service";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { ModalDirective } from "ngx-bootstrap/modal";
import { Config } from "src/assets/config";

@Component({
  selector: "app-shop-detail-sro",
  templateUrl: "./shop-detail-sro.component.html",
  styleUrls: ["./shop-detail-sro.component.scss"],
})
export class SROShopDetailComponent implements OnInit {
  title = "shop list";
  tableData: any = [];
  loading = false;
  // ip= environment.ip

  isExternalUrl = false;
  ip: any = Config.BASE_URI;
  remarksId: any = 0;

  @ViewChild("childModal", { static: true }) childModal: ModalDirective;
  selectedItem: any = {};
  tableTitle = "";
  shopObject: any;
  surveyorId: any;

  constructor(
    private router: Router,
    private httpService: DashboardService,
    public activatedRoute: ActivatedRoute
  ) {
    this.shopObject = JSON.parse(localStorage.getItem("obj"));
  }
  showChildModal(): void {
    this.childModal.show();
  }
  goToEvaluation(shop) {
    window.open(
      `${environment.hash}dashboard/evaluation/list/details/${shop.surveyId}?shopId=${shop.shopId}&surveyorId=${this.surveyorId}&visitDate=${shop.visitDatetime}&surveyorType=${this.shopObject.type}`,
      "_blank"
    );
  }
  hideChildModal(): void {
    this.childModal.hide();
  }

  setSelectedItem(item) {
    this.selectedItem = item;
  }
  ngOnInit() {
    let id = 0;
    this.activatedRoute.queryParams.subscribe((p) => {
      this.remarksId = p.remark_id;

      this.surveyorId = p.id;
      const obj = {
        zoneId: this.shopObject.zoneId,
        regionId: this.shopObject.regionId,
        startDate: this.shopObject.startDate,
        endDate: this.shopObject.endDate,
        merchandiserId: this.surveyorId,
        remarksId: this.remarksId,
        type: this.shopObject.type,
        // cityId: o.cityId || -1,
        // distributionId:o.selectedDitribution.id ||-1,
        // storeType:o.selectedStoreType || null,
      };

      this.getTableData(obj);
    });
    if (this.remarksId === 1) {
      this.tableTitle = "Successful";
    } else if (this.remarksId === -1) {
      this.tableTitle = "Completed";
    } else if (this.remarksId === 0) {
      this.tableTitle = "Un-Successful";
    }
  }
  getTableData(obj) {
    this.loading = true;
    this.httpService.getTableSroList(obj).subscribe(
      (data) => {
        console.log(data, "table data");
        const res: any = data;
        // this.dataSource = res;
        if (res != null) {
          this.tableData = res;
          this.setImageUrl();
        }
        this.loading = false;
        // if (res.planned == 0)
        //   this.toastr.info('No data available for current selection', 'Summary')
      },
      (error) => {
        console.log(error, "home error");
      }
    );
  }

  getPdf(item) {
    // debugger
    const obj = {
      surveyId: item.surveyId,
      type: 25,
      shopName: item.shopName,
    };
    const url = "url-pdf";
    this.httpService.DownloadResource(obj, url);
  }

  setImageUrl() {
    for (const element of this.tableData) {
      if (element.shopFullImg.indexOf("http") >= 0) {
        this.isExternalUrl = true;
      }
    }
  }
}
