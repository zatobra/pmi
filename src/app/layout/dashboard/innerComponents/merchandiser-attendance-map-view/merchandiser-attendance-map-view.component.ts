import { Component, OnInit, ViewChild, Input } from "@angular/core";
import * as moment from "moment";
import { DashboardService } from "../../dashboard.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { environment } from "src/environments/environment";
import { ModalDirective } from "ngx-bootstrap/modal";
import { Config } from "src/assets/config";
import mapboxgl from "mapbox-gl";

@Component({
  selector: "app-merchandiser-attendance-map-view",
  templateUrl: "./merchandiser-attendance-map-view.component.html",
  styleUrls: ["./merchandiser-attendance-map-view.component.scss"],
})
export class MerchandiserAttendanceMapViewComponent implements OnInit {
  // @ViewChild("mapElement") mapElement: ElementRef;
  // ip = environment.ip;
  @Input("surveyorType") surveyorType;
  map: any;
  ip: any = Config.BASE_URI;
  tableData: any = [];
  zones: any = [];
  regions: any = [];
  selectedItem: any = {};
  loadingData: boolean;
  selectedZone: any = {};
  selectedRegion: any = {};
  minDate = new Date(2000, 0, 1);
  maxDate = new Date();
  startDate= new Date();
  endDate = new Date();
  clusterList: any = [];
  title = "Check In";
  @ViewChild("childModal") childModal: ModalDirective;
  userType: any;

  surveyors: any = [];
  selectedSurveyor: any = [];

  labels: any;
  selectedCluster: any;
  newlist: any=[];
  projectType: string;
  categoryList: any;
  channels: any;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private httpService: DashboardService
  ) {
    this.labels = JSON.parse(localStorage.getItem("labelProperties"));
    this.zones = JSON.parse(localStorage.getItem("zoneList"));
    this.clusterList = JSON.parse(localStorage.getItem("clusterList"));
    this.projectType = localStorage.getItem("projectType");
    // mapboxgl.accessToken =Config.MAPBOX_TOKEN;
    mapboxgl.accessToken =localStorage.getItem("mapBoxToken") || Config.MAPBOX_TOKEN;
    
    console.log("mapboxgl.accessToken in attendance view", mapboxgl.accessToken);
    console.log("this.clusterList", this.clusterList);
  }

  showChildModal(): void {
    this.childModal.show();
  }
  hideChildModal(): void {
    this.childModal.hide();
  }

  setSelectedItem(item) {
    this.selectedItem = item;
  }

  ngOnInit() {
    this.clusterList = JSON.parse(localStorage.getItem("clusterList"));
    
    console.log("this.clusterList", this.clusterList);
    if (this.projectType == "NFL" || this.projectType == "TMR" || this.projectType == "NFL_CULINARY" || this.projectType == "NFL_CONDIMENTS" || this.projectType == "Samsung") {
      this.getSelectiveClusters();
    } else {
      this.getZone();
    }
  }
  getDistributionCheckinData() {

console.log("getDistributionCheckinData");

    // if (this.endDate >= this.startDate) {
      this.loadingData = true;
      const obj = {
        startDate: moment(this.startDate).format("YYYY-MM-DD"),
        endDate: moment(this.startDate).format("YYYY-MM-DD"),
        clusterId: this.selectedCluster?.id
          ? this.selectedCluster?.id == -1
            ? localStorage.getItem("clusterId")
            : this.selectedCluster?.id
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
          surveyorIds: "",
      surveyorType: this.surveyorType || -1,
        // channelId: this.arrayMaker(this.selectedChannel),
      };



    // this.loadingData = true;
    // const obj = {
    //   zoneId: localStorage.getItem("zoneId") || -1,
    //   regionId: localStorage.getItem("regionId") || -1,
    //   startDate: moment(this.startDate).format("YYYY-MM-DD"),
    //   endDate: moment(this.endDate).format("YYYY-MM-DD"),
    //   surveyorIds: "",
    //   surveyorType: this.surveyorType || -1,
    // };

    this.httpService.getDistributionCheckInList(obj).subscribe(
      (data) => {
        this.tableData = data;
        this.getUniqueZone();
        this.getMap();
        // setTimeout(() => {
        //   this.getMap();
        // }, 200);
        if (this.tableData.length === 0) {
          this.toastr.info("No record found.");
        }
        this.loadingData = false;
      },
      (error) => {}
    );
  // } else {
  //   this.clearLoading();
  //   this.toastr.info(
  //     "End date must be greater than start date",
  //     "Date Selection"
  //   );
  // }
  }

  goToNewPage(item) {
    window.open(
      `${environment.hash}dashboard/evaluation/list/home?surveyorId=${item.surveyorId}&startDate=${item.date}&endDate=${item.date}&userType=${this.userType}`,
      "_blank"
    );
  }

  getMap() {
    this.map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [69.3451, 30.3753],
      zoom: 4,
    });

    for (const data of this.tableData) {
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<p><strong>Name: </strong>${data.fullName}<br/>
        <strong>Start Time: </strong>${data.startTime}<br/>
        <strong>Remarks: </strong>${data.remarks}</p>`
      );
      const marker1 = new mapboxgl.Marker()
        .setLngLat([data.longitude, data.latitude])
        .setPopup(popup)
        .addTo(this.map);
    }
    this.map.addControl(new mapboxgl.NavigationControl());
    setTimeout(() => this.map.resize(), 0);
  }


  getZoneByCluster() {
    this.loadingData = true;
    this.selectedZone = {};
    this.selectedRegion = {};
    // this.selectedArea = {};
    // this.selectedCity = {};
    // this.selectedDistribution = {};
    // if (this.router.url === "/dashboard/productivity_report"
    // ) {
    //   this.getTabsData();
    // }
    this.httpService.getZoneByCluster(this.selectedCluster.id || -1).subscribe(
      (data) => {
        const res: any = data;
        if (res) {
          this.zones = res;
          this.getDistributionCheckinData();
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

  zoneChange() {
    this.loadingData = true;
    // this.regions = [];
    // this.channels = [];
    this.selectedRegion = {};
    // this.selectedArea = {};
    // this.selectedCity = {};
    // this.selectedDistribution = {};
    // if (
    //   this.router.url === "/dashboard/productivity_report" ||
    //   this.router.url === "/dashboard/merchandiser_attendance" ||
    //   this.router.url === "/dashboard/productivity_dashboard"
    // ) {
    //   this.getTabsData();
    // }

    this.httpService.getRegion(this.selectedZone.id).subscribe(
      (data) => {
        const res: any = data;
        if (res) {
          this.regions = res;
          this.getDistributionCheckinData();
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

  clearLoading() {
    // this.loading = false;
    this.loadingData = false;
  }


  getUniqueZone(){
    const unique = [...new Set(this.tableData.map(item => item.zone))];
    console.log("unique", unique);
    this.getZoneCount(unique);
  }

  getZoneCount(unique){
    let tb= this.tableData;
    this.newlist= [];
    // let newlist= [];
    for(let u of unique){
        let name= u;
        let length=tb.filter(e=> e.zone==name).length;
        console.log("name: ", name, "   lengt: ", length);

        this.newlist.push({
          zone: name,
          count: length
        });
    }

    console.log("newlist: ", this.newlist);
    
    
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
}
