import { Component, OnInit, ViewChild, ViewChildren } from "@angular/core";
import { environment } from "src/environments/environment";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { DashboardService } from "../../dashboard.service";
import { NgModel } from "@angular/forms";
import { ModalDirective } from "ngx-bootstrap/modal";
import * as moment from "moment";
import {  Moment } from 'moment';
import { Config } from "src/assets/config";
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    //for MOnth nd Year
    // dateInput: 'MM/YYYY',
    //for Day, MOnth nd Year
    // dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

declare const google: any;
@Component({
  selector: "upload-sales-file",
  templateUrl: "./upload-sales-file-component.html",
  styleUrls: ["./upload-sales-file-component.scss"],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class UploadSalesFileComponent implements OnInit {
   @ViewChild("errorModal", { static: true }) errorModal: ModalDirective;
  @ViewChildren("checked") private myCheckbox: any;
  date2 = new Date();
  loadingData: boolean;
  selectedRegionUp: any = new FormControl({}, [Validators.required]);
  selectedFile = new FormControl(null, [Validators.required]);
  selectedOption = new FormControl("", [Validators.required]);
  form: FormGroup;
  map: google.maps.Map
  center: any = {
    lat: 33.5362475,
    lng: -111.9267386
  };
  drawingManager: any;
  loading = false;
  latitude = 20.5937;
  longitude = 78.9629;
  trackedShops: any = [];
  showMap = false;
  show: boolean;
  shopWiseCount: any = [];
  selectedSurveyors: any = [];
  regionId: any;
  zoneId: any;
  selectedZone: any = {};
  selectedRegion: any = {};
  regionIdTmp = -1;
  regions: any = [];
  response: any = "";
  projectType: any;
  labels: any;
  filteredShops: any = [];
  selectedShop: any = {};
  shops: any = [];
  pointList: any= [];
  polyArrayLatLng: any= [];
  bermudaTriangle2:any;
  shopIds: any=[];
  selectedShape: any;
  selectedArea = 0;
  colorType = Config.BASE_URI + "/images/map-marker-icons/";
  isRegionRequired = true;
  radioOptions: string;
  fileTypesList =[
    {value: "Main MD File", title: "Main MD File"},
    {value: "Sku Segment", title: "Sku Segment"},
    {value: "MD To Sub Channel", title: "MD To Sub Channel"},
    {value: "RawInventory", title: "RawInventory"},
];

monthList =[
  {value: "01", title: "January"},
  {value: "02", title: "February"},
  {value: "03", title: "March"},
  {value: "04", title: "April"},
  {value: "05", title: "May"},
  {value: "06", title: "June"},
  {value: "07", title: "July"},
  {value: "08", title: "August"},
  {value: "09", title: "September"},
  {value: "10", title: "October"},
  {value: "11", title: "November"},
  {value: "12", title: "December"},
];
  monthValue: any;
  date: string;
  year = new FormControl(moment());
  //date5 = moment();
  year2: any = moment();
  loadingReportMessage= false;
  constructor(
    private toastr: ToastrService,
    private httpService: DashboardService,
    public formBuilder: FormBuilder
  ) {
    this.form = formBuilder.group({
      selectedRegionUp: this.selectedRegionUp,
      selectedOption: this.selectedOption,
      avatar: null,
    });
    this.projectType = localStorage.getItem("projectType");
    this.labels = JSON.parse(localStorage.getItem("labelProperties"));
    if (
      this.projectType == "NFL" ||
      this.projectType == "NFLSO" ||
      this.projectType == "TMR"
    ) {
      this.isRegionRequired = false;
    }
    this.date = moment().format('YYYY-MM-DD hh:mm:ss');

    //for simple year drop down
    // this.selectedYear = new Date().getFullYear();
    // for (let year = this.selectedYear; year >= 2020; year--) {
    //   this.years.push(year);
    // }

  }
  ngOnInit() {
    
    // this.getAllRegions();

  }
  onMapReady(map: any) {
    this.map = map;
    this.initDrawingManager(map)
  }
 
  initDrawingManager(map: any) {
    
    const self = this;
    const options = {
      drawingControl: true,
      drawingControlOptions: {
        drawingModes: ["polygon"]
      },
      polygonOptions: {
        draggable: true,
        editable: true
      },
      drawingMode: google.maps.drawing.OverlayType.POLYGON
    };

    // const drawingManager2 = new google.maps.drawing.DrawingManager(options);
    this.drawingManager=  new google.maps.drawing.DrawingManager(options);
    // drawingManager.setMap(null);
    this.drawingManager.setMap(map);



    google.maps.event.addListener(
      this.drawingManager,
      'overlaycomplete',
      (event) => {
        // if (event.type === google.maps.drawing.OverlayType.POLYGON) {
        //   const paths = event.overlay.getPaths();
        //   for (let p = 0; p < paths.getLength(); p++) {
        //     google.maps.event.addListener(
        //       paths.getAt(p),
        //       'set_at',
        //       () => {
        //         if (!event.overlay.drag) {
        //           self.updatePointList(event.overlay.getPath());
        //         }
        //       }
        //     );
        //     google.maps.event.addListener(
        //       paths.getAt(p),
        //       'insert_at',
        //       () => {
        //         self.updatePointList(event.overlay.getPath());
        //       }
        //     );
        //     google.maps.event.addListener(
        //       paths.getAt(p),
        //       'remove_at',
        //       () => {
        //         self.updatePointList(event.overlay.getPath());
        //       }
        //     );
        //   }
          self.updatePointList(event.overlay.getPath());
          this.selectedShape = event.overlay;
          this.selectedShape.type = event.type;
        // }


       // to limit user to draw one polygon at at ime
        if (event.type !== google.maps.drawing.OverlayType.MARKER) {
          // Switch back to non-drawing mode after drawing a shape.
          self.drawingManager.setDrawingMode(null);
          // To hide:
          self.drawingManager.setOptions({
            drawingControl: false,
          });
        }

      
      }
      );

     const that=this;


      // const triangleCoords = [
      //   { lat: 25.774, lng: -80.19 },
      //   { lat: 18.466, lng: -66.118 },
      //   { lat: 32.321, lng: -64.757 },
      // ];
      // const bermudaTriangle = new google.maps.Polygon({ paths: triangleCoords });
      // console.log("bermudaTriangle",bermudaTriangle);


      // google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (event) => {
      //   // Polygon drawn
      //   if (event.type === google.maps.drawing.OverlayType.POLYGON) {
      //     //this is the coordinate, you can assign it to a variable or pass into another function.
      //     alert(event.overlay.getPath().getArray());
      //     console.log("event",event.overlay.getPath().getArray());
      //   }
      // });

      // this.getShopsId();

      // google.maps.event.addListener(map, "click", (e) => {
      //   console.log("e.bermudaTriangle2,", this.bermudaTriangle2);
      //   console.log("e.latLng,", e.latLng);
      //   const resultColor = google.maps.geometry.poly.containsLocation(
      //     e.latLng,
      //     this.bermudaTriangle2
      //   );
      //   console.log("e.resultColor,", resultColor);
      // }
      // );

      google.maps.event.addListener(this.drawingManager, 'polygoncomplete', function (polygon) {
        const len = polygon.getPath().getLength();
        that.polyArrayLatLng = [];
  
        for (let i = 0; i < len; i++) {
          const vertex = polygon.getPath().getAt(i);
          const vertexLatLng = {lat: vertex.lat(), lng: vertex.lng()};
          that.polyArrayLatLng.push(vertexLatLng);
        }
        // the last point of polygon should be always the same as the first point (math rule)
        that.polyArrayLatLng.push(that.polyArrayLatLng[0]);
  
  
        console.log('coordinates', that.polyArrayLatLng);
        that.bermudaTriangle2 = new google.maps.Polygon({ paths: that.polyArrayLatLng });

      console.log("bermudaTriangle",that.bermudaTriangle2);
      // this.getShopsId();


      // 
      // console.log("getshopids");
      // for(const i of that.trackedShops){
      //   const latNlng= new google.maps.LatLng(i.latitude,i.longitude)
      //   // const latNlng=i.latitude+i.longitude;
      //   console.log("latNlng", latNlng, "i.latitude", i.latitude);
      //   const resul = google.maps.geometry.poly.containsLocation(
      //     latNlng,
      //     bermudaTriangle2
      //   );
      //   console.log("result", resul);
      //   if(resul){
      //     that.shopIds.push(i.id);
      //   }
      // }
      // console.log("this.shopIds: ", that.shopIds);
      that.getShopsId();


      });

      // const bermudaTriangle2 = new google.maps.Polygon({ paths: this.polyArrayLatLng });

      // console.log("bermudaTriangle",bermudaTriangle2);
      // this.getShopsId(bermudaTriangle2);

    }
  getShopsId() {
    this.shopIds=[];
    
    console.log("getshopids");
    for(const i of this.trackedShops){
      const latNlng= new google.maps.LatLng(i.latitude,i.longitude)
      // const latNlng=i.latitude+i.longitude;
      console.log("latNlng", latNlng, "i.latitude", i.latitude);
      const resul = google.maps.geometry.poly.containsLocation(
        latNlng,
        this.bermudaTriangle2
      );
      console.log("result", resul);
      if(resul){
        this.shopIds.push(i.id);
      }
    }
    console.log("this.shopIds: ", this.shopIds);
    this.insertShopIds();
  }
    updatePointList(path) {
      this.pointList = [];
      const len = path.getLength();
      for (let i = 0; i < len; i++) {
        this.pointList.push(
          path.getAt(i).toJSON()
        );
      }
      this.selectedArea = google.maps.geometry.spherical.computeArea(
        path
      );
    }
   
  showCount(action) {
    if (this.regionId) {
      this.selectedSurveyors = [];
      this.loadingData = true;
      const obj = {
        regionId: this.regionId,
        action: action,
      };
      this.httpService.displayRouteStatus(obj).subscribe(
        
        (data) => {
          console.log("show data",data );
          if (data) {
            this.shopWiseCount = data;
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
   getShops() {
    
    if (this.regionId) {
    this.trackedShops = [];
    this.loadingData = true;
   this.httpService
      .getAllShops(this.zoneId || -1, this.regionId || -1)
      .subscribe((res: any) =>{
        console.log("res ", res);
        if(res.length <=0){
          this.toastr.error("Shop Not Found");
          
          this.loading = false;
        }else{

        this.trackedShops = [];
        this.trackedShops = res
        console.log("tracked shop: ", this.trackedShops);
        this.loading = false;
        // this.latitude = parseFloat(this.trackedShops[0].latitude);
        // this.longitude = parseFloat(this.trackedShops[0].longitude);
      //   const alldata = this.trackedShops.map((id) => {
          
      //     return id.regionId ;
        

      // //  this.legends = new Set(alldata);
      //  } );
        }
      
    });
  
      // this.loadingData = true;
      // this.httpService
      //   .getAllShops(this.zoneId || -1, this.regionId || -1)
      //   .subscribe(
      //     (data) => {
      //       const res: any = data;
      //       if (res) {
      //         this.shops = res;
      //         this.filteredShops = this.shops;
      //       } else {
      //         this.clearLoading();
  
      //         this.toastr.info(
      //           "Something went wrong,Please retry",
      //           "Connectivity Message"
      //         );
      //       }
  
      //       setTimeout(() => {
      //         this.loadingData = false;
      //       }, 500);
      //     },
      //     (error) => {
      //       this.clearLoading();
      //     }
      //   );
      }
  }
  deleteSelectedShape() {
    if (this.selectedShape) {
      this.selectedShape.setMap(null);
      this.selectedArea = 0;
      this.pointList = [];
      // To show:
      this.drawingManager.setOptions({
        drawingControl: true,
      });
    }
  }

  insertShopIds(){
    this.httpService.insertShopsIds(this.shopIds).subscribe(
      (data) => {
        if (data) {
          this.toastr.success(" ID's Added Successfully  ");
          this.showCount("show");
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
  
  deleteRoutes(action) {
    this.loadingData = true;
    const obj = {
      surveyorIds: this.selectedSurveyors,
      action: action,
    };
    this.httpService.updateRouteStatus(obj).subscribe(
      (data) => {
        if (data) {
          this.toastr.success("Routes Deactivated Successfully ");
          this.showCount("show");
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

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.get("avatar").setValue(file);
    }
  }

  uploadData(post) {
    const formData = new FormData();
    formData.append("cityId", post.selectedRegionUp);
    formData.append("newSurveyor", "No");
    // formData.append("fileType", this.radioOptions);
    formData.append("fullDate", moment(this.year.value).format("YYYY") + '-' + this.monthValue);
    // formData.append('startDate', post.date);
    console.log("fulldate: ", moment(this.year.value).format("YYYY") + '-' + this.monthValue);
    formData.append("filePath", this.form.get("avatar").value);
    console.log("this.year.value: ",moment(this.year.value).format("YYYY"));
    console.log("this.monthValuee: ",this.monthValue);


    formData.append("monthNo", this.monthValue);
    formData.append("yearNo", moment(this.year.value).format("YYYY"));


if (this.form.get("avatar").value == null || !this.monthValue
|| !moment(this.year.value).format("YYYY")) {
      this.loadingData = false;
      this.toastr.error("Plz select all filters");
    } 
    else {
      this.loadingData = true;
      this.httpService.uploadSalesFile(formData).subscribe((data) => {
        if (data) {
          debugger;
          this.response = data;
          if (this.response.length > 0) {
            this.showCount("show");
            // this.showErrorModal();
            this.loadingData = false;
            console.log(this.response, "Info");
            this.toastr.info(this.response, "Info");
          }
        } else {
          this.loadingData = false;
          this.toastr.error("There is an error in ur file!!");
        }
      });
    }
  }

  showErrorModal(): void {
    this.errorModal.show();
  }
  hideErrorModal(): void {
    this.errorModal.hide();
  }

  checkUncheckSingle(event, item, index) {
    if (event.checked === true) {
      this.selectedSurveyors.push(item.surveyor_id);
      console.log(this.selectedSurveyors);
    } else {
      const i = this.selectedSurveyors.indexOf(item.surveyor_id);
      this.selectedSurveyors.splice(i, 1);
      console.log(this.selectedSurveyors);
    }
  }

  checkUncheckAll(event) {
    if (event.checked === true) {
      for (let i = 0; i < this.shopWiseCount.length; i++) {
        if (
          this.selectedSurveyors.indexOf(this.shopWiseCount[i].surveyor_id) ==
          -1
        ) {
          this.selectedSurveyors.push(this.shopWiseCount[i].surveyor_id);
          console.log(this.selectedSurveyors);
        }
      }
      for (let index = 0; index < this.myCheckbox._results.length; index++) {
        this.myCheckbox._results[index]._checked = true;
      }
    } else {
      for (let i = 0; i < this.shopWiseCount.length; i++) {
        const i = this.selectedSurveyors.indexOf("surveyor_id");
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

  getRouteShops(surveyor) {
    window.open(
      `${environment.hash}dashboard/upload_routes/${surveyor.surveyor_id}`,
      "_blank"
    );
  }
  downloadRouteSample() {
    const obj = {
      fileType: "xls",
    };
    const u = "download";
    this.httpService.downloadFile(obj, u);
  }

  onRadioButtonChange(event) { 
    console.log("event.value=" + event.value);
    console.log("radioOptions=" + this.radioOptions);
  }
  
  chosenYearHandler(normalizedYear: Moment, dp: any) {
    const ctrlValue = this.year.value;
    ctrlValue.year(normalizedYear.year());
    this.year.setValue(ctrlValue);
    dp.close();
    console.log("year", moment(this.year.value).format("YYYY"));
  }

  // chosenMonthHandler(normalizedMonth: Moment, dp: any) {
  //   const ctrlValue = this.year.value;
  //   ctrlValue.month(normalizedMonth.month());
  //   this.year.setValue(ctrlValue);
  //   // datepicker.close();
  // }

  clearLoading() {
    this.loading = false;
    this.loadingData = false;
    this.loadingReportMessage = false;
  }

}
