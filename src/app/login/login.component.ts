import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DashboardService } from "../layout/dashboard/dashboard.service";
import { ToastrService } from "ngx-toastr";
import * as moment from "moment";
import { HttpErrorResponse } from "@angular/common/http";
import { Config } from "src/assets/config";
import { DecryptionServiceService } from "../decryption-service.service";
import { IdleService } from "../shared/services/idle-service.service";
import { Location } from "@angular/common";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  background_color = Config.login_theme_color;
  luckyDrawAdminRole = 'N';
  //login_logo = Config.login_logo;
  login_logo = Config.main_logo;
  main_logo_faujimerch = Config.main_logo_faujimerch;
  ip = Config.BASE_URI;
  faujiMerchProjectUrl: boolean = false;
  loginForm: any = {
    userName: "",
    password: "",
    angularRequest: "Y",
  };
  loading = false;
  url: string;
  samsungProject: boolean;
  pmicmbUrl: boolean;
  pmirm: boolean;
  samlLoginForm:any={
    userName: "",
    notOnOrAfter: "",
      angularRequest: "Y",
  }
  email:any;
  notOnOrAfter:any;
  hitTime:any;
  localhost: boolean;
  pmirmAdminLogin: boolean;

  constructor(
    private router: Router,
    private httpService: DashboardService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private decryptionService: DecryptionServiceService,
    private idleService: IdleService, private location: Location
  ) {}

  ngOnInit() {
  // console.log('ngOnInit called');
  this.pmirmAdminLogin = this.location.path().indexOf("/admin-login") > -1;


  //   this.idleService.startWatching();
    localStorage.clear();
    this.hideCookieBanner();

    const hostName = window.location.hostname;
    // const hostName = this.ip;
    this.faujiMerchProjectUrl = this.ip?.indexOf("faujimerch") >= 0;
    this.pmirm = hostName?.indexOf("pmirm") >= 0;
    this.localhost = hostName?.indexOf("localhost") >= 0;

    this.route.queryParams.subscribe(params => {
      console.log('Received query params:', params); 
      Object.keys(params).forEach(key => {
        const decryptedKey = this.decryptionService.decrypt(decodeURIComponent(key));
        const encryptedValue = params[key];
        const decryptedValue = this.decryptionService.decrypt(decodeURIComponent(encryptedValue));
        switch (decryptedKey) {
          case 'email': 
            this.email = decryptedValue;
            break;
          case 'notOnOrAfter': 
            this.notOnOrAfter = decryptedValue;
            break;
          case 'currentTime': 
            this.hitTime = decryptedValue;
            break;
          default:
            break;
        }
      });

      if (this.notOnOrAfter) {
        const hitTime = new Date(this.hitTime).getTime();
        const currentTime = new Date().getTime();
        const timeDifference = currentTime - hitTime;

        if (timeDifference <= 20000 && timeDifference >= 0) { // 20000 milliseconds = 20 seconds
          this.samlLoginForm = {
            userName: this.email,
            notOnOrAfter: this.notOnOrAfter,
            angularRequest: "Y",
          };
          this.onLogin(this.samlLoginForm);
        } else {
          console.log("Token Expired");
        }
      }
    });
  }

  private hideCookieBanner(): void {
    const cookieBanner = document.querySelector('.ot-sdk-container') as HTMLElement;
    if (cookieBanner) {
      cookieBanner.style.display = 'none';
    }
  }
 
  samlLogin() {
    this.httpService.samlLogin().subscribe(
        (data: string) => {
       
            // console.log("Received redirect URL: " + data);
            if (data && data.trim() !== '') {
              const redirectUrl = data.replace('redirect:', '');
              window.location.replace(data);

              // + '?_format=' + encodeURIComponent('text/plain')
              // Redirect if data is valid
            } else {
                console.error("Invalid redirect URL: ", data);
                // Handle the error condition, e.g., display an error message to the user
            }
        },
        (error) => {
            console.error("SAML Login error: ", error);
            console.error("Status: ", error.status);
            console.error("Status Text: ", error.statusText);
            console.error("Message: ", error.message);
            // Handle the error condition, e.g., display an error message to the user
        }
    );
}

  onLogin(loginForm: any) {
    this.loading = true;
    // console.log(loginForm);

    this.httpService.login(loginForm).subscribe(
      (data: Response) => {
       
        const res: any = data;
        if(res.mapBoxToken){
          Config.MAPBOX_TOKEN = res.mapBoxToken;
          localStorage.setItem("mapBoxToken", res.mapBoxToken);
        }
        
        console.log("Config.MAPBOX_TOKEN: ", Config.MAPBOX_TOKEN);
        console.log("res.mapBoxToken: ", res.mapBoxToken);
        
        localStorage.setItem("isLoggedin", "true");
        localStorage.setItem("today", moment(new Date()).format("YYYY-MM-DD"));
        localStorage.setItem("user_id", res.user.user_id);
        localStorage.setItem("user_type", res.user.typeID);
        localStorage.setItem("user_name", res.user.userName);
        localStorage.setItem("regionId", res.user.regionIds);
        localStorage.setItem("zoneId", res.user.zoneIds);
        localStorage.setItem("clusterId", res.user.clusterIds);
        localStorage.setItem("areaId", res.user.areaIds);
        localStorage.setItem("channelId", res.user.cityIds);
        localStorage.setItem("u_surveyor_id", res.user.surveyorId);
        console.log("channelId", res.user.cityIds);

        localStorage.setItem(
          "clusterName",
          res.user.cluster == null ? null : res.user.cluster.title
        );

        localStorage.setItem("menu", JSON.stringify(res.list));
        localStorage.setItem("menuNew", JSON.stringify(res.listNew));
        localStorage.setItem("Reevaluator", res.ReEvaluator);
        localStorage.setItem("Evaluator", res.Evaluator);
        localStorage.setItem("Zsm", res.Zsm);
        localStorage.setItem("projectType", res.projectType);
        localStorage.setItem("emailProjectType", res.emailProjectType);

        localStorage.setItem("webPortalName", res.webPortalName);

        localStorage.setItem(
          "accessProperties",
          JSON.stringify(res.accessProperties)
        );
        localStorage.setItem(
          "labelProperties",
          JSON.stringify(res.labelProperties)
        );
        localStorage.setItem(
          "shopPageProperties",
          JSON.stringify(res.shopPageProperties)
        );

        if (
          res.projectType == "Haleeb" ||
          res.projectType == "Nivea" ||
          res.user.typeID == res.Evaluator ||
          res.user.typeID == res.Zsm ||
          (res.projectType == "DALDA" && res.user.typeID == 9) ||
          (res.projectType == "Tapal" &&
            (res.user.typeID == 6 ||
              res.user.typeID == 7 ||
              res.user.typeID == 9
              || res.user.typeID == 10))
        ) {
          this.router.navigate(["/dashboard"]);
        } else if (res.projectType == "Tapal" || res.projectType == "NFL_SRO") {
          this.router.navigate(["/dashboard/supervisor_productivity"]);
          // this.router.navigate(["/"+res.list[0].menuList[0].link]);
        } 
        

        // for lucky draw culinary project | 'lucky draw admin' role
        else if (res.user.typeID == 52 && res.projectType == "NFL_CULINARY") {
          this.luckyDrawAdminRole = 'Y';
          localStorage.setItem("luckyDrawAdminRole", this.luckyDrawAdminRole);
          this.router.navigate(["/dashboard/spinner-fileupload"]);
        }


        else {
          this.router.navigate(["/dashboard/productivity_report"]);
        }

        setTimeout(() => {
          this.loading = false;
        }, 30000);
      },
      (error: any) => {
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
        this.loading = false;
      }
    );
  }

  agreeToTerms = false;
  onCheckboxChange(event: any): void {
    console.log("event: ",event);
    console.log("event.checked: ",event?.checked);
    this.agreeToTerms = event.checked;
    // if (this.agreeToTerms) {
    //     window.open('https://www.pmiprivacy.com/global/en/consumer/', '_blank');
    // }
}

onCheckboxChangeNew(){
  // window.open('https://www.pmiprivacy.com/global/en/consumer/', '_blank');
  // window.open('https://pmirm.rtdtradetracker.com/images/PMI%20Employee%20Privacy%20Statement.pdf', '_blank');
  window.open('https://pmirm.rtdtradetracker.com/images/PMI-Employee-Privacy-Statement.html', '_blank');
}

}
