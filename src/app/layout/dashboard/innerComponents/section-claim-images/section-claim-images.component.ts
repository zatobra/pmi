import { KeyValuePipe } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ModalDirective } from "ngx-bootstrap/modal";
import { GlobalConfig, ToastrService } from "ngx-toastr";
import { Config } from "src/assets/config";
import { Location } from "@angular/common";

import { EvaluationService } from "../../evaluation/evaluation.service";
import moment from "moment";
import { DashboardService } from "../../dashboard.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
// import { EventEmitterService } from "../../event-emitter.service";
// import { RefreshComService } from "../../refresh-com.service";
import { ToastrCustomComponent } from "../../toastr-custom-component/toastr-custom-component";

@Component({
  selector: "section-claim-images",
  templateUrl: "./section-claim-images.component.html",
  styleUrls: ["./section-claim-images.component.scss"],
})
export class SectionClaimImagesComponent implements OnInit {
  
  // @Input("data") data;
  @Input("evaluatorId") taggedEvaluatorId;
  // @ViewChild('childModal') childModal: ModalDirective;
  @ViewChild("childModal") childModal: ModalDirective;
  @Output("showModal") showModal: any = new EventEmitter<any>();
  @ViewChild("remarksModal", { static: true }) remarksModal: ModalDirective;
  form: FormGroup;

  // @Input("isEditable") isEditable: any;
   isEditable: boolean = false;
  @Output("assetTypeId") assetTypeForEmit: any = new EventEmitter<any>();
  selectedShop: any = {};
  selectedImage: any = {};
  // ip=environment.ip;

  ip: any = Config.BASE_URI;
  hover = "hover";
  zoomOptions = {
    Mode: "hover",
  };
  zoomedImage =
    "https://image.shutterstock.com/image-photo/micro-peacock-feather-hd-imagebest-260nw-1127238569.jpg";
  formData: any;
  availability: any;
  changeColor: boolean;
  updatingMSL: boolean;
  selectedProduct: any = {};
  colorUpdateList: any = [];
  selectedSku: any;
  surveyId: any;
  evaluatorId: any;
  projectType: any;
  MSLCount = 0;
  loadingData: boolean;
  loading = false;
  MSLNAvailabilityCount: number;
  facing: any;
  totalDesiredFacing: any;

  statusArray: any = [
    { title: "Yes", value: "1" },
    { title: "No", value: "0" },
  ];
  params: any;
  id: any;
  labels: any;
  title: string ;
  selectedUpdate : any;
  loadingModal = false;
  loadingModalButton = false;
  user_id: string;
  selectedRemarks: any;
  data: any =[];
  claimId: any;
  dataObj: any;
  status: any;
  temporaryClaimAmount: any;
  checkVariable: boolean;
  isClaimEditable: boolean;
  options: GlobalConfig;
  constructor(
    private toastr: ToastrService,
    private keyValuePipe: KeyValuePipe,
    private activatedRoute: ActivatedRoute,
    private readonly location: Location,
    private httpService?: DashboardService,
    public formBuilder?: FormBuilder
  ) {

    // working
    // https://www.npmjs.com/package/ngx-toastr?activeTab=readme
    // https://ngx-toastr.vercel.app/
    // this.options = this.toastr.toastrConfig;
    // this.options.positionClass = 'toast-top-center';
    // this.options.closeButton = true;
    // this.toastr.show(
    //   "hello",
    //   "hi",
    //   this.options,
    //   this.options.iconClasses['success'],
    // );

    this.user_id = localStorage.getItem("user_id");
    this.projectType = localStorage.getItem("projectType");
    this.labels = JSON.parse(localStorage.getItem("labelProperties"));

    this.form = formBuilder.group({
      id: new FormControl(""),
      remarks: new FormControl("", [Validators.required]),
    });

  
    //    this.activatedRoute.queryParams.subscribe((p) => {
    //   console.log("active params", p);
    //   this.params = p;
    //   this.data = JSON.parse(this.params.obj);
    //   console.log("data in images: ", this.data);
    //   if (this.params.obj) {
    //     this.location.replaceState("/dashboard/samsung-claim-images/claimId="+this.data.id);
    //   }
    // });

    this.activatedRoute.params.subscribe((p) => {
      console.log("params", p);
      this.params = p;
      this.claimId = this.params.id;
      console.log("data in images: ", this.claimId);
      // if (this.params.obj) {
      //   this.location.replaceState("/dashboard/samsung-claim-images/claimId="+this.data.id);
      // }
    });

    this.getSamsungClaimData();

   

  }

  ngOnInit() {
 
      this.id = this.claimId;
      
      // this.selectedImage = this.data.imageList[0];
   
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes.data.currentValue) {
    //   this.data = changes.data.currentValue;
    //   // this.formData = this.keyValuePipe.transform(this.data.formData) || [];
    //   this.selectedImage = this.data.imageList[0];
    // }
  }

  unsorted() {}

  getSamsungClaimData() {
    debugger;
    
    this.loadingData = true;
    // this.filteredList = [];
    const obj = {
        regionId: -1,
        zoneId:  -1,
        claimId: this.claimId
      }
    this.httpService.getSamsungClaimData(obj).subscribe(
      (data) => {
        const res: any = data;
        console.log("claim data: ",data);
        if (res) {
          // this.claimData = data;
          // this.getList();
          this.data = data;
          // this.filteredList= this.data;
          this.setImageUrl();
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

  
  setImageUrl() {
    debugger;

    for(let data of this.data){
      for (const image of data.imageList) {
        if (image.url != null) {
          if (image.url.indexOf("http") >= 0) {
            const i = data.imageList.findIndex((e) => e.url == image.url && e.imageId == image.imageId);
            data.imageList[i].isExternalUrl = true;
          }
        }
      }
      this.title = this.data[0]?.claimTypeId == 1 ? 'OPD Claim' : 'Traveling Claim';
    }

    this.dataObj = this.data[0];

    if(this.dataObj.claimTypeId == 1){
      this.temporaryClaimAmount = this.dataObj.claimAmount;
    // this.dataObj.remainingAmount  = 23;
    this.isClaimEditable = this.dataObj.claimStatus == 'PENDING' ? true : false;
    if(parseFloat(this.dataObj.claimAmount) > parseFloat(this.dataObj.remainingAmount)
    && this.dataObj.claimStatus == 'PENDING' ? true : false){
      this.toastr.info("Claim Amount is greater than Remaining balance", "Plz Edit Claim Amount", { timeOut: 0 });
    }
    this.checkVariable = parseFloat(this.dataObj.claimAmount) > parseFloat(this.dataObj.remainingAmount) ? true : false;
    }
    


    this.selectedImage = this.data[0].imageList[0];

    console.log("this.data; ", this.data);
    // this.filteredList = this.data;
}

  setSelectedImage(img) {
    this.selectedImage = img;
  }

  showChildModal(shop): void {
    this.selectedShop = shop;
    this.showModal.emit(this.selectedShop);
    // this.childModal.show();
  }

  hideChildModal() {
    this.childModal.hide();
  }

//   refreshGridInAnotherComponent(){
//     this.dataService.notifyOther({refresh: true});
// }

compareAmount(temporaryClaimAmount?){
  console.log("temporaryClaimAmount", temporaryClaimAmount);
  console.log("this.temporaryClaimAmount", this.temporaryClaimAmount);
  console.log("this.dataObj.remainingAmount", this.dataObj.remainingAmount);
  if(parseFloat(this.temporaryClaimAmount) > parseFloat(this.dataObj.remainingAmount)){
    this.checkVariable = true;
    return true;
  }
  else{
    this.checkVariable = false;
    return false
  }
  // this.temporaryClaimAmount = temporaryClaimAmount;
}

updateBackgroundColor() {
  return this.temporaryClaimAmount > this.dataObj.remainingAmount ? 'red' : 'green';
}


  changeStatus(data){
    debugger;
    // let samsungClaimManagementComponent = new SamsungClaimManagementComponent();
    console.log("changestatus: ", data);
    
    let obj : any = {};
    obj.remarks = data.remarks;
    obj.year= this.dataObj.year;
    obj.surveyorId = this.dataObj.surveyorId;
    obj.claimTypeId= this.dataObj.claimTypeId;
    obj.id= data.id;
    obj.user_id= this.user_id;
    // obj.claimAmount = this.dataObj.claimAmount;
    obj.claimAmount =this.dataObj.claimTypeId == 1 ? this.temporaryClaimAmount : this.dataObj.claimAmount;
    obj.approved_datetime= moment().format('YYYY-MM-DD hh:mm:ss');
    obj.status = this.status;
  
    this.loadingModal = true;
    this.loadingModalButton = true;
    this.httpService.updateSamsungClaimData(obj).subscribe((data: any) => {
     debugger;
      if (data) {
        this.toastr.success(data);
       debugger;
        console.log("Status Change: ",data);
        this.getSamsungClaimData();
       
      } else {
        this.toastr.error("Not Approved","Error");
        console.log("Status not Change: ",data)
      }
    
      
      this.loadingModal = false;
    this.loadingModalButton = false;
    }
    
    );

    this.hideRemarksModal();
  }

  showRemarksModal(data, status){

    this.status = status;
    this.form.patchValue({
      id: data.id
    });

    this.remarksModal.show();
  }

  hideRemarksModal() {
    debugger;
    this.form.reset();
    console.log("this.form.value", this.form.value);
    this.status = '';
    this.remarksModal.hide();
  }
}
