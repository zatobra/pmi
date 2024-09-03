import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit, SimpleChanges, OnChanges, HostListener  } from "@angular/core";
import { DashboardService } from "../../dashboard.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { ModalDirective } from "ngx-bootstrap/modal";
import { Config } from "src/assets/config";
import { environment } from "src/environments/environment";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  NgModel,
} from "@angular/forms";
import * as moment from "moment";
import { Lightbox } from 'ngx-lightbox';
// import { EventEmitterService } from "../../event-emitter.service";
// import { RefreshComService } from "../../refresh-com.service";
// import { ImageViewerConfig } from "@hreimer/angular-image-viewer";

@Component({
  selector: "samsung-leave-management",
  templateUrl: "./samsung-leave-management-component.html",
  styleUrls: ["./samsung-leave-management-component.scss"],
})
export class SamsungLeaveManagementComponent implements OnInit, OnChanges  {
  minDate = new Date(2000, 0, 1);
  maxDate = new Date();
  startDate = new Date();
  endDate = new Date();
  @ViewChild("remarksModal", { static: true }) remarksModal: ModalDirective;
  ip: any = Config.BASE_URI;
  private _albums: any = [];
  loadingData = false;
  selectedUpdate : any;
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

  approvedList : any =[
    {id: 1, value: 'PENDING'},
    {id: 2, value: 'APPROVED'},
    {id: 3, value: 'REJECTED'},
  ]

  labels: any;

  isUpdateRequest: boolean;
  modalTitle: any;



  images = [
    `https://sls-app-resources-bucket.s3.us-east-2.amazonaws.com/temp/1.2M.png?q=${1}`,
    `https://sls-app-resources-bucket.s3.us-east-2.amazonaws.com/temp/520K.png?q=${2}`,
    `https://sls-app-resources-bucket.s3.us-east-2.amazonaws.com/temp/43.6K.png?q=${3}`,
    `https://sls-app-resources-bucket.s3.us-east-2.amazonaws.com/temp/16M.jpg?q=${4}`,
    'https://i.ytimg.com/vi/nlYlNF30bVg/hqdefault.jpg',
    'https://www.askideas.com/media/10/Funny-Goat-Closeup-Pouting-Face.jpg'
  ];

  imageIndexOne = 0;


  form: FormGroup;
  filteredList: any;
  areas: any= [];
  zoneList: any;
  regionList: any;
  areaList: any;
  claimData: any = [];
  user_id: string;
 latitude: number = 32.9235933;
   longitude: number = 72.3989733;
  oneShopData: any= [];
  systemAttendanceData: any = [];
  len: any;
  surveyors: any = [];
  selectedSurveyor: any = [];
  systemAttendanceRemarks: any = [];
  sortBy: any ;
  sortOrder: any;

 

  constructor(
    private httpService?: DashboardService,
    private router?: Router,
    private toastr?: ToastrService,
    public formBuilder?: FormBuilder,
    public _lightbox?: Lightbox
  ) {

  //   window.addEventListener('focus', event => {
  //     console.log("focus: ", event);
  //     if(this.selectedRegion?.id){
  //       this.getSamsungClaimData();
  //     }
  // });
  // window.addEventListener('blur', event => {
  //     console.log("blue: ",event);
  //     if(this.selectedRegion?.id){
  //       this.getSamsungClaimData();
  //     }
      
  // });


// window.onfocus = function(){
//    this.hasfocus = true;
//    console.log("focus:");
//    this.getSamsungClaimData();
// }

// window.onblur = function(){
//    this.hasfocus = false;
//    console.log("blur: ");
//    this.getSamsungClaimData();
// }
   
    this.zones = JSON.parse(localStorage.getItem("zoneList"));
    this.labels = JSON.parse(localStorage.getItem("labelProperties"));
    this.projectType = localStorage.getItem("projectType");
    this.user_id = localStorage.getItem("user_id");
    this.clusterList = JSON.parse(localStorage.getItem("clusterList"));

    this.form = formBuilder.group({
      id: new FormControl(""),
      m_code: new FormControl(""),
      m_name: new FormControl(""),
      mps_date: new FormControl(""),
      remarkId: new FormControl("", [Validators.required]),
    });

  }


  ngOnInit() {
    this.getAllRegions();
    this.getSystemAttendanceRemarks();

  }
  getSystemAttendanceRemarks() {
    this.loadingData = true;
    this.selectedZone = {};
    this.selectedRegion = {};
    this.httpService.getSystemAttendanceRemarks().subscribe(
      (data) => {
        const res: any = data;
        if (res) {
          this.systemAttendanceRemarks = res;
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

  showRemarksModal(data){

    this.form.patchValue({
      id: data.id,
      remarkId : data.remarkId,
      mps_date : data.mps_route_date,
      m_code : data.m_code,
      m_name : data.surveyorName
    });

    this.remarksModal.show();
  }

  hideRemarksModal() {
    
    this.form.reset();
    console.log("this.form.value", this.form.value);
    this.remarksModal.hide();
  }

  updateRemark(data){
    this.loadingModalButton  = true;
    const obj = {
      id : data.id,
      remarkId : data.remarkId,
      requestType : 'update'
    }
    
    this.httpService.updatetSystemAttendanceDataRemarks(obj).subscribe(
      (data) => {
        const res: any = data;
        console.log("SystemAttendanceData Remark Resp: " + data);
        if (res) {
          this.toastr.success("Remark Updated");
          this.hideRemarksModal();
          this.getSystemAttendanceData();
        }
        if (!res) {
          this.toastr.info("Something Went Wrong", "Info");
        }
        this.loadingModalButton = false;
      },
      (error) => {
        this.loadingModalButton = false;
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
      }
    );

  }

  getSystemAttendanceData() {
   this.selectedUpdate = {};
    
    this.loadingData = true;
    this.filteredList = [];
    const obj = {
      regionId: this.selectedRegion.id
        ? this.selectedRegion.id == -1
          ? localStorage.getItem("regionId")
          : this.selectedRegion.id
        : localStorage.getItem("regionId"),
        zoneId: this.selectedZone.id ? this.selectedZone.id: -1,
        surveyorIds: this.arrayMaker(this.selectedSurveyor) || -1,
        startDate :  moment(this.startDate).format("YYYY-MM-DD"),
        endDate : moment(this.endDate).format("YYYY-MM-DD"),
      }
      
    this.httpService.getSystemAttendanceData(obj).subscribe(
      (data) => {
        const res: any = data;
        console.log("SystemAttendanceData: ",data);
        if (res) {
          // this.claimData = data;
          // this.getList();
          this.systemAttendanceData = data;
          this.filteredList= this.systemAttendanceData;
          // this.setImageUrl();
          // this.loadingData = false;
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

  selectedUpdateChange(){
    this.filteredList =this.systemAttendanceData;
    this.filteredList = this.systemAttendanceData.filter(e=> e.claimStatus== this.selectedUpdate.value);

  }

  showImageLigtBox(index: number): void {
    // open lightbox
    // this._lightbox.open(this._albums, index, {
    //   wrapAround: true,
    //   disableKeyboardNav: false,
    //   showZoom: true
    //   // showDownloadButton: true,
    //   // showRotate: true,
    //   // positionFromTop: 40
    // });
  }



  ngOnChanges(changes: SimpleChanges): void {
    // console.log('imagesSectionList: ', this.systemAttendanceData);
    // for (let i = 0; i < this.systemAttendanceData.imageList.length; i++) {
    //   const src = this.ip + this.systemAttendanceData.imageList[i].image_url;
    //   const caption = 'Image ' + i + ' caption here';
    //   const thumb = this.systemAttendanceData.imageList[i].image_url;
    //   console.log('imagesSectionList: ', src);
    //   console.log('imagesSectionList: ', caption);
    //   console.log('imagesSectionList: ', thumb);
    //   const album = {
    //     src: src,
    //     caption: caption,
    //     thumb: thumb
    //   };

    //   this._albums.push(album);
    // }
    // this.filterimg(this.systemAttendanceData.imageList);
  }
  filterimg(imagesSectionList) {
    
    this.len = imagesSectionList.length;
    let i = this.odd(imagesSectionList.length);
    if (i == 1) {
      // this.imagesSectionList.filter(e => this.imagesSectionList.length - 1);
      // for(const k=1; k<=imagesSectionList.length-1; k++){
      //     this.newArray.push();
      // }
      this.len = imagesSectionList.length - 1;
    }
  }

  odd(i) {
    return i % 2;
  }

  open(index: number): void {
    // open lightbox
    
    this._lightbox.open(this._albums, 0, {
      wrapAround: true,
      disableKeyboardNav: false,
      showZoom: true
      // showDownloadButton: true,
      // showRotate: true,
      // positionFromTop: 40
    });
  }

  close(): void {
    // close lightbox programmatically
    
    // this._albums = [];
    this._lightbox.close();
    
  }

  open2(data){
    let imglist = data.imageList;
    
    this._albums = [];
    console.log('data: ', data);
    for (let i = 0; i < imglist.length; i++) {
      const src = imglist[i];
      const caption = 'Image ' + data.id + ' caption here';
      const thumb = imglist[i];
      console.log('imagesSectionList: ', src);
      console.log('imagesSectionList: ', caption);
      console.log('imagesSectionList: ', thumb);
      const album = {
        src: src,
        caption: caption,
        thumb: thumb
      };

      this._albums.push(album);
    }

    this.open(0);
    this.filterimg(imglist);
  }



  getDistinctClaimObjId(){
    const unique = [...new Set(this.claimData.map(item => item.zone))];
    console.log("unique", unique);
    this.getList();
  }

  getList(){
    this.systemAttendanceData = this.claimData.filter(
      (thing, i, arr) => arr.findIndex(t => t.id === thing.id) === i
    );

    for(let k of this.systemAttendanceData){
      let imageList = [];

      for(let j of this.claimData){
        if(j.id==k.id){
          imageList.push(j.image_url);
        }
      }

      console.log("imageList", imageList);
      k.imageList = imageList;
    }

console.log("systemAttendanceData", this.systemAttendanceData);

this.externalUrl();
  }

  externalUrl(){
    for(let data of this.systemAttendanceData){
      for(let i=0; i<data.imageList.length; i++){
        if (data.imageList[i].indexOf("http") < 0) {
          data.imageList[i] = this.ip + data.imageList[i];
        }
      }
    }

    console.log("this.systemAttendanceData: ", this.systemAttendanceData);

  }


  setImageUrl() {
    for(let data of this.systemAttendanceData){
      if(data?.imageList){
        for (const image of data?.imageList) {
          if (image.url != null) {
            if (image.url.indexOf("http") >= 0) {
              const i = data.imageList.findIndex((e) => e.url == image.url && e.imageId == image.imageId);
              data.imageList[i].isExternalUrl = true;
            }
          }
        }
      }
    }

    console.log("this.systemAttendanceData; ", this.systemAttendanceData);
    this.filteredList = this.systemAttendanceData;
}

goToEvaluation(data) {
  console.log("goToEvaluation data: ", data);
  window.open(
    `${
      environment.hash
    }dashboard/samsung-claim-images?obj=${
      JSON.stringify(data)
    }`,
    "_blank"
  );
}

loadSurveyors() {
  this.loadingData = true;
  this.httpService
    .getSurveyors(
      -1,
      this.selectedZone.id || -1,
      this.selectedRegion.id || -1
    )
    .subscribe(
      (data) => {
        const res: any = data;
        if (res) {
          this.surveyors = res;
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

arrayMaker(arr) {
  const all = arr.filter((a) => a === "all");
  const result: any = [];
  if (all[0] === "all") {
    arr = this.surveyors.filter(
      (surveyor: any) => surveyor.type == 1 && surveyor.active == "Y"
    );
  }
  arr.forEach((e) => {
    result.push(e.id);
  });
  return result;
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

selectedSurveyorChanged(){
  this.filteredList = [];
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
