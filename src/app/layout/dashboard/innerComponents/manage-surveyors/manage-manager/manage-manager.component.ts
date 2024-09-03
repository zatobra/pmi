import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "manage-manager",
  templateUrl: "./manage-manager.component.html",
  styleUrls: ["./manage-manager.component.scss"],
})
export class ManageManagerComponent implements OnInit {

  @Input("surveyorList") surveyorList;
  sortOrder = true;
  sortBy: "m_code";
  filteredList: any = [];

  @Output("updateManager") updateManager: any = new EventEmitter<any>();
  @Output("showModal") showModal: any = new EventEmitter<any>();

  @Output("addManagerModal") addManagerModal: any = new EventEmitter<any>();

  insertTitle= "Manager";
  insertType= 3;
  constructor() { }

  ngOnInit() {
    this.filteredList = this.surveyorList;
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
    this.updateManager.emit(data);
  }

  showManagerInfoModal(surveyor) {
    this.showModal.emit(surveyor);
  }

  addManager(){
    console.log("add manager");
    this.addManagerModal.emit({insertTitle: this.insertTitle, insertType: this.insertType});
  }
  onNotifyClicked(filteredlist: any){
    this.filteredList=filteredlist;
  }

}
