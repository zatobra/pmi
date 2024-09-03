import { Component, OnInit, Input, Output } from "@angular/core";
import { DashboardService } from "../../dashboard.service";
import * as moment from "moment";
import { environment } from "src/environments/environment";
import { ToastrService } from "ngx-toastr";
import { NgxPaginationModule } from "ngx-pagination";
import { DataService } from "./data.service";
@Component({
  selector: "lucky-draw-spinner-component",
  templateUrl: "./lucky-draw-spinner-component.html",
  styleUrls: ["./lucky-draw-spinner-component.scss"],
})
export class LuckyDrawSpinnerComponent implements OnInit {
  title = "";
  projectType: string;
  labels: any;
  userTypeId: string;
  loadingData: boolean;
  userId: string;
  sortBy: any;
  sortOrder: any;
  filteredList: any;
  loading: boolean;
  
  constructor(
    private httpService: DashboardService,
    private toastr: ToastrService,
    dataService: DataService
  ) {
    this.projectType = localStorage.getItem("projectType");
   
    this.labels = JSON.parse(localStorage.getItem("labelProperties"));
   
    this.userTypeId = localStorage.getItem("user_type");
   
  }

  ngOnInit() {
    this.loadingData = false;
    this.userId = localStorage.getItem("user_id");
  }

 

 
}
