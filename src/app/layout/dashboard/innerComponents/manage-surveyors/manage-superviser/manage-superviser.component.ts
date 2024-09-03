import { AfterContentChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "manage-superviser",
  templateUrl: "./manage-superviser.component.html",
  styleUrls: ["./manage-superviser.component.scss"],
  // encapsulation: ViewEncapsulation.None
})
export class ManageSuperviserComponent implements OnInit, AfterContentChecked, OnChanges {

  @Input("surveyorList") surveyorList;
  sortOrder = true;
  sortBy: "m_code";
  filteredList: any = [];

  @Output("updateSuperviser") updateSuperviser: any = new EventEmitter<any>();
  @Output("showModal") showModal: any = new EventEmitter<any>();

  @Output("addSuperviserModal") addSuperviserModal: any = new EventEmitter<any>();

  insertTitle= "Superviser";
  insertType= 2;

  constructor(private cdr: ChangeDetectorRef) { }
  ngOnChanges() {
    // changes.prop contains the old and the new value...
    this.filteredList = this.surveyorList;
  }

  ngAfterContentChecked(): void {
    // this.cdr.detectChanges();
    // this.filteredList = this.surveyorList;
  }

  ngOnInit() {
    // this.filteredList = this.surveyorList;
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
    this.updateSuperviser.emit(data);
  }

  showSuperviserInfoModal(surveyor) {
    this.showModal.emit(surveyor);
  }

  addSuperviser(){
    console.log("add merch");
    this.addSuperviserModal.emit({insertTitle: this.insertTitle, insertType: this.insertType});
  }
  onNotifyClicked(filteredlist: any){
    console.log(this.filteredList)
    this.filteredList=filteredlist;
  }
  
}
