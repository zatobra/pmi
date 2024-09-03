import { Component, OnChanges, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";
import { SidebarSharedService } from "../shared/services/sidebar-shared.service";

@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.scss"],
})
export class LayoutComponent implements OnInit, OnChanges {
  hideSideBar = false; // make default value to false after completing SMS manager;
  isTableauRequest = false;
  userType: any;
  projectType: string;
  samungPorject = false;
  pmirm: boolean;
  localhost: boolean=false;
  isLoggedin: boolean;

  constructor(public router: Router,private sidebarSharedService  : SidebarSharedService) {
    this.userType = localStorage.getItem("user_type");
    this.projectType = localStorage.getItem("projectType");
    if (this.projectType == "Samsung") {
      this.samungPorject = true;
    }
    console.log("projecttyoelayout: ", this.projectType);
debugger;
  //  this.sidebarSharedService.hideSidebar$.subscribe((data) => {
  //     console.log("this.hideSideBar : ", this.hideSideBar);
  //     this.hideSideBar = data ;
      
  //   });
    const hostName = window.location.hostname;
    this.pmirm = hostName?.indexOf("pmirm") >= 0;
    this.localhost = hostName?.indexOf("localhost") >= 0;
  }

  ngOnChanges(){
    console.log("this.hideSideBar : ", this.hideSideBar);
  }

  ngOnInit() {
    this.isLoggedin = localStorage.getItem("isLoggedin") ? true: false;
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        // tslint:disable-next-line:triple-equals
        if (
          e.url == "/dashboard/availability-dashboard" ||
          e.url == "/dashboard/rental-dashboard" ||
          e.url == "/dashboard/gt-dashboard" ||
          e.url == "/dashboard/mt-dashboard" ||
          e.url == "/dashboard/sss-gt-dashboard" ||
          e.url == "/dashboard/compliance-dashboard" ||
          e.url == "/dashboard/compliance-dashboard-national"
        ) {
          this.hideSideBar = true;
          this.isTableauRequest = true;
        }
      });
    // For Shop Detail Page, Tableau , Hide Side Bar
    let url: any = new Array();
    url = this.router.url.split(/[?/]/);
    const s: any = url.find((d) => d === "shop_detail");
    const u: any = url.find((d) => d === "shop_detail_sro");
    const r: any = url.find((d) => d === "details");
    const p: any = url.find((d) => d == "planogram-images");
    const i: any = url.find((d) => d == "instogram");
    const t: any = url.find((d) => d == "tableau");
    const c: any = url.find((d) => d === "samsung-claim-images");
    const tsmSummary: any = url.find((d) => d === "tsm-target-summary");
    const spinTheWheel: any = url.find((d) => d === "spinner-animation-draw");
    const route_tracker: any = url.find((d) => d === "route-tracker");
    debugger;
    if (p || s || r || i || t || c || spinTheWheel || tsmSummary || route_tracker ) {
      this.hideSideBar = true;
      if (t) {
        this.isTableauRequest = true;
      }
    }
  }

  hideBarStatus() {
    if (this.hideSideBar === true) {
      this.hideSideBar = false;
    } else {
      this.hideSideBar = true;
    }
  }
}
