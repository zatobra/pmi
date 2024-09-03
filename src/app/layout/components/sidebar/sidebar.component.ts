import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { SidebarSharedService } from "src/app/shared/services/sidebar-shared.service";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  @Input("hideSideBar") hideSideBar;
  public showMenu: string;
  menuList: any = [];
  value: any = 1;
  constructor(public router: Router,private location: Location) {

  }
  toggleValue = true;
  toggleValueDashboard = true;

  ngOnInit() {
    debugger;
    this.showMenu = "";
    this.menuList = JSON.parse(localStorage.getItem("menu"));

    if ( this.location.path().indexOf("/spinner-animation-draw") > -1 ){
    // this.hideSideBar= true;


    }
  }

  getIndex(i) {
    this.value = i;
  }

  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = "0";
    } else {
      this.showMenu = element;
    }
  }
}
