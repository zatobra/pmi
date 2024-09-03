import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild, ViewChildren, ViewEncapsulation } from "@angular/core";
import { ManageSurveyorsComponent } from "../manage-surveyors.component";
import { DashboardService } from "../../../dashboard.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "manage-merchandiser",
  templateUrl: "./manage-merchandiser.component.html",
  styleUrls: ["./manage-merchandiser.component.scss"],
})
export class ManageMerchandiserComponent implements OnInit, AfterContentChecked, OnChanges  {

  @Input("surveyorList") surveyorList;
  @ViewChildren("checked") private myCheckbox: any;
  
  sortOrder = true;
  sortBy: "m_code";

  @Output("updateMerchandiser") updateMerchandiser: any = new EventEmitter<any>();
  @Output("showModal") showModal: any = new EventEmitter<any>();
  @Output("addMerchandiserModal") addMerchandiserModal: any = new EventEmitter<any>();

  insertTitle= "Merchandiser";
  insertType= 1;
  filteredList: any = [];
  labels: any;
  loadingData: boolean ;
  selectedSurveyors: any = [];
  selectedForceLogin: any;

  // pageOfItems: Array<any>;
  

  constructor(
    private httpService: DashboardService,
    private toastr: ToastrService,
    // public formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.labels = JSON.parse(localStorage.getItem("labelProperties"));
    }
    
  //   onChangePage(pageOfItems: Array<any>) {
  //     // update current page of items
  //     this.pageOfItems = pageOfItems;
  // }
  ngOnChanges() {
    // changes.prop contains the old and the new value...
    this.filteredList = this.surveyorList;
  }

  ngOnInit() { 
    // console.log("surList in manage merch: ", this.surveyorList);
    // this.filteredList = this.surveyorList;
    
  }

  ngAfterContentChecked(): void {
    // this.cdr.detectChanges();
  }

  page = 1;

   handlePageChange(event) {
      this.page = event;
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

  updateSuperviserData(data) {
    this.updateMerchandiser.emit(data);
  }

  showMerchandiserInfoModal(surveyor) {
    this.showModal.emit(surveyor);
      }

  addMerchandiser(){
    console.log("add merch");
    this.addMerchandiserModal.emit({insertTitle: this.insertTitle, insertType: this.insertType});
    
  }
  onNotifyClicked(filteredlist: any){
    console.log(this.filteredList)
    this.filteredList=filteredlist;
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
      for (let i = 0; i < this.filteredList.length; i++) {
        if (this.selectedSurveyors.indexOf(this.filteredList[i].id) == -1) {
          this.selectedSurveyors.push(this.filteredList[i].id);
          console.log(this.selectedSurveyors);
        }
      }
      for (let index = 0; index < this.myCheckbox._results.length; index++) {
        this.myCheckbox._results[index]._checked = true;
      }
    } else {
      for (let i = 0; i < this.filteredList.length; i++) {
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

  enableForceRelogIn() {
    this.loadingData=true
      const obj={
        forceRelogIn :"Y",
        surveyorsId :this.selectedSurveyors
      }
      this.httpService.enableForceRelogIn(obj).subscribe((data:string)=>{
        if (data) {
          if(data.includes("not")){
            this.toastr.error(data,"Update status")
           }
           else{
            this.toastr.success(data,"Update status")
          }
        }
        this.loadingData=false 
       })
      }
  
      forceReLoginRadio(forceLoginRadio, item){
        if (forceLoginRadio.checked === true) {
             const obj={
              forceRelogIn :"Y",
              surveyorsId :item.id
            }
            this.httpService.enableForceRelogIn(obj).subscribe((data:string)=>{
              if (data) {
                if(data.includes("not")){
                  this.toastr.error(data,"Update status")
                 }
                 else{
                  this.toastr.success(data,"Update status")
                }
              }
             })
        } else {
              const obj={
                  forceRelogIn :"N",
                  surveyorsId :item.id
              }
              this.httpService.enableForceRelogIn(obj).subscribe((data:string)=>{
                if (data) {
                  if(data.includes("not")){
                    this.toastr.error(data,"Update status")
                   }
                   else{
                    this.toastr.success(data,"Update status")
                  }
                }
               })
        }
        
      }
}


