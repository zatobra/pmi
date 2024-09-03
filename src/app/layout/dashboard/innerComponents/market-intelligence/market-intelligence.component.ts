import { Component, OnInit, ViewChild, Input } from '@angular/core';
import * as moment from 'moment';
import { DashboardService } from '../../dashboard.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Config } from 'src/assets/config';
import { MatPaginator } from '@angular/material/paginator';
import { Location } from '@angular/common';
import { KeyValuePipe } from "@angular/common";

@Component({
  selector: 'app-market-intelligence',
  templateUrl: './market-intelligence.component.html',
  styleUrls: ['./market-intelligence.component.scss']
})
export class MarketIntelligenceComponent implements OnInit {

  minDate = new Date(2000, 0, 1);
  maxDate = new Date();
  startDate = new Date();
  endDate = new Date();
  clusterList: any =[];
  zones: any = [];
  regions: any = [];
  selectedZone: any = {};
  selectedRegion: any = {};
  selectedCluster: any = {};
  labels: any;
  projectType: string;
  

  imagetitle= 'Image';

  ip = Config.BASE_URI;
  tableData: any = [];
  loading = false;
  title = 'Market Intelligence';
  userId: any;
  @ViewChild('childModal', { static: true }) childModal: ModalDirective;
  @ViewChild('childModalQuestion', { static: true }) childModalQuestion: ModalDirective;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  selectedItem: any = {};

  params: any = {};
  detailData: any;
  
  
  

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private httpService: DashboardService,
    private activeRoute: ActivatedRoute,
    private readonly location: Location,
    private keyValuePipe: KeyValuePipe
  ) {
    this.activeRoute.queryParams.subscribe((p) => {
      console.log('active params', p);
      this.params = p;
    });

    this.zones = JSON.parse(localStorage.getItem("zoneList"));
    this.clusterList = JSON.parse(localStorage.getItem("clusterList"));
    this.projectType = localStorage.getItem("projectType");
    this.labels = JSON.parse(localStorage.getItem("labelProperties"));
  }

  showChildModal(): void {
    this.childModal.show();
  }
  hideChildModal(): void {
    this.childModal.hide();
  }

  showChildModalQuestions(id): void {
    this.childModalQuestion.show();
    this.getDataDetail(id);
  }

  hideChildModalQuestions(): void {
    this.childModalQuestion.hide();
  }



  getDataDetail(id) {
    this.loading= true;
    // const obj={
    //   zoneId:this.params.zoneId || -1,
    //   regionId: this.params.regionId || -1,
    //   category:this.params.category || -1,
    //   brand : this.params.brand || -1,
    //   promotionType: this.params.promotionType || -1
    // };
    const obj = {
      surveyId: id
    };
      this.httpService.getMarketIntelligenceDetail(obj).subscribe(
        (data) => {
          // console.log(data);
          this.detailData = data || [];
          if (this.detailData.length == 0) {
            this.loading = false;
            this.toastr.info('No record found.');
          }
          else{
            this.setImageUrl2();
          }
          this.loading = false;
        },
        (error) => { }
      );
   
  }




  setSelectedItem(item) {
    this.selectedItem = item;
  }

  ngOnInit() {
    // this.getData();
  }

  getData() {
    this.loading = true;
    // const obj={
    //   zoneId:this.params.zoneId || -1,
    //   regionId: this.params.regionId || -1,
    //   category:this.params.category || -1,
    //   brand : this.params.brand || -1,
    //   promotionType: this.params.promotionType || -1
    // };
    const obj = {
      clusterId: this.selectedCluster.id
        ? this.selectedCluster.id == -1
          ? localStorage.getItem("clusterId")
          : this.selectedCluster.id
        : localStorage.getItem("clusterId"),
      zoneId: this.selectedZone.id
        ? this.selectedZone.id == -1
          ? localStorage.getItem("zoneId")
          : this.selectedZone.id
        : localStorage.getItem("zoneId"),
      regionId: this.selectedRegion.id
        ? this.selectedRegion.id == -1
          ? localStorage.getItem("regionId")
          : this.selectedRegion.id
        : localStorage.getItem("regionId"),
      startDate: moment(this.startDate).format("YYYY-MM-DD"),
      endDate: moment(this.endDate).format("YYYY-MM-DD"),
    };
      this.httpService.getMarketIntelligenceData(obj).subscribe(
        (data) => {
          // console.log(data);
          this.tableData = data || [];
          if (this.tableData.length === 0) {
            this.loading = false;
            this.toastr.info('No record found.');
          }
          else{
            this.setImageUrl();
          }
          this.loading = false;
        },
        (error) => { }
      );
   
  }

  
  gotoNewPage(item) {
    localStorage.setItem('imageList', JSON.stringify(item.imageList));
    localStorage.setItem('itemList', JSON.stringify(item.itemList));
    window.open(
      `${environment.hash}dashboard/image-view`,
      "_blank"
    );
  }

  setImageUrl(){
    this.tableData=this.keyValuePipe.transform(this.tableData);
    for (const image of this.tableData) {
      if (image?.shopImageUrl != null) {
        if (image?.shopImageUrl.indexOf("http") >= 0) {
          const i = this.tableData?.shopImageUrl.findIndex((e) => e.shopImageUrl == image.shopImageUrl);
          this.tableData[i].isExternalUrl = true;
        }
      }
    }
    
  }

  setImageUrl2(){
   
    for (const image of this.detailData) {
      if (image?.image_url != null) {
        if (image?.image_url.indexOf("http") >= 0) {
          const i = this.detailData?.image_url.findIndex((e) => e.image_url == image.image_url);
          this.tableData[i].isExternalUrl = true;
        }
      }
    }
    
  }


  getZoneByCluster() {
    this.loading = true;
    this.selectedZone = {};
    this.selectedRegion = {};
    this.httpService.getZoneByCluster(this.selectedCluster.id || -1).subscribe(
      (data) => {
        const res: any = data;
        if (res) {
          this.zones = res;
        }
        this.loading = false;
      },
      (error) => {
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
        this.loading = false;
      }
    );
  }

  zoneChange() {
    this.loading = true;
    this.selectedRegion = {};
    this.httpService.getRegion(this.selectedZone.id).subscribe(
      (data) => {
        const res: any = data;
        if (res) {
          this.regions = res;
        } else {
          this.loading = false;

          this.toastr.info(
            "Something went wrong,Please retry",
            "Connectivity Message"
          );
        }

        setTimeout(() => {
          this.loading = false;
        }, 500);
      },
      (error) => {
        this.loading = false;
      }
    );
  }


}
