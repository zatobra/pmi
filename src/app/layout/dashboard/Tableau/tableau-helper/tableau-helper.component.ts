import {
  Component,
  OnInit,
  AfterViewChecked,
  Input,
  ViewChild,
} from "@angular/core";
import { DashboardService } from "../../dashboard.service";
import { Router, ActivatedRoute } from "@angular/router";
import { DashboardDataService } from "../../dashboard-data.service";
import { ToastrService } from "ngx-toastr";
import { Location } from "@angular/common";

declare var tableau: any;

@Component({
  selector: "tableau-helper",
  templateUrl: "./tableau-helper.component.html",
  styleUrls: ["./tableau-helper.component.scss"],
})
export class TableauHelperComponent implements OnInit {
  viz: any;
  ticketUrl: string;
  params: any = {};
  @Input() type;
  @Input() cluster;
  clusterId: any;
  
  projectType: string;
  zoneIds: string;
  zoneId: any;
  regionIds: string;
  regionId: any;
  clusterIds: string;
  constructor(
    private toastr: ToastrService,
    private httpService: DashboardService,
    public router: Router,
    private dataService: DashboardDataService,
    public activatedRoute: ActivatedRoute,
    private readonly location: Location
  ) {
    this.projectType = localStorage.getItem("projectType");
    this.clusterIds = localStorage.getItem("clusterId");
    this.zoneIds = localStorage.getItem("zoneId");
    this.zoneId = this.zoneIds.split(',',1)[0];
    this.regionIds = localStorage.getItem("regionId");
    this.regionId = this.regionIds.split(',',1)[0];
    console.log("zoneId: ", this.zoneId);
    console.log("regionId: ", this.regionId);
    // this.zoneId = this.zoneIds.substring(0,1);
    // this.clusterId = this.clusterIds.substring(0,1);
    this.activatedRoute.queryParams.subscribe((p) => {
      this.params = p;
      if (this.params.link) {
        this.location.replaceState("/dashboard/tableau");
        this.getKey();
      }
    });
  }

  ngOnInit(): void {
    if (!this.params.link) {
      this.getKey();
    }
  }
  getKey() {
    const obj = {
      type: this.type || "",
      userType: localStorage.getItem("user_type"),
    };
    this.httpService.getKey(obj).subscribe((data: any) => {
      if (this.params.link.indexOf("?") >= 0) {
        const hasZoneId = this.zoneId != -1;
        const hasRegionId = this.regionId != -1;

          let url  = `${data.TableauData.tableau_url}/${data.ticket}/${this.params.link}:iframeSizedToWindow=${data.TableauData.iframe}&:embed=${data.TableauData.embed}&:showAppBanner=${data.TableauData.showAppBanner}&:display_count=${data.TableauData.display_count}&:showVizHome=${data.TableauData.showVizHome}`;
          if (hasZoneId) {
            url += `&zoneId=${this.zoneId}`;
          }  
          if (hasRegionId) {
            url += `&regionId=${this.regionId}`;
          }
          this.ticketUrl = url;

            // if(this.projectType == "Samsung"){
              // this.ticketUrl = `${data.TableauData.tableau_url}/${data.ticket}/${this.params.link}&:iframeSizedToWindow=${data.TableauData.iframe}&:embed=${data.TableauData.embed}&:showAppBanner=${data.TableauData.showAppBanner}&:display_count=${data.TableauData.display_count}&:showVizHome=${data.TableauData.showVizHome}&zoneId=${this.zoneId}`;
       
              // }
              // else{
              // this.ticketUrl = `${data.TableauData.tableau_url}/${data.ticket}/${this.params.link}&:iframeSizedToWindow=${data.TableauData.iframe}&:embed=${data.TableauData.embed}&:showAppBanner=${data.TableauData.showAppBanner}&:display_count=${data.TableauData.display_count}&:showVizHome=${data.TableauData.showVizHome}`;
             
              // }
          

        
      } else {
        this.ticketUrl = `${data.TableauData.tableau_url}/${data.ticket}/${this.params.link}?:iframeSizedToWindow=${data.TableauData.iframe}&:embed=${data.TableauData.embed}&:showAppBanner=${data.TableauData.showAppBanner}&:display_count=${data.TableauData.display_count}&:showVizHome=${data.TableauData.showVizHome}`;
      }
      console.log("url:", this.ticketUrl);
      this.initViz();
    });
  }

  initViz() {
    const containerDiv = document.getElementById("vizContainer"),
      url = this.ticketUrl,
      options = {
        hideTabs: true,
        onFirstInteractive: function () {},
      };
    if (this.viz) {
      this.viz.dispose();
    }
    this.viz = new tableau.Viz(containerDiv, url, options);
  }
}
