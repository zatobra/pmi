import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Config } from "src/assets/config";

@Component({
  selector: "app-topnav",
  templateUrl: "./topnav.component.html",
  styleUrls: ["./topnav.component.scss"],
})
export class TopnavComponent implements OnInit {
  public pushRightClass: string;

  showButton = true;
  userName;
  main_logo = Config.main_logo;
  // Fauji_Merch
  @Output("hideSideBar") hideBar: any = new EventEmitter<any>();
  projectType: any;
  userType: any;
  luckyDrawAdminRole: string;
  emailProjectType: string;
  webPortalName: any;
  pmirm: boolean;
  constructor(public router: Router, private translate: TranslateService) {
    this.projectType = localStorage.getItem("projectType");
    this.emailProjectType = localStorage.getItem("emailProjectType") || this.projectType;

    this.webPortalName = localStorage.getItem("webPortalName") || this.projectType;

    this.luckyDrawAdminRole = localStorage.getItem("luckyDrawAdminRole") || 'N';
    console.log("projectype: ", this.projectType);
    this.router.events.subscribe((val) => {
      if (
        val instanceof NavigationEnd &&
        window.innerWidth <= 992 &&
        this.isToggled()
      ) {
        this.toggleSidebar();
      }
    });

    this.userName = localStorage.getItem("user_name");
  }

  ngOnInit() {
    const hostName = window.location.hostname;
    // this.url =
    // hostName.indexOf("samsung") >= 0 || this.ip.indexOf("samsung") >= 0 ? "samsung" : "noSamsung";

    // this.faujiMerchProjectUrl =
    //   hostName.indexOf("faujimerch") >= 0 || this.ip.indexOf("faujimerch") >= 0;

    
    this.pmirm = hostName?.indexOf("pmirm") >= 0 || hostName?.indexOf("localhost") >= 0;

    this.pushRightClass = "push-right";
    let url: any = new Array();
    url = this.router.url.split("/");
    const t: any = url.find((d) => d === "shop_detail");
    if (t) {
      this.showButton = false;
    }
  }

  isToggled(): boolean {
    const dom: Element = document.querySelector("body");
    return dom.classList.contains(this.pushRightClass);
  }

  toggleSidebar() {
    const dom: any = document.querySelector("body");
    dom.classList.toggle(this.pushRightClass);
  }

  onLoggedout() {
    localStorage.removeItem("isLoggedin");
    this.router.navigate(["/login"]);
  }

  changeLang(language: string) {
    this.translate.use(language);
  }
}
