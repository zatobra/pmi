import { Component, OnInit, ViewChild, ViewChildren } from "@angular/core";
import { ModalDirective } from "ngx-bootstrap/modal";
import * as moment from "moment";
import { Router } from "@angular/router";
import { DashboardService } from "../../dashboard.service";
import { ToastrService } from "ngx-toastr";
import { ExcelService } from "../../excel.service";
import { ngxCsv } from "ngx-csv/ngx-csv";

@Component({
  selector: "app-merchandiser-planned-calls",
  templateUrl: "./merchandiser-planned-calls.component.html",
  styleUrls: ["./merchandiser-planned-calls.component.scss"],
})
export class MerchandiserPlannedCallsComponent implements OnInit {
  title = "Merchandiser Planned Calls";

  @ViewChild("remarksModal", { static: true }) remarksModal: ModalDirective;
  @ViewChildren("checked") private myCheckbox: any;
  loadingData: boolean;

  minDate = new Date(2000, 0, 1);
  maxDate = new Date();
  zones: any = [];

  regions: any = [];
  channels: any = [];
  userTypeId: any = -1;
  selectedZone: any = {};
  selectedRegion: any = {};
  selectedChannel: any = [];
  startDate = new Date();
  endDate = new Date();
  loading: boolean;
  cities: any = [];
  selectedCity: any = {};
  distributionList: any = [];
  selectedDistribution: any = {};
  tabsData: any = [];
  storeType: any = ["Elite", "Platinum", "Gold", "Silver", "Others"];
  selectedStoreType = null;
  tableData: any = [];
  // areas: any = [];
  // selectedArea: any = {};
  sortOrder = true;
  sortBy: "completed";
  remarksList = [];
  selectedRemark = {};
  selectedUser: any = 0;
  labels: any;
  selectedSurveyors: any = [];
  downloadList = [
    { key: "csv", title: "CSV", icon: "fa fa-file-text-o" },
    { key: "xlsx", title: "Excel", icon: "fa fa-file-excel-o" },
  ];
  selectedFileType: {};
  clusterList: any = [];
  selectedCluster: any = {};
  completeData: any[];
  constructor(
    private excelService: ExcelService,
    private router: Router,
    private httpService: DashboardService,
    private toastr: ToastrService
  ) {
    this.zones = JSON.parse(localStorage.getItem("zoneList"));
    this.clusterList = JSON.parse(localStorage.getItem("clusterList"));
    this.labels = JSON.parse(localStorage.getItem("labelProperties"));
  }

  ngOnInit() {
    this.userTypeId = localStorage.getItem("user_type");
    this.sortIt("completed");
    this.getTabsData();
    this.getRemarks();
  }
  downloadFile(file, dataTable) {
    // this.loading=true;
    console.log(file, dataTable);
    const type = file.key;
    const data: any = dataTable;
    const fileTitle = "Merchandiser Planned";

    if (type === "csv") {
      new ngxCsv(data, fileTitle);
    } else if (type === "xlsx") {
      this.excelService.exportAsExcelFile(data, fileTitle);
    }

    this.selectedFileType = {};
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }
  getPercentage(n) {
    return Math.round(n) + " %";
  }
  sortIt(key) {
    this.sortBy = key;
    this.sortOrder = !this.sortOrder;
  }

  getArrowType(key) {
    if (key === this.sortBy) {
      return this.sortOrder ? "arrow_upward" : "arrow_downward";
    } else {
      return "";
    }
  }
  getTabsData(data?: any, dateType?: string) {
    this.loadingData = true;
    let startDate =
      dateType === "start"
        ? moment(data).format("YYYY-MM-DD")
        : moment(this.startDate).format("YYYY-MM-DD");
    let endDate =
      dateType === "end"
        ? moment(data).format("YYYY-MM-DD")
        : moment(this.endDate).format("YYYY-MM-DD");
    // for merchandiser attendance only
    if (this.router.url === "/dashboard/merchandiser-planned-calls") {
      startDate = moment(this.startDate).format("YYYY-MM-DD");
      endDate = moment(this.startDate).format("YYYY-MM-DD");
    }

    this.loading = true;
    const obj: any = {
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
      startDate: startDate,
      endDate: endDate,
      cityId: this.selectedCity.id || -1,
      distributionId: this.selectedDistribution.id || -1,
      storeType: this.selectedStoreType || null,
      channelId: -1,
    };
    localStorage.setItem("obj", JSON.stringify(obj));
    this.getTableData(obj);

    this.httpService.getDashboardData(obj).subscribe(
      (data) => {
        // console.log(data, 'home data');
        this.loadingData = false;
        const res: any = data;
        if (res) {
          this.tabsData = data;
        }
        this.loading = false;
        // if (res.planned == 0)
        //   this.toastr.info('No data available for current selection', 'Summary')
      },
      (error) => {
        // this.clearLoading();

        console.log(error, "home error");
      }
    );
  }

  getTableData(obj) {
    this.httpService.merchandiserShopList(obj).subscribe(
      (data) => {
        console.log(data, "table data");
        const res: any = data;

        if (res) {
          this.tableData = res;
        }
        this.loading = false;
        // if (res.planned == 0)
        //   this.toastr.info('No data available for current selection', 'Summary')
      },
      (error) => {
        // this.clearLoading();

        console.log(error, "home error");
      }
    );
  }

  zoneChange() {
    this.loadingData = true;
    // this.regions = [];
    // this.channels = [];

    this.getTabsData();

    this.httpService.getRegion(this.selectedZone.id).subscribe(
      (data) => {
        const res: any = data;
        if (res) {
          this.regions = res;
        } else {
          // this.clearLoading();

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
        // this.clearLoading();
      }
    );
  }

  regionChange() {
    // this.selectedArea = {};
    this.selectedCity = {};
    this.selectedDistribution = {};

    this.getTabsData();
  }

  getRemarks() {
    this.httpService.getRemarksList().subscribe((data: any) => {
      if (data) {
        this.remarksList = data;
      }
    });
  }
  clearLoading() {
    this.loadingData = false;
  }
  deleteRoutes(item) {
    console.log("calls", this.selectedRemark);
    const isSelected = Object.keys(this.selectedRemark).length;
    const key = Object.keys(this.selectedRemark)[0];
    const value = this.selectedRemark[key];
    if (isSelected > 0) {
      this.loadingData = true;
      const obj = {
        userId: JSON.parse(localStorage.getItem("user_id")),
        startDate: moment(this.startDate).format("YYYY-MM-DD"),
        remarkId: value,
        surveyorId: item || this.selectedSurveyors,
      };
      this.httpService.removePlanedCall(obj).subscribe(
        (data:any) => {
          if (data?.success) {
            this.toastr.success("Planned Calls Deactivated Successfully ");
            this.selectedUser = 0;
            // this.showCount("show");
            this.getTabsData();
          }
          else{
            this.toastr.error("Something went wrong ");
          }
          this.clearLoading();
        },
        (error) => {
          error.status === 0
            ? this.toastr.error("Please check Internet Connection", "Error")
            : this.toastr.error(error.description, "Error");
          this.clearLoading();
        }
      );
    }
  }
  checkUncheckSingle(event, item, index) {
    if (event.checked === true) {
      this.selectedSurveyors.push(item.id);
      console.log("surveyos", this.selectedSurveyors);
    } else {
      const i = this.selectedSurveyors.indexOf(item.id);
      this.selectedSurveyors.splice(i, 1);
      console.log(this.selectedSurveyors);
    }
  }

  checkUncheckAll(event) {
    if (event.checked === true) {
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.selectedSurveyors.indexOf(this.tableData[i].id) == -1) {
          this.selectedSurveyors.push(this.tableData[i].id);
          console.log(this.selectedSurveyors);
        }
      }
      for (let index = 0; index < this.myCheckbox._results.length; index++) {
        this.myCheckbox._results[index]._checked = true;
      }
    } else {
      for (let i = 0; i < this.tableData.length; i++) {
        const i = this.selectedSurveyors.indexOf("id");
        this.selectedSurveyors.splice(i, 1);
        console.log(this.selectedSurveyors);
        this.selectedSurveyors = [];
        console.log(this.selectedSurveyors);
      }
      for (let index = 0; index < this.myCheckbox._results.length; index++) {
        this.myCheckbox._results[index]._checked = false;
      }
    }
  }

  removePlanedCall(item) {
    console.log("calls", this.selectedRemark);
    const isSelected = Object.keys(this.selectedRemark).length;
    const key = Object.keys(this.selectedRemark)[0];
    const value = this.selectedRemark[key];
    if (isSelected > 0) {
      const obj: any = {
        userId: JSON.parse(localStorage.getItem("user_id")),
        startDate: moment(this.startDate).format("YYYY-MM-DD"),
        surveyorId: item,
        remarkId: value,
      };

      this.httpService.removePlanedCall(obj).subscribe(
        (data: any) => {
          console.log("remove palnned call", data);
          if (data.success) {
            // this.tableData=_.remove(this.tableData,(e)=>{e.merchandiser_id==data.surveyorId})

            // const tempArray: any = this.tableData;
            // this.tableData.forEach(element => {
            //   if (element.id === data.surveyorId) {
            //     const index = this.tableData.indexOf(element);
            //     tempArray.splice(index, 1);
            //   }
            // });

            // this.tableData = tempArray;
            this.tableData = [];
            this.getTabsData();
          }
        },
        (error) => {}
      );
    }
  }

  showRemarksModal(id?) {
    this.selectedUser = id;
    this.remarksModal.show();
  }
  hideRemarksModal() {
    this.deleteRoutes(this.selectedUser);
    this.remarksModal.hide();
    //  if (this.selectedUser !== 0  ) {
    //   this.removePlanedCall(this.selectedUser);
  }

  getZoneByCluster() {
    this.loadingData = true;
    this.selectedZone = {};
    this.selectedRegion = {};
    this.getTabsData();

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
