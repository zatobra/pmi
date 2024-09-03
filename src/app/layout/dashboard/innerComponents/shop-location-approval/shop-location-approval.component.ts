import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit  } from "@angular/core";
import { DashboardService } from "../../dashboard.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { ModalDirective } from "ngx-bootstrap/modal";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
import * as moment from "moment";

@Component({
  selector: "app-shop-location-approval",
  templateUrl: "./shop-location-approval.component.html",
  styleUrls: ["./shop-location-approval.component.scss"],
})
export class ShopLocationApprovalComponent implements OnInit  {
  loadingData = false;
  loadingModal = false;
  loadingModalButton = false;
  projectType: any;
  emailList: any = [];
  tmpEmailList: any = [];
  emailTypes: any = [];
  selectedEmailType: any;
  addressTypes: any = [];
  clusterList: any = [];
  zones: any = [];
  regions: any = [];
  zoneObj ={id: -1, title: "All"}
  selectedCluster: any = {};
  selectedZone: any ;
  selectedRegion: any ;
 
  activeStatus: any = [
    { id: 1, value: "Y" },
    { id: 2, value: "N" },
  ];

  labels: any;

  isUpdateRequest: boolean;
  modalTitle: any;

  @ViewChild("childModal", { static: true }) childModal: ModalDirective;

  form: FormGroup;
  filteredList: any;
  areas: any= [];
  zoneList: any;
  regionList: any;
  areaList: any;
  shopLocationData: any = [];
  user_id: string;
 latitude: number = 32.9235933;
   longitude: number = 72.3989733;
  oneShopData: any= [];

  constructor(
    private httpService: DashboardService,
    private router: Router,
    private toastr: ToastrService
  ) {
   
    this.zones = JSON.parse(localStorage.getItem("zoneList"));
    this.labels = JSON.parse(localStorage.getItem("labelProperties"));
    this.projectType = localStorage.getItem("projectType");
    this.user_id = localStorage.getItem("user_id");
    this.clusterList = JSON.parse(localStorage.getItem("clusterList"));

  }

  ngOnInit() {
    // this.getShopLocationApprovalData();
    // this.latitude = 32.9235933;
    // this.longitude = 72.3989733;
    this.getAllRegions();
  }

  showShopOnMap(data){
    this.oneShopData=[];
    console.log("showShopOnMap Data", data);
    
    this.oneShopData.push({
      shopPin: false,
      latitude: data.latitude,
      longitude: data.longitude,
      m_code: data.m_code,
      shop_code: data.shop_code,
      full_name: data.full_name,
      shop_id: data.shop_id
    });

    this.oneShopData.push({
      shopPin: true,
      latitude: data.shopLat,
      longitude: data.shopLong,
      m_code: data.m_code,
      shop_code: data.shop_code,
      full_name: data.full_name,
      shop_id: data.shop_id
    })

    console.log("showShopOnMap oneShopData", this.oneShopData);
    // this.oneShopData= data;

  }

  getShopLocationApprovalData() {
    
    this.loadingData = true;
    const obj = {
      regionId: this.selectedRegion.id
        ? this.selectedRegion.id == -1
          ? localStorage.getItem("regionId")
          : this.selectedRegion.id
        : localStorage.getItem("regionId"),
        zoneId: this.selectedZone.id ? this.selectedZone.id: -1
      }
    this.httpService.getShopLocationApprovalData(obj).subscribe(
      (data) => {
        const res: any = data;
        if (res) {
          this.shopLocationData = data;
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

  changeStatus(checkedEvent, data){
    console.log("id: ", data?.id, "checkedEvent", checkedEvent.target.checked );
    console.log("email in changestatus: ", data);
    let obj=data;
    obj.user_id= this.user_id;
    obj.approved_date= moment().format('YYYY-MM-DD hh:mm:ss');
  
    this.loadingModal = true;
    this.loadingModalButton = true;
    this.httpService.updateShopLocationApproval(obj).subscribe((data: any) => {
     debugger;
      if (data) {
        this.toastr.success(data);
        this.getShopLocationApprovalData();
        console.log("Status Change: ",data)
          // email.active=obj.active;
       
      } else {
        this.toastr.error("Not Approved","Error");
        this.getShopLocationApprovalData();
        console.log("Status not Change: ",data)
      }
    
      
      this.loadingModal = false;
    this.loadingModalButton = false;
    }
    
    );
  }

  getZoneByCluster() {
    this.loadingData = true;
    this.selectedZone = {};
    this.selectedRegion = {};
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

  zoneChange() {
    this.loadingData = true;
    this.selectedRegion = {};

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

  getAllRegions() {
    this.loadingData = true;
    this.httpService.getRegions().subscribe(
      (data) => {
        const res: any = data;
        if (res.regionList) {
          this.regionList = res.regionList;
          
          // localStorage.setItem('regionList', JSON.stringify(res.regionList));
        }
        if (!res.regionList) {
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

  clearLoading() {
    this.loadingData = false;
  }
 

}
