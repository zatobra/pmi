import {
  AfterContentChecked,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  ChangeDetectorRef,
} from "@angular/core";
import { DashboardService } from "../../dashboard.service";
import { Config } from "src/assets/config";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-builds",
  templateUrl: "./app-builds.component.html",
  styleUrls: [".//app-builds.component.html"],
  encapsulation: ViewEncapsulation.None,
})
export class AppBuildsComponent implements OnInit {
  // ip2: any = Config.BASE_URI2;
  ip2: any = Config.BASE_URI;

  appBuildsList: any=[];
  loadingData: boolean;

  constructor(
    private toastr: ToastrService,
    private httpService: DashboardService,
  ) {}


  ngOnInit() {
    this.getAppBuilds();
  }

  getAppBuilds(){
    this.loadingData = true;
    this.appBuildsList = [];
    this.httpService.getAppBuilds().subscribe(
      (data) => {
        const res: any = data;
        console.log(res);
        if (res) {
          this.appBuildsList = res;
          this.loadingData = false;
        } else {
          this.loadingData = false;

          this.toastr.info(
            "Something went wrong,Please retry",
            "Connectivity Message"
          );
        }

        setTimeout(() => {
          this.loadingData = false;
        }, 500);
      },
      (error) => {
        this.loadingData = false;
      }
    );

  }

}
