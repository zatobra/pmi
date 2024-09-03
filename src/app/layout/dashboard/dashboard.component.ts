import {
  Component,
  OnInit,
  AfterViewChecked,
  AfterViewInit,
  ViewChild,
} from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { DashboardService } from "./dashboard.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import * as moment from "moment";
import { ModalDirective } from "ngx-bootstrap/modal";
import { Config } from "src/assets/config";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  main_logo = Config.main_logo;
  projectType: any;

  @ViewChild("childModal", { static: true }) childModal: ModalDirective;

  constructor(
    private httpService: DashboardService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.projectType = localStorage.getItem("projectType");
  }

  ngOnInit() {
    var t = moment(new Date()).format("YYYY-MM-DD");
    var st = localStorage.getItem("today");
    if (t > st) this.router.navigate(["/login"]);
    // tslint:disable-next-line:radix
    if (this.projectType == "NFL" || this.projectType == "TMR" || this.projectType == "NFL_CULINARY" || this.projectType == "NFL_CONDIMENTS" || this.projectType == "Samsung") {
      this.getSelectiveClusters();
    } else {
      this.getZone();
    }
    this.httpService.data.subscribe((data) => {
      // console.log("download status subscribe",data)
      if (data) this.showChildModal();
      else this.hideChildModal();
      //do what ever needs doing when data changes
    });
  }

  getZone() {
    this.httpService.getZone().subscribe(
      (data) => {
        const res: any = data;
        if (res.zoneList) {
          localStorage.setItem("zoneList", JSON.stringify(res.zoneList));
          localStorage.setItem("assetList", JSON.stringify(res.assetList));
          localStorage.setItem("channelList", JSON.stringify(res.channelList));
        }
      },
      (error) => {
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
      }
    );
  }

  showChildModal(): void {
    this.childModal.show();
  }

  hideChildModal(): void {
    this.childModal.hide();
  }

  getSelectiveClusters() {
    this.httpService.getAllClusters().subscribe(
      (data) => {
        const res: any = data;
        if (res.clusterList) {
          localStorage.setItem("clusterList", JSON.stringify(res.clusterList));
          localStorage.setItem("channelList", JSON.stringify(res.channelList));
        }
      },
      (error) => {
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
      }
    );
  }
}
