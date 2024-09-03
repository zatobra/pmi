import {
  Component,
  OnInit,
  OnChanges,
  AfterViewChecked,
  Input,
  Output,
  ViewChild,
  AfterContentChecked,
  ViewEncapsulation,
  EventEmitter,
  ChangeDetectorRef,
} from "@angular/core";
import { DashboardService } from "../../dashboard.service";
import { DashboardDataService } from "../../dashboard-data.service";
import * as moment from "moment";
import { subscribeOn } from "rxjs/operators";
import { Router } from "@angular/router";
import { ChartDataSets, ChartOptions, ChartType } from "chart.js";
import {
  Color,
  Label,
  monkeyPatchChartJsLegend,
  monkeyPatchChartJsTooltip,
  MultiDataSet,
  SingleDataSet,
  SingleOrMultiDataSet,
} from "ng2-charts";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { MatTableDataSource } from "@angular/material/table";
import { environment } from "src/environments/environment";
import { NgModel } from "@angular/forms";
import { ModalDirective } from "ngx-bootstrap/modal";
import * as _ from "lodash";
import { Config } from "src/assets/config";
import { async } from "@angular/core/testing"

@Component({
  selector: 'app-visit-base-productivity',
  templateUrl: './visit-base-productivity.component.html',
  styleUrls: ['./visit-base-productivity.component.scss']
})
export class VisitBaseProductivityComponent implements OnInit{
  shopCode: any = '';
  supervisorType= [
    {id: -1 , title :"All"},
    {id: 2 , title :"Permanent"},
    {id: 3 , title :"Seasonal"},
  ];

  @Output("dataEmitter") dataEmitter: any = new EventEmitter<any>();
  
  colors: Color[] = [
    {
      backgroundColor: ["#1B28B4", "#ACA7E1"],
    },
  ];
  obj: any;
  title: any;
  route: any;
  route_Id: any;
  successful: any;
  surveyorList: any;
  supervisorList: any[];
  // surveyTypes: any = [
  //   // { title: -1, surveyType: "All" },
  //   { title: "Permanent", surveyType: "Permanent" },
  //   { title: "Seasonal", surveyType: "Seasonal" },
  // ];
selectedSurveyType: any;
  constructor(
    private toastr: ToastrService,
    private httpService: DashboardService,
    public router: Router,
    private dataService: DashboardDataService,
    public formBuilder: FormBuilder
  ) {
    
    this.prepareObject();
    this.zones = JSON.parse(localStorage.getItem("zoneList"));
    this.clusterList = JSON.parse(localStorage.getItem("clusterList"));
    this.categoryList = JSON.parse(localStorage.getItem("assetList"));
    this.channels = JSON.parse(localStorage.getItem("channelList"));
    this.projectType = localStorage.getItem("projectType");
    this.clusterId = localStorage.getItem("clusterId") || -1;
    this.labels = JSON.parse(localStorage.getItem("labelProperties"));
    this.projectType = localStorage.getItem("projectType");
    this.accessProperties = JSON.parse(
      localStorage.getItem("accessProperties")
    );
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
  zones: any = [];
  loadingData: boolean;
  regions: any = [];
  routesList: any = [];
  activeRoutesList: any = [];
  channels: any = [];
  options: any = ["Yes", "No"];

  selectedZone: any = {};
  selectedRegion: any = {};
  selectedChannel: any = [];
  selectedSuperviser : any ;
  selectedType : any ;
  startDate = new Date();
  endDate = new Date();
  areas: any = [];
  regionId = -1;

  selectedArea: any = {};
  lastVisit: any = [];
  selectedLastVisit = 1;
  mustHave: any = [];
  mustHaveAll: any = [];
  selectedMustHave: any = {};
  selectedMustHaveAll = "";
  merchandiserList: any = [];
  selectedMerchandiser: any = {};
  selectedactionsType: any = {};
  selectedCriteriaType: any = {};
  clickedOnce = 1;
  categoryList: any = [];
  selectedCategory: any = {};
  cities: any = [];
  selectedCity: any = {};
  productsList: any = [];
  selectedProduct: any = [];
  selectedImpactType: any = {};
  impactTypeList: any = [];
  response: any = "";
  shopWiseCount: any = [];
  mustHaveList = ["Y", "N"];
  

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
  actionTypeLists=[
    {id: 0, name:'National'},
    {id: 1, name:'Zonal'},
    {id: 2, name:'Regional'},
  ];


  clusterId: any;
  errorDetail: any;

  accessProperties: any;
  selectedRouteId: any;

  dashboardStatsObj: any = {};

  selectedChannelMulti: any = [];

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
    this.loadSurveyors();
    this.httpService.checkDate();
    
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
        this.surveyorType = "Supervisor";
      }
     this.updateData();
    }
    if (this.projectType == "NFL" || this.projectType == "TMR" || this.projectType == "NFL_CULINARY" || this.projectType == "NFL_CONDIMENTS" || this.projectType == "Samsung") {
      this.getSelectiveClusters();
    } else {
      this.getZone();
    }

  }
  getSelectiveClusters() {
    this.httpService.getAllClusters().subscribe(
      (data) => {
        const res: any = data;
        if (res.clusterList) {
          localStorage.setItem("clusterList", JSON.stringify(res.clusterList));
          localStorage.setItem("channelList", JSON.stringify(res.channelList));
          this.clusterList = res.clusterList;
          console.log("clusterlist", this.clusterList)
          this.categoryList = res.assetList;
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

  async getRoutes() {
    this.loadingData = true;

    const data: any = await this.httpService.getRoutes().toPromise();
    // (data) => {
    if (data) {
      const res: any = data;
      
      if (res) {
        this.routesList = res;
        console.log("this.routesList: ", this.routesList);
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

  clearLoading() {
    this.loading = false;
    this.loadingData = false;
    this.loadingReportMessage = false;
  }
 
  getZone() {
    this.httpService.getZone().subscribe(
      (data) => {
        const res: any = data;
        if (res.zoneList) {
          localStorage.setItem("zoneList", JSON.stringify(res.zoneList));
          localStorage.setItem("assetList", JSON.stringify(res.assetList));
          localStorage.setItem("channelList", JSON.stringify(res.channelList));
          this.zones = res.zoneList;
          this.categoryList = res.assetList;
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
    this.httpService.getZoneByCluster(this.selectedCluster.id || -1).subscribe(
      (data) => {
        const res: any = data;
        if (res) {
          this.zones = res;
        }
       this.prepareObject();
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


  zoneChange() {
    
    this.loadingData = true;
    // this.regions = [];
    // this.channels = [];
    this.selectedRegion = {};
    this.selectedArea = {};
    this.selectedCity = {};
    this.selectedDistribution = {};
    this.httpService.getRegion(this.selectedZone.id).subscribe(
      (data) => {
        const res: any = data;
        if (res) {
          this.regions = res;
        }
        this.prepareObject();

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

  regionChange() {
    
    this.selectedArea = {};
    this.selectedCity = {};
    this.selectedDistribution = {};
   

      this.loadingData = true;
      this.httpService.getAreaByRegion(this.selectedRegion.id || -1).subscribe(
        (data) => {
          // this.channels = data[0];
          const res: any = data;
          if (res) {
            this.areas = res;
          }
         this.prepareObject();

          setTimeout(() => {
            this.loadingData = false;
          }, 500);
        },
        (error) => {
          this.clearLoading();
        }
      );
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
        // channelId: this.selectedChannel.id|| -1, 
        channelId: this.arrayAndStringMaker(this.selectedChannelMulti) || -1,
        superviserId: this.selectedSuperviser ? this.selectedSuperviser.id : -1,
        merchandiserType: this.selectedType?.title ? this.selectedType.title : "All",
        shopCode : this.shopCode || '',
      };
      const url = "productivityreport";
      const body = `type=2&pageType=1&zoneId=${obj.zoneId}&regionId=${obj.regionId}&startDate=${obj.startDate}
      &endDate=${obj.endDate}&distributionId=${obj.distributionId}&cityId=${obj.cityId}
      
      &storeType=${obj.storeType}&channelId=${obj.channelId}&superviserId=${obj.superviserId}&shopCode=${obj.shopCode}&merchandiserType=${obj.merchandiserType}`;
      // &storeType=${obj.storeType}&channelId=${obj.channelId}`;

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
  arrayMaker(arr) {
    const all = arr.filter((a) => a === "All");
    const result: any = [];
    if (all[0] === "All") {
      arr = this.channels;
    }
    arr.forEach((e) => {
      result.push(e.id);
    });
    return result;
  }

 
 updateData(){
const obj= {
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
    areaId: this.selectedArea.id
      ? this.selectedArea.id == -1
        ? localStorage.getItem("areaId")
        : this.selectedArea.id
      : localStorage.getItem("areaId"),
      startDate :moment(this.startDate).format("YYYY-MM-DD"),
      endDate : moment(this.endDate).format("YYYY-MM-DD"),
      cityId: this.selectedCity.id || -1,
      distributionId: this.selectedDistribution.id || -1,
      storeType: this.selectedStoreType || null,
      // channelId: this.selectedChannel.id
      // ? this.selectedChannel.id == -1
      //   ? localStorage.getItem("channelId")
      //   : this.selectedChannel.id
      // : localStorage.getItem("channelId"),
      channelId: this.arrayAndStringMaker(this.selectedChannelMulti) || -1,
      routeId: this.route ? this.route.id : -1,
      superviserId: this.selectedSuperviser ? this.selectedSuperviser.id : -1,
      merchandiserType: this.selectedType?.title ? this.selectedType.title : "All",
      shopCode : this.shopCode || '',
      surveyType:this.selectedSurveyType,
  };
 this.dataEmitter.emit(obj)
 console.log("obj",obj)
}

prepareObject(){
  if (this.router.url === "/dashboard/productivity_report" ||
  this.router.url === "/dashboard/supervisor_productivity"
) {
  this.isSupervisorDataRequest = true;
  // this.surveyorType = "Supervisor";
   }
   this.updateData();
}

loadSurveyors() {
  this.loadingData = true;
  this.httpService
    .getSurveyors(
      -1,
      -1,
      this.selectedRegion.id
      ? this.selectedRegion.id == -1
        ? localStorage.getItem("regionId")
        : this.selectedRegion.id
      : localStorage.getItem("regionId")
    )
    .subscribe(
      (data) => {
        const res: any = data;
        if (res) {
          this.surveyorList = res;
          console.log("merch data: ", this.surveyorList);
          // this.getMerchandisers();
          this.getSupervisors();
          // this.getManagers();
        }
        if (!res) {
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

  getSupervisors() {
    this.supervisorList = [];
    for (const surveyor of this.surveyorList) {
      if (surveyor.type == 2) {
        this.supervisorList.push(surveyor);
      }
    }
    // const noSuperVisor={
    //   supervisorList.
    // };
    console.log(this.supervisorList);
  }

  prepareObject2(){
    console.log("shopCode: ", this.shopCode);
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

  arrayAndStringMaker(selectedChannelMulti){
    console.log("(selectedChannelMulti)", selectedChannelMulti);
    console.log("this.arrayMaker(this.selectedChannel)", this.arrayMaker(selectedChannelMulti));
    let arr= this.arrayMaker(selectedChannelMulti)
    let str = arr.toString(); 
    console.log("arr: ", arr, "Returned string is : " + str );
    return str;
  }

  // arrayMaker(arr) {
  //   const all = arr.filter((a) => a === "all");
  //   const result: any = [];
  //   if (all[0] === "all") {
  //     arr = this.channels;
  //   }
  //   arr.forEach((e) => {
  //     result.push(e.id);
  //   });
  //   return result;
  // }

}



