import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, NgModel } from "@angular/forms";
import { Router } from "@angular/router";
import { ChartOptions, ChartType } from "chart.js";
import * as moment from "moment";
import { Color, Label, MultiDataSet } from "ng2-charts";
import { ToastrService } from "ngx-toastr";
import { Config } from "src/assets/config";
import { environment } from "src/environments/environment";

import { DashboardDataService } from "../../dashboard-data.service";
import { DashboardService } from "../../dashboard.service";

@Component({
  selector: "filter-bar",
  templateUrl: "./filter-bar.component.html",
  styleUrls: ["./filter-bar.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class FilterBarComponent implements OnInit, AfterViewInit {

  supervisorType= [
    {id: -1 , title :"All"},
    {id: 2 , title :"Permanent"},
    {id: 3 , title :"Seasonal"},
  ];
  
  criteriaTypeList = [
    { id: 1, name: "Visits Base" },
    { id: 2, name: "Unique" },
  ];

  public doghnutChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      display: false,
      //   display: true,
      //   labels:{
      //     fontSize: 5,
      //     fontColor: 'red',
      // }
    },

    // title: {
    //   display: true,
    //   text: 'heellllo',
    //   fontSize: 20
    // },

    plugins: {
      labels: {
        align: "bottom",
        backgroundColor: "#ccc",
        borderRadius: 3,
        font: {
          size: 18,
        },
      },
    },
  };

  doughnutChartLabels: Label[] = [
    "Successful         %",
    "                              ",
  ];
  doughnutChartLabels2: Label[] = [
    "Productivity        %",
    "                            ",
  ];
  doughnutChartLabels3: Label[] = [
    "Unvisited          %",
    "                               ",
  ];
  // doughnutChartLabels: Label[] = [];
  // doughnutChartLabels2: Label[] = [];
  // doughnutChartLabels3: Label[] = [];
  doughnutChartData: MultiDataSet = [[50, 50]];
  // doughnutChartDatas: SingleDataSet = [50];
  doughnutChartData2: MultiDataSet = [[50, 50]];
  doughnutChartData3: MultiDataSet = [[50, 50]];
  doughnutChartType: ChartType = "doughnut";
  colors: Color[] = [
    {
      backgroundColor: ["#1B28B4", "#ACA7E1"],
    },
  ];
  colors2: Color[] = [
    {
      backgroundColor: ["#B4301B", "#E1A7BA"],
    },
  ];
  colors3: Color[] = [
    {
      backgroundColor: ["#819A04", "#B6BC96"],
    },
  ];
  colors4: Color[] = [
    {
      backgroundColor: ["#047c9a", "#B6BC96"],
    },
  ];

  route: any;
  route_Id: any;
  successful: any;
  obj: any;
  //#endregion
  categoryList: any = [];
  userZoneId: any;
  userRegionId: any;
  shopCode: any;

  constructor(
    private toastr: ToastrService,
    private httpService: DashboardService,
    public router: Router,
    private dataService: DashboardDataService,
    public formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    // //this.getRoutes();
    // console.log("routesList: ", this.routesList);
    //
    // console.log("this.activeRoutesList[0].id: ", this.activeRoutesList[0].id);

    this.zones = JSON.parse(localStorage.getItem("zoneList"));
    this.clusterList = JSON.parse(localStorage.getItem("clusterList"));
    
    this.categoryList = JSON.parse(localStorage.getItem("assetList")) || [];
    const obj = {
      id: -1, title: 'All'
    };
    this.categoryList.push(obj);
    if(this.categoryList.length>1){
      this.categoryList= this.categoryList.sort((a, b) => (a.id < b.id ? -1 : 1));
    }
    
    console.log("this.categoryList: ", this.categoryList);
    this.channels = JSON.parse(localStorage.getItem("channelList"));
    this.projectType = localStorage.getItem("projectType");
    this.clusterId = localStorage.getItem("clusterId") || -1;
    this.userZoneId = localStorage.getItem("zoneId") || -1;
    this.userRegionId = localStorage.getItem("regionId") || -1;
    this.labels = JSON.parse(localStorage.getItem("labelProperties"));
    console.log('labels', this.labels);
    this.accessProperties = JSON.parse(
      localStorage.getItem("accessProperties")
    );
    this.sortIt("completed");
    this.surveyorType = this.labels.surveyorLabel;
  }
  labels: any;
  tableData: any = [];
  // ip = environment.ip;

  ip: any = Config.BASE_URI;
  projectType: any;

  distributionList: any = [];
  selectedDistribution: any = {};
  storeType: any = ["Elite", "Platinum", "Gold", "Silver", "Others"];
  selectedStoreType = null;
  //#region veriables
  minDate = new Date(2000, 0, 1);
  maxDate = new Date();
  @Input() title;
  zones: any = [];
  loadingData: boolean = false;
  regions: any = [];
  routesList: any = [];
  activeRoutesList: any = [];
  channels: any = [];
  options: any = ["Yes", "No"];

  selectedZone: any = {};
  selectedRegion: any = {};
  selectedChannel: any = [];
  startDate = new Date();
  endDate = new Date();
  areas: any = [];
  regionId = -1;

  selectedArea: any = {};
  lastVisit: any = [];
  selectedLastVisit = 1;
  mustHave: any = [];
  mustHaveAll: any = [];
  
  selectedMustHaveAll = "";
  merchandiserList: any = [];
  selectedMerchandiser: any = {};
  selectedactionsType: any = {};
  selectedCriteriaType: any = {};
  clickedOnce = 1;
  
  selectedCategory: any = {};
  cities: any = [];
  selectedCity: any = {};
  productsList: any = [];
  selectedProduct: any = [];
  selectedImpactType: any = {};
  impactTypeList: any = [];
  response: any = "";
  shopWiseCount: any = [];
  

  queryList: any = [];
  selectedQuery: any = {};

  loadingReportMessage = false;
  tabsData: any = [];
  loading = true;
  sortOrder = true;
  sortBy: "completed";
  selectedRemark = 0;
  remarksList = [];
  isZoneFilterEnabled = false;
  isRegionFilterEnabled = false;
  clusterList: any = [];
  selectedCluster: any = {};
  isSupervisorDataRequest = false;
  surveyorType = "";
  filteredList: any = [];
  actionTypeLists = [
    { id: 0, name: "National" },
    { id: 1, name: "Zonal" },
    { id: 2, name: "Regional" },
  ];
  zoneAcc = -1;
  regionAcc = -1;
  // selectedActionTypee: any = { id: 0, name: "National" };
  selectedActionTypee: any;

  clusterId: any;
  errorDetail: any;

  accessProperties: any;
  selectedRouteId: any;

  dashboardStatsObj: any = {};

  reportTypeLists = [
    { id: "true", name: "Npl" },
    { id: "false", name: "Nestle" },
  ];
  selectedReportType: any = { id: "false", name: "Nestle" };

  // mustHaveList = ["Y", "N", "both"];
  mustHaveList = ["Must have", "Good to have", "both"];
  selectedMustHave: any = "both";
  yogurtAllocationList = ["Y", "N"];
  selectedYogurtAllocation = "N";



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

  ngAfterViewInit() {
   console.log('all done loading :)') ;
    this.cdr.detectChanges();
  }

  clearAllSections() {
    this.selectedZone = {};
    this.selectedRegion = {};
    this.selectedArea = {};
    this.selectedCategory = {};
    this.selectedChannel = [];
    this.selectedProduct = [];
    this.selectedCity = {};
    this.selectedDistribution = {};
    this.distributionList = [];
    this.startDate = new Date();
    this.endDate = new Date();
    this.activeRoutesList = [];
  }
  async ngOnInit() {
    this.zoneChange();
    this.httpService.checkDate();

    this.categoryChange(this.selectedCategory?.id);

    // this.getFold();
    if (this.projectType == "Coke_Audit" || this.projectType.toLowerCase() == "pmi_audit") {
      await this.getRoutes();
      this.route = this.activeRoutesList[0];
    }

    console.log("router", this.router.url);
    this.lastVisit = this.dataService.getLastVisit();
    this.mustHave = this.dataService.getYesNo();
    this.mustHaveAll = this.dataService.getYesNoAll();
    this.impactTypeList = this.dataService.getImpactType();
    if (
      this.router.url === "/dashboard/productivity_report" ||
      this.router.url === "/dashboard/supervisor_productivity"
    ) {
      if (this.router.url === "/dashboard/supervisor_productivity") {
        this.isSupervisorDataRequest = true;
        this.surveyorType = this.labels.supervisorLabel;
        this.getSupTabsData();
      }
    }

    if (this.router.url === "/dashboard/raw_data") {
      this.getQueryTypeList();
    }

    if (this.router.url === "/dashboard/pivot_based_data") {
      this.getReportTypes();
    }
    if (this.projectType == "NFL" || this.projectType == "TMR" || this.projectType == "NFL_CULINARY" || this.projectType == "NFL_CONDIMENTS" || this.projectType == "Samsung") {
      this.getSelectiveClusters();
    } else {
      this.getZone();
    }
  }

  routeChange() {
    // this.route=[];
    console.log("route oid in routecng: ", this.route);
    this.selectedRouteId = this.route.id;
    // this.getTabsData();
  }

  getReportTypes() {
    this.httpService.getReportList().subscribe(
      (data) => {
        console.log("Reports", data);
        if (data) {
          this.queryList = data;
        }
      },
      (error) => {
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
      }
    );
  }

  getQueryTypeList() {
    this.httpService.getQueryTypeList(-1).subscribe(
      (data) => {
        console.log("qurry list", data);
        if (data) {
          this.queryList = data;
        }
      },
      (error) => {
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
      }
    );
  }

  getTrendingOOSReport() {
    if (this.endDate >= this.startDate) {
      this.loadingData = true;
      this.loadingReportMessage = true;
      const obj = {
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
        startDate: moment(this.startDate).format("YYYY-MM-DD"),
        endDate: moment(this.endDate).format("YYYY-MM-DD"),
      };

      const url = "trending-oos-report";
      const body = this.httpService.UrlEncodeMaker(obj);
      this.httpService.getKeyForProductivityReport(body, url).subscribe(
        (data) => {
          console.log(data, "query list");
          const res: any = data;

          if (res) {
            const obj2 = {
              key: res.key,
              fileType: res.fileType,
            };
            const url = "downloadReport";
            this.getproductivityDownload(obj2, url);
          } else {
            this.clearLoading();

            this.toastr.info(
              "Something went wrong,Please retry",
              "Report Message"
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
        "Something went wrong,Please retry",
        "dashboard Data Availability Message"
      );
    }
  }

  getAbnormalityReport() {
    if (this.endDate >= this.startDate) {
      this.loadingData = true;
      this.loadingReportMessage = true;
      const obj = {
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
        startDate: moment(this.startDate).format("YYYY-MM-DD"),
        endDate: moment(this.endDate).format("YYYY-MM-DD"),
        channelId: this.arrayMaker(this.selectedChannel),
        cityId: this.selectedCity.id || -1,
        areaId: this.selectedArea.id || -1,
      };

      const url = "abnormalityShopList";
      const body = this.httpService.UrlEncodeMaker(obj);
      this.httpService.getKeyForProductivityReport(body, url).subscribe(
        (data) => {
          console.log(data, "query list");
          const res: any = data;

          if (res) {
            const obj2 = {
              key: res.key,
              fileType: res.fileType,
            };
            const url = "downloadReport";
            this.getproductivityDownload(obj2, url);
          } else {
            this.clearLoading();

            this.toastr.info(
              "Something went wrong,Please retry",
              "AbnormalityReport Message"
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
        "Something went wrong,Please retry",
        "dashboard Data Availability Message"
      );
    }
  }

  getDashboardData() {
    if (this.endDate >= this.startDate) {
      this.loadingData = true;
      this.loadingReportMessage = true;
      // tslint:disable-next-line:triple-equals
      const obj = {
        queryId: this.selectedQuery.id,
        startDate: moment(this.startDate).format("YYYY-MM-DD"),
        endDate: moment(this.endDate).format("YYYY-MM-DD"),
        zoneId: this.selectedZone.id,
        regionId: this.selectedRegion.id,
      };

      const url = "dashboard-data";
      const body = this.httpService.UrlEncodeMaker(obj);
      this.httpService.getKeyForProductivityReport(body, url).subscribe(
        (data) => {
          console.log(data, "query list");
          const res: any = data;

          if (res) {
            const obj2 = {
              key: res.key,
              fileType: res.fileType,
            };
            const url =
              this.selectedQuery.type == 1
                ? "downloadcsvReport"
                : "downloadReport";

            this.getproductivityDownload(obj2, url);
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

  //#region filters logic

  getZone() {
    
    this.httpService.getZone().subscribe(
      (data) => {
        const res: any = data;
        if (res.zoneList) {
          localStorage.setItem("zoneList", JSON.stringify(res.zoneList));
          // localStorage.setItem("assetList", JSON.stringify(res.assetList));
          localStorage.setItem("channelList", JSON.stringify(res.channelList));
          this.zones = res.zoneList;
          console.log("zonelist", this.zones);
          // this.categoryList = res.assetList;
          this.channels = res.channelList;
        }
      },
      (error) => {
        this.clearLoading();

        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
      }
    );
  }

  getZoneByCluster() {
    this.loadingData = true;
    this.selectedZone = {};
    this.selectedRegion = {};
    this.selectedArea = {};
    this.selectedCity = {};
    this.selectedDistribution = {};
    // if (this.router.url === "/dashboard/productivity_report"
    // ) {
    //   this.getTabsData();
    // }
    this.httpService.getZoneByCluster(this.selectedCluster.id || -1).subscribe(
      (data) => {
        const res: any = data;
        if (res) {
          this.zones = res;
        }
        console.log("zone", this.zones);
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

  getSelectiveClusters() {
    
    this.httpService.getAllClusters().subscribe(
      (data) => {
        const res: any = data;
        if (res.clusterList) {
          localStorage.setItem("clusterList", JSON.stringify(res.clusterList));
          localStorage.setItem("channelList", JSON.stringify(res.channelList));
          this.clusterList = res.clusterList;
          console.log("clusterlist", this.clusterList);
          // this.categoryList = res.assetList;
          this.channels = res.channelList;
        }
      },
      (error) => {
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
      }
    );
  }

  zoneChange() {
    this.loadingData = true;
    // this.regions = [];
    // this.channels = [];
    this.selectedRegion = {};
    this.selectedArea = {};
    this.selectedCity = {};
    this.selectedDistribution = {};
    // if (
    //   this.router.url === "/dashboard/productivity_report" ||
    //   this.router.url === "/dashboard/merchandiser_attendance" ||
    //   this.router.url === "/dashboard/productivity_dashboard"
    // ) {
    //   this.getTabsData();
    // }

    this.httpService.getRegion(this.selectedZone.id||-1).subscribe(
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

  getAllRegions() {
    this.loadingData = true;
    this.httpService.getRegions().subscribe(
      (data) => {
        const res: any = data;
        if (res.regionList) {
          this.regions = res.regionList;
          console.log("regionlist", this.regions);
          // localStorage.setItem('regionList', JSON.stringify(res.regionList));
        }
        if (!res.regionList) {
          this.toastr.info("No data Found", "Info");
        }
        this.clearLoading();
      },
      (error) => {
        this.clearLoading();
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
      }
    );
  }

  async getRoutes() {
    this.loadingData = true;

    const data: any = await this.httpService.getRoutes().toPromise();
    // (data) => {
    if (data) {
      console.log("data: ", data);
      const res: any = data;

      if (res) {
        this.routesList = res;
        this.route = this.routesList[0];
        this.activeRoutesList = this.routesList.filter(
          (item, i) => item.active == "Y"
        );
        this.route = this.activeRoutesList[0];
        // localStorage.setItem('regionList', JSON.stringify(res.regionList));
      }
      if (!res) {
        this.toastr.info("No data Found", "Info");
      }
      this.clearLoading();
    }

    // },
    // (error) => {
    //   this.clearLoading();
    //   error.status === 0
    //     ? this.toastr.error("Please check Internet Connection", "Error routes")
    //     : this.toastr.error(error.description, "Error routes");
    // }
  }

  regionChange(event) {
    console.log("region", event);
    this.selectedArea = {};
    this.selectedCity = {};
    this.selectedDistribution = {};
    if (this.router.url === "/dashboard/daily_visit_report") {
      this.getMerchandiserList(this.startDate);
    }

    // if (
    //   this.router.url === "/dashboard/productivity_report" ||
    //   this.router.url === "/dashboard/merchandiser_attendance" ||
    //   this.router.url === "/dashboard/productivity_dashboard"
    // ) {
    //   this.getTabsData();
    // }
    if (this.accessProperties.is_area_allowed) {
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
    }
    if (this.router.url === "/dashboard/daily_visit_report") {
      this.getMerchandiserList(this.startDate);
    }
  }

  categoryChange(id?: any) {
    this.loadingData = true;
    this.httpService.getProducts(this.selectedCategory.id|| -1).subscribe(
      data => {
        this.productsList = data;
        setTimeout(() => {
          this.loadingData = false;
        }, 500);
      },
      error => {
    this.clearLoading()
     }
    );
  }

  cityChange() {
    // this.httpService.getAreas(this.selectedChannel).subscribe(
    //   data => {
    //     this.areas = data;
    //     // this.filterAllData();
    //   },
    //   error => {
    // this.clearLoading()
    // }
    // );
  }

  chanelChange() {
    // console.log('seelcted chanel', this.selectedChannel);
    // this.httpService.getAreas(this.selectedChannel).subscribe(
    //   data => {
    //     this.areas = data;
    //     // this.filterAllData();
    //   },
    //   error => {
    // this.clearLoading()
    // }
    // );
  }
  //#endregion
  tposmDeploymentReport() {
    if (this.endDate >= this.startDate) {
      this.loadingData = true;
      this.loadingReportMessage = true;
      const obj = {
        startDate: moment(this.startDate).format("YYYY-MM-DD"),
        endDate: moment(this.endDate).format("YYYY-MM-DD"),
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
        // channelId: this.arrayMaker(this.selectedChannel),
      };

      const url = "tposmDeploymentTracker";
      const body = this.httpService.UrlEncodeMaker(obj);
      this.httpService.getKeyForProductivityReport(body, url).subscribe(
        (data) => {
          console.log(data, "oos shoplist");
          const res: any = data;

          if (res) {
            const obj2 = {
              key: res.key,
              fileType: "json.fileType",
            };
            const url = "downloadReport";
            this.getproductivityDownload(obj2, url);
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

  dailyEvaluationRport() {
    if (this.endDate >= this.startDate) {
      this.loadingData = true;
      this.loadingReportMessage = true;
      const obj = {
        startDate: moment(this.startDate).format("YYYY-MM-DD"),
        endDate: moment(this.endDate).format("YYYY-MM-DD"),
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
        // channelId: this.arrayMaker(this.selectedChannel),
      };

      const url = "evaluation-report";
      const body = this.httpService.UrlEncodeMaker(obj);
      this.httpService.getKeyForProductivityReport(body, url).subscribe(
        (data) => {
          console.log(data, "evaluation data");
          const res: any = data;

          if (res) {
            const obj2 = {
              key: res.key,
              fileType: "json.fileType",
            };
            const url = "downloadReport";
            this.getproductivityDownload(obj2, url);
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

  downloadAttendanceReport() {
    if (this.endDate >= this.startDate) {
      this.loadingData = true;
      this.loadingReportMessage = true;
      const obj = {
        startDate: moment(this.startDate).format("YYYY-MM-DD"),
        endDate: moment(this.endDate).format("YYYY-MM-DD"),
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
        excelDump: "Y",
        areaId: this.selectedArea.id
          ? this.selectedArea.id == -1
            ? localStorage.getItem("areaId")
            : this.selectedArea.id
          : localStorage.getItem("areaId"),
      };

      const url = "viewMerchAttendanceReport";
      const body = this.httpService.UrlEncodeMaker(obj);
      this.httpService.getKeyForProductivityReport(body, url).subscribe(
        (data) => {
          console.log(data, "evaluation data");
          const res: any = data;

          if (res) {
            const obj2 = {
              key: res.key,
              fileType: "json.fileType",
            };
            const url = "downloadReport";
            this.getproductivityDownload(obj2, url);
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

  complienceReport() {
    if (this.endDate >= this.startDate) {
      this.loadingData = true;
      this.loadingReportMessage = true;
      const obj = {
        startDate: moment(this.startDate).format("YYYY-MM-DD"),
        endDate: moment(this.endDate).format("YYYY-MM-DD"),
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
        environment: environment.hash,
        // channelId: this.arrayMaker(this.selectedChannel),
      };

      const url = "complience-report";
      const body = this.httpService.UrlEncodeMaker(obj);
      this.httpService.getKeyForProductivityReport(body, url).subscribe(
        (data) => {
          console.log(data, "evaluation data");
          const res: any = data;

          if (res) {
            const obj2 = {
              key: res.key,
              fileType: "json.fileType",
            };
            const url = "downloadReport";
            this.getproductivityDownload(obj2, url);
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

  timeAnalysisReport() {
    if (this.endDate >= this.startDate) {
      this.loadingData = true;
      this.loadingReportMessage = true;
      const obj = {
        startDate: moment(this.startDate).format("YYYY-MM-DD"),
        endDate: moment(this.endDate).format("YYYY-MM-DD"),
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
        // channelId: this.arrayMaker(this.selectedChannel),
      };

      const url = "time-analysis";
      const body = this.httpService.UrlEncodeMaker(obj);
      this.httpService.getKeyForProductivityReport(body, url).subscribe(
        (data) => {
          console.log(data, "oos shoplist");
          const res: any = data;

          if (res) {
            const obj2 = {
              key: res.key,
              fileType: "json.fileType",
            };
            const url = "downloadReport";
            this.getproductivityDownload(obj2, url);
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

  shopListReport() {
    if (this.endDate >= this.startDate) {
      this.loadingData = true;
      this.loadingReportMessage = true;
      const obj = {
        startDate: moment(this.startDate).format("YYYY-MM-DD"),
        endDate: moment(this.endDate).format("YYYY-MM-DD"),
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
        // channelId: this.arrayMaker(this.selectedChannel),
      };

      const url = "shop-list-report";
      const body = this.httpService.UrlEncodeMaker(obj);
      this.httpService.getKeyForProductivityReport(body, url).subscribe(
        (data) => {
          console.log(data, "oos shoplist");
          const res: any = data;

          if (res) {
            const obj2 = {
              key: res.key,
              fileType: "json.fileType",
            };
            const url = "downloadReport";
            this.getproductivityDownload(obj2, url);
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

  getOOSDetailReport() {
    if (this.endDate >= this.startDate) {
      const obj = {
        startDate: moment(this.startDate).format("YYYY-MM-DD"),
        endDate: moment(this.endDate).format("YYYY-MM-DD"),
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
        channelId: this.selectedChannel.id || -1,
        areaId: "",
        distId: "",
        actionType: "1",
        pageType: "8",
      };
      const url = "oosDetail";

      this.httpService.DownloadResource(obj, url);
    } else {
      this.clearLoading();

      this.toastr.info(
        "End date must be greater than start date",
        "Date Selection"
      );
    }
  }

  getSOSandSOD() {
    this.loadingData = true;
    this.loadingReportMessage = true;
    if (this.endDate >= this.startDate) {
      const obj = {
        startDate: moment(this.startDate).format("YYYY-MM-DD"),
        endDate: moment(this.endDate).format("YYYY-MM-DD"),
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
        channelId: this.arrayMaker(this.selectedChannel) || -1,
        areaIds: "",
        distributionIds: "",
        action: this.selectedactionsType.id || -1,
        actionType: this.setActionType(),
        criteria: this.selectedCriteriaType.id || -1,
        pageType: "1",
        excelDump: "Y",
        isNpl: false,
        angularRequest: "Y",
      };
      const url = "shareofshelf";
      const body = this.httpService.UrlEncodeMaker(obj);
      //  `pageType=2&zoneId=${obj.zoneId}&regionId=${obj.regionId}&startDate=${obj.startDate}&endDate=${obj.endDate}&cityId=${obj.cityId}&areaId=${obj.areaId}&channelId=${obj.channelId}&category=${obj.category}&lastVisit=${obj.lastVisit}&productId=${obj.productId}&mustHave=${obj.mustHave}`;

      this.httpService.getKeyForProductivityReport(body, url).subscribe(
        (data) => {
          console.log(data, "sos & sod");
          const res: any = data;

          if (res) {
            const obj2 = {
              key: res.key,
              fileType: "json.fileType",
            };
            const url = "downloadReport";
            this.getproductivityDownload(obj2, url);
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

    // let url = 'downloadReport';
    // this.httpService.DownloadResource(obj, url);
  }

  setActionType() {
    let zoneId = this.selectedZone.id
      ? this.selectedZone.id == -1
        ? localStorage.getItem("zoneId")
        : this.selectedZone.id
      : localStorage.getItem("zoneId");
    let regionId = this.selectedRegion.id
      ? this.selectedRegion.id == -1
        ? localStorage.getItem("regionId")
        : this.selectedRegion.id
      : localStorage.getItem("regionId");

    if (regionId != -1) {
      return 2;
    } else if (zoneId != -1) {
      return 1;
    } else {
      return 0;
    }
  }

  getAttendanceReport() {
    if (this.endDate >= this.startDate) {
      const obj = {
        startDate: moment(this.startDate).format("YYYY-MM-DD"),
        endDate: moment(this.endDate).format("YYYY-MM-DD"),
      };
      const url = "distributionCheckIn";
      const body = this.httpService.UrlEncodeMaker(obj);
      this.httpService.getKeyForProductivityReport(body, url).subscribe(
        (data) => {
          console.log(data, "attendance");
          const res: any = data;
          if (res) {
            const obj2 = {
              key: res.key,
              fileType: "json.fileType",
            };
            const url = "downloadReport";
            this.getproductivityDownload(obj2, url);
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

  clearLoading() {
    this.loading = false;
    this.loadingData = false;
    this.loadingReportMessage = false;
  }

  getMerchandiserList(event?) {
    console.log(event);
    this.clickedOnce = 1;
    if (event) {
      this.startDate = event;
    }

    this.merchandiserList = [];
    if (!this.selectedZone.id || !this.selectedRegion.id) {
      // console.log(this.selectedZone.id,this.selectedRegion.id)
      this.toastr.info(
        "Please select zone and region to proceed",
        "PDF Download"
      );
    } else {
      const obj = {
        zoneId: this.selectedZone.id,
        regionId: this.selectedRegion.id,
        startDate: moment(this.startDate).format("YYYY-MM-DD"),
      };
      this.httpService.getMerchandiserList(obj).subscribe(
        (data) => {
          console.log("merchandiser", data);
          const res: any = data;
          if (!res) {
            this.toastr.warning("NO record found", "Merchandiser List");
            this.merchandiserList = [];
          } else if (res.length === 0) {
            this.toastr.info(
              "NO record found,Please try again",
              "Merchandiser List"
            );
          } else {
            this.merchandiserList = res;
          }
        },
        (error) => {
          this.clearLoading();
          error.status === 0
            ? this.toastr.error("Please check Internet Connection", "Error")
            : this.toastr.error(error.description, "Error");
        }
      );
    }
  }

  downloadDailyReport() {
    this.loadingData = true;
    this.loadingReportMessage = true;
    // this.clickedOnce++;

    const obj = {
      zoneId: this.selectedZone.id,
      regionId: this.selectedRegion.id,
      startDate: moment(this.startDate).format("YYYY-MM-DD"),
      reportType: "",
      surveyorId: this.selectedMerchandiser.id,
      excelDump: "Y",
      mailData: "Y",
      reportLink: "",
    };
    const url = "cbl-pdf";
    this.httpService.DownloadResource(obj, url);

    setTimeout(() => {
      this.loadingData = false;
      this.loadingReportMessage = false;
      // this.clearAllSections()
    }, 1000);
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

  getOOSShopListReport() {
    if (this.endDate >= this.startDate) {
      this.loadingReportMessage = true;
      this.loadingData = true;

      const obj = {
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
        cityId: this.selectedCity.id || "",
        areaId: this.selectedArea.id || "",
        distId: this.selectedDistribution.id,
        category: this.selectedCategory.id || -1,
        productId: this.arrayMaker(this.selectedProduct || ""),
        channelId: this.arrayMaker(this.selectedChannel),
        startDate: moment(this.startDate).format("YYYY-MM-DD"),
        endDate: moment(this.endDate).format("YYYY-MM-DD"),
        mustHave: this.selectedMustHave || "both",
        yogurtAllocation: this.selectedYogurtAllocation|| "N",
        isNpl: this.selectedReportType.id || "false",
        lastVisit: this.selectedLastVisit || 1,
        pageType: 0,
        actionType: this.selectedActionTypee.id || 0,
        //actionType: this.setActionType(),
      };

      const url = "shopwise-ost-report";
      const body = this.httpService.UrlEncodeMaker(obj);
      //  `pageType=2&zoneId=${obj.zoneId}&regionId=${obj.regionId}&startDate=${obj.startDate}&endDate=${obj.endDate}&cityId=${obj.cityId}&areaId=${obj.areaId}&channelId=${obj.channelId}&category=${obj.category}&lastVisit=${obj.lastVisit}&productId=${obj.productId}&mustHave=${obj.mustHave}`;

      this.httpService.getKeyForProductivityReport(body, url).subscribe(
        (data) => {
          console.log(data, "oos shoplist");
          const res: any = data;

          if (res) {
            const obj2 = {
              key: res.key,
              fileType: "json.fileType",
            };
            const url = "downloadReport";
            this.getproductivityDownload(obj2, url);
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

    // let url = 'downloadReport';
    // this.httpService.DownloadResource(obj, url);
  }

  getOOSSummary() {
    if (this.endDate >= this.startDate) {
      this.loadingData = true;
      this.loadingReportMessage = true;
      const obj = {
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
        cityId: this.selectedCity.id || "",
        areaId: this.selectedArea.id || "",
        distId: this.selectedDistribution.id,
        category: this.selectedCategory.id || -1,
        productId: this.arrayMaker(this.selectedProduct || ""),
        channelId: this.arrayMaker(this.selectedChannel),
        startDate: moment(this.startDate).format("YYYY-MM-DD"),
        endDate: moment(this.endDate).format("YYYY-MM-DD"),
        mustHave: this.selectedMustHave || "both",
        yogurtAllocation: this.selectedYogurtAllocation|| "N",
        isNpl: this.selectedReportType.id || "false",
        pageType: 3,
        actionType: this.selectedActionTypee.id || 0,
      };

      const encodeURL: any = this.httpService.UrlEncodeMaker(obj);

      const url = "oosSummaryReport";
      const body = encodeURL;
      // `chillerAllocated=${obj.chillerAllocated}&type=2&pageType=1&zoneId=${obj.zoneId}&regionId=${obj.regionId}&startDate=${obj.startDate}&endDate=${obj.endDate}&mustHave=${obj.mustHave}&channelId=${obj.channelId}`;
      // encodeURL      //

      this.httpService.getKeyForProductivityReport(body, url).subscribe(
        (data) => {
          const res: any = data;
          if (res) {
            const obj2 = {
              key: res.key,
              fileType: "json.fileType",
            };
            const url = "downloadReport";
            this.getproductivityDownload(obj2, url);
          } else {
            this.clearLoading();

            this.toastr.info(
              "Something went wrong,Please retry",
              "Connectivity Message"
            );
          }
          // let obj2 = {
          //   key: res.key,
          //   fileType: 'json.fileType'
          // }
          // let url = 'downloadReport'
          // this.getproductivityDownload(obj2, url)
        },
        (error) => {
          this.clearLoading();

          console.log(error, "summary report");
        }
      );
    } else {
      this.clearLoading();
      this.toastr.info(
        "End date must be greater than start date",
        "Date Selection"
      );
    }

    // let url = 'oosSummaryReport';
    // this.httpService.DownloadResource(obj, url);
  }
  getMSLReport() {
    if (this.endDate >= this.startDate) {
      this.loadingData = true;
      this.loadingReportMessage = true;
      const obj = {
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
        cityId: this.selectedCity.id || -1,
        areaId: this.selectedArea.id || -1,
        channelId: this.arrayMaker(this.selectedChannel),
        startDate: moment(this.startDate).format("YYYY-MM-DD"),
        endDate: moment(this.endDate).format("YYYY-MM-DD"),
        // category: -1,
        // productId: -1,
        // mustHave: 'N',
        // chillerAllocated: -1,
        // type:2,
        // pageType:1
      };

      const encodeURL: any = this.httpService.UrlEncodeMaker(obj);

      const url = "mslDashboard";
      const body = encodeURL;
      // `chillerAllocated=${obj.chillerAllocated}&type=2&pageType=1&zoneId=${obj.zoneId}&regionId=${obj.regionId}&startDate=${obj.startDate}&endDate=${obj.endDate}&mustHave=${obj.mustHave}&channelId=${obj.channelId}`;
      //     //

      this.httpService.getKeyForProductivityReport(body, url).subscribe(
        (data) => {
          const res: any = data;

          if (res) {
            const obj2 = {
              key: res.key,
              fileType: "json.fileType",
            };
            const url = "downloadReport";
            this.getproductivityDownload(obj2, url);
          } else {
            this.clearLoading();

            this.toastr.info(
              "Something went wrong,Please retry",
              "Connectivity Message"
            );
          }

          // let obj2 = {
          //   key: res.key,
          //   fileType: 'json.fileType'
          // }
          // let url = 'downloadReport'
          // this.getproductivityDownload(obj2, url)
        },
        (error) => {
          this.clearLoading();

          console.log(error, "summary report");
        }
      );
    } else {
      this.clearLoading();

      this.toastr.info(
        "End date must be greater than start date",
        "Date Selection"
      );
    }

    // let url = 'oosSummaryReport';
    // this.httpService.DownloadResource(obj, url);
  }

  getProuctivityDashboardReport() {
    if (this.endDate >= this.startDate) {
      this.loadingData = true;
      this.loadingReportMessage = true;
      const obj = {
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
        cityId: this.selectedCity.id || -1,
        areaId: this.selectedArea.id
          ? this.selectedArea.id == -1
            ? localStorage.getItem("areaId")
            : this.selectedArea.id
          : localStorage.getItem("areaId"),
        channelId: this.arrayMaker(this.selectedChannel),
        startDate: moment(this.startDate).format("YYYY-MM-DD"),
        endDate: moment(this.endDate).format("YYYY-MM-DD"),
        routeId: this.route ? this.route.id : -1,
        // category: -1,
        // productId: -1,
        // mustHave: 'N',
        // chillerAllocated: -1,
        // type:2,
        // pageType:1
      };

      const encodeURL: any = this.httpService.UrlEncodeMaker(obj);

      const url = "productivityDashboard";
      const body = encodeURL;
      // `chillerAllocated=${obj.chillerAllocated}&type=2&pageType=1&zoneId=${obj.zoneId}&regionId=${obj.regionId}&startDate=${obj.startDate}&endDate=${obj.endDate}&mustHave=${obj.mustHave}&channelId=${obj.channelId}`;
      //     //

      this.httpService.getKeyForProductivityReport(body, url).subscribe(
        (data) => {
          const res: any = data;

          if (res) {
            const obj2 = {
              key: res.key,
              fileType: "json.fileType",
            };
            const url = "downloadReport";
            this.getproductivityDownload(obj2, url);
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

          console.log(error, "summary report");
        }
      );
    } else {
      this.loading = false;
      this.loadingData = false;
      this.loadingReportMessage = false;
      this.toastr.info(
        "End date must be greater than start date",
        "Date Selection"
      );
    }

    // let url = 'oosSummaryReport';
    // this.httpService.DownloadResource(obj, url);
  }
  MProductivityReport() {
    if (this.endDate >= this.startDate) {
      this.loadingData = true;
      this.loadingReportMessage = true;
      const obj = {
        clusterId: this.clusterId,
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
        cityId: this.selectedCity.id || -1,
        distributionId: this.selectedDistribution.id || -1,
        storeType: this.selectedStoreType || null,
        startDate: moment(this.startDate).format("YYYY-MM-DD"),
        endDate: moment(this.endDate).format("YYYY-MM-DD"),
        // totalShops: this.selectedImpactType,
        channelId: -1,
      };
      const url = "productivityreport";
      const body = `type=2&pageType=1&zoneId=${obj.zoneId}&regionId=${obj.regionId}&startDate=${obj.startDate}&endDate=${obj.endDate}&distributionId=${obj.distributionId}&cityId=${obj.cityId}&storeType=${obj.storeType}&channelId=${obj.channelId}`;

      this.httpService.getKeyForProductivityReport(body, url).subscribe(
        (data) => {
          const res: any = data;

          if (res) {
            const obj2 = {
              key: res.key,
              fileType: "json.fileType",
            };
            const url = "downloadReport";
            this.getproductivityDownload(obj2, url);
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

          console.log(error, "productivity error");
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

  VisitBaseReport() {
    if (this.endDate >= this.startDate) {
      this.loadingData = true;
      this.loadingReportMessage = true;
      const obj = {
        clusterId: this.clusterId,
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
        cityId: this.selectedCity.id || -1,
        distributionId: this.selectedDistribution.id || -1,
        storeType: this.selectedStoreType || null,
        startDate: moment(this.startDate).format("YYYY-MM-DD"),
        endDate: moment(this.endDate).format("YYYY-MM-DD"),
        // totalShops: this.selectedImpactType,
        channelId: -1,
      };
      const url = "productivityreport";
      const body = `type=2&pageType=1&zoneId=${obj.zoneId}&regionId=${obj.regionId}&startDate=${obj.startDate}&endDate=${obj.endDate}&distributionId=${obj.distributionId}&cityId=${obj.cityId}&storeType=${obj.storeType}&channelId=${obj.channelId}`;

      this.httpService.getKeyForProductivityReport(body, url).subscribe(
        (data) => {
          const res: any = data;

          if (res) {
            const obj2 = {
              key: res.key,
              fileType: "json.fileType",
            };
            const url = "downloadReport";
            this.getproductivityDownload(obj2, url);
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

          console.log(error, "productivity error");
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

  getproductivityDownload(obj, url) {
    const u = url;
    this.httpService.DownloadResource(obj, u);
    setTimeout(() => {
      this.loadingData = false;
      this.loadingReportMessage = false;
      this.httpService.updatedDownloadStatus(false);
    }, 1000);
  }

  getPercentage(n) {
    return Math.round(n) + " %";
  }
  getTabsData(obj?: any) {
    this.shopCode=obj.shopCode
    this.loadingData = true;
    this.loading = true;
    (obj.type = !this.isSupervisorDataRequest ? 1 : 2),
      localStorage.setItem("obj", JSON.stringify(obj));
    this.getTableData(obj);
  }
  getTableData(obj) {
    this.filteredList = [];
    this.tableData = [];
    this.dashboardStatsObj = {};

    this.httpService.merchandiserShopList(obj).subscribe(
      (data) => {
        const res: any = data;

        if (res.length > 0) {
          // if (res) {
          this.tableData = res;
          this.filteredList = res;
          this.getDashboardStats();
        }
        this.clearLoading();
      },

      (error) => {
        this.clearLoading();

        console.log(error, "home error");
      }
    );
  }

  getDashboardStats() {
    this.dashboardStatsObj.planned = this.filteredList
      .map((a) => a.planned)
      .reduce(function (a, b) {
        return a + b;
      });

    this.dashboardStatsObj.oorTotal = this.filteredList
      .map((a) => a.oor)
      .reduce(function (a, b) {
        return a + b;
      });
    this.dashboardStatsObj.completed = this.filteredList
      .map((a) => a.completed)
      .reduce(function (a, b) {
        return a + b;
      });
      this.dashboardStatsObj.distribution = this.filteredList
      .map((a) => a.distribution)
      .reduce(function (a, b) {
        return a + b;
      });
    this.dashboardStatsObj.successfull = this.filteredList
      .map((a) => a.successfull)
      .reduce(function (a, b) {
        return a + b;
      });

    this.dashboardStatsObj.unsuccessful = this.filteredList
      .map((a) => a.unsuccessful)
      .reduce(function (a, b) {
        return a + b;
      });

    this.dashboardStatsObj.unvisited = this.filteredList
      .map((a) => a.unvisited)
      .reduce(function (a, b) {
        return a + b;
      });
    this.dashboardStatsObj.completedPercent = (
      (this.dashboardStatsObj.completed * 100) /
      this.dashboardStatsObj.planned
    ).toFixed(2);
    this.dashboardStatsObj.successfulPercent = (
      (this.dashboardStatsObj.successfull * 100) /
      this.dashboardStatsObj.planned
    ).toFixed(2);

    this.dashboardStatsObj.unvisitedPercent = (
      (this.dashboardStatsObj.unvisited * 100) /
      this.dashboardStatsObj.planned
    ).toFixed(2);
    this.dashboardStatsObj.unSuccessfulPercent = (
      ((this.dashboardStatsObj.completed - this.dashboardStatsObj.successfull) *
        100) /
      this.dashboardStatsObj.planned
    ).toFixed(2);

    // if (this.projectType == "Coke_Audit") {
    this.setChartData();
    // }
  }

  setChartData() {
    this.successful =
      this.dashboardStatsObj.successfulPercent == "NaN"
        ? "0.00"
        : this.dashboardStatsObj.successfulPercent;

    // this.successful = successful.toFixed(2);
    const pro = isNaN(this.dashboardStatsObj.completedPercent)
      ? 0
      : this.dashboardStatsObj.completedPercent;
    const unvis = isNaN(this.dashboardStatsObj.unvisitedPercent)
      ? 0
      : this.dashboardStatsObj.unvisitedPercent;

    // this.doughnutChartData = [
    //   [this.dashboardStatsObj.successfulPercent? this.dashboardStatsObj.successfulPercent: 5, 100-this.dashboardStatsObj.successfulPercent]
    // ];
    this.doughnutChartData = [[this.successful, 100 - this.successful]];
    // this.doughnutChartDatas = [50];
    this.doughnutChartData2 = [[pro, 100 - pro]];
    this.doughnutChartData3 = [[unvis, 100 - unvis]];

    // this.doughnutChartData = [
    //   [60, 40]
    // ];
    // this.doughnutChartData2 = [
    //   [70, 30]
    // ];
    // this.doughnutChartData2 = [
    //   [50, 50]
    // ];

    // this.doughnutChartDatas=[
    //   [30]
    // ];
  }

  selectAll(select: NgModel, values) {
    select.update.emit(values);
    console.log(select);
  }

  deselectAll(select: NgModel) {
    select.update.emit([]);
    console.log(select);
  }

  equals(objOne, objTwo) {
    if (typeof objOne !== "undefined" && typeof objTwo !== "undefined") {
      return objOne.id === objTwo.id;
    }
  }

  VOErrorReport() {
    if (this.endDate >= this.startDate) {
      this.loadingData = true;
      this.loadingReportMessage = true;
      const obj = {
        startDate: moment(this.startDate).format("YYYY-MM-DD"),
        endDate: moment(this.endDate).format("YYYY-MM-DD"),
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
        environment: environment.hash,
      };

      const url = "vo-error-report";
      const body = this.httpService.UrlEncodeMaker(obj);
      this.httpService.getKeyForProductivityReport(body, url).subscribe(
        (data) => {
          console.log(data, "Vo Error Data");
          const res: any = data;

          if (res) {
            const obj2 = {
              key: res.key,
              fileType: "json.fileType",
            };
            const url = "downloadReport";
            this.getproductivityDownload(obj2, url);
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

  updateFilterSeting() {
    if (this.selectedQuery.zone_id == "Y") {
      this.isZoneFilterEnabled = true;
    }
    if (this.selectedQuery.region_id == "Y") {
      this.isRegionFilterEnabled = true;
    }
  }

  uniqueBasedReport() {
    if (this.endDate >= this.startDate) {
      this.loadingData = true;
      this.loadingReportMessage = true;
      const obj = {
        startDate: moment(this.startDate).format("YYYY-MM-DD"),
        endDate: moment(this.endDate).format("YYYY-MM-DD"),
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

      const url = "capturedAbnormalUnvisited";
      const body = this.httpService.UrlEncodeMaker(obj);
      this.httpService.getKeyForProductivityReport(body, url).subscribe(
        (data) => {
          const res: any = data;

          if (res) {
            const obj2 = {
              key: res.key,
              fileType: "json.fileType",
            };
            const url = "downloadReport";
            this.getproductivityDownload(obj2, url);
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
      this.toastr.info("Plz Enter a Valid Date and Type", "Required Fields");
    }
  }

  getExpiryData() {
    this.loadingData = true;
    this.loadingReportMessage = true;
    const obj = {
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
      type: this.router.url == "/dashboard/expiry-data-mt" ? 1 : 2,
    };

    const url = "expiry-data-report";
    const body = this.httpService.UrlEncodeMaker(obj);
    this.httpService.getKeyForProductivityReport(body, url).subscribe(
      (data) => {
        const res: any = data;

        if (res) {
          const obj2 = {
            key: res.key,
            fileType: "json.fileType",
          };
          const url = "downloadReport";
          this.getproductivityDownload(obj2, url);
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
  }

  onNotifyClicked(filteredlist: any) {
    this.filteredList = filteredlist;
    this.getDashboardStats();
  }

  downloadOOSShopList() {
    console.log("selected report: " + this.selectedMustHave);
    this.loadingData = true;
    this.loadingReportMessage = true;
    const obj = {
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
      channelId: this.arrayMaker(this.selectedChannel),
      startDate: moment(this.startDate).format("YYYY-MM-DD"),
      endDate: moment(this.endDate).format("YYYY-MM-DD"),
      mustHave: this.selectedMustHave,
    };

    const url = "shopwise-ost-report";
    const body = this.httpService.UrlEncodeMaker(obj);
    this.httpService.getKeyForProductivityReport(body, url).subscribe(
      (data) => {
        const res: any = data;

        if (res) {
          const obj2 = {
            key: res.key,
            fileType: "json.fileType",
          };
          const url = "downloadReport";
          this.getproductivityDownload(obj2, url);
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
  }

  getSupTabsData() {
    this.loadingData = true;
    this.loading = true;
    const obj: any = {
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
      cityId: this.selectedCity.id || -1,
      distributionId: this.selectedDistribution.id || -1,
      storeType: this.selectedStoreType || null,
      channelId: -1,
      type: 2,
    };
    localStorage.setItem("obj", JSON.stringify(obj));
    this.getTableData(obj);
  }

  shouldHideOption(actionType: any): boolean {
    if (this.userZoneId != -1 && actionType?.id == 0) {
      // this.selectedActionTypee = this.actionTypeLists[0]|| [];
      return true; // Hide option with id 0 if loading is -1
    }

    if (this.userRegionId != -1 && actionType?.id == 1) {
      return true; 
    }

    // if (this.regionAcc != -1 && this.zoneAcc == -1 && actionType?.id == 1) {
    //   return true; 
    // }

    // if (loading2 === -1 && actionType.id === 1) {
    //   return true; 
    // }
    // You can add more conditions here if needed
    return false; // Show the option by default
    
  }
}
