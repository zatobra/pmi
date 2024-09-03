import { Component, OnInit, ViewChild, ViewChildren } from "@angular/core";
import { environment } from "src/environments/environment";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { DashboardService } from "../../dashboard.service";
import { NgModel } from "@angular/forms";
import { ModalDirective } from "ngx-bootstrap/modal";
import * as moment from "moment";
import {  Moment } from 'moment';
import { Config } from "src/assets/config";
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    //for MOnth nd Year
    // dateInput: 'MM/YYYY',
    //for Day, MOnth nd Year
    // dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

declare const google: any;
@Component({
  selector: "samsung-retailer-data-report",
  templateUrl: "./samsung-retailer-data-report.component.html",
  styleUrls: ["./samsung-retailer-data-report.component.scss"],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class SamsungRetailerDataReportComponent implements OnInit {

  date2 = new Date();
  loadingData: boolean;
  loading = false;
  selectedRegionUp: any = new FormControl({}, [Validators.required]);
  regionId: any;
  zoneId: any;
  selectedZone: any = {};
  selectedRegion: any = {};
  regions: any = [];
  projectType: any;
  labels: any;
//   fileTypesList =[
//     {value: "RawSellout", title: "RawSellout"},
//     {value: "RetailShops", title: "RetailShops"},
// ];

monthList =[
  {value: "01", title: "January"},
  {value: "02", title: "February"},
  {value: "03", title: "March"},
  {value: "04", title: "April"},
  {value: "05", title: "May"},
  {value: "06", title: "June"},
  {value: "07", title: "July"},
  {value: "08", title: "August"},
  {value: "09", title: "September"},
  {value: "10", title: "October"},
  {value: "11", title: "November"},
  {value: "12", title: "December"},
];
  monthValue: any;
  date: string;
  year = new FormControl(moment());
  year2: any = moment();
  loadingReportMessage= false;
  constructor(
    private toastr: ToastrService,
    private httpService: DashboardService,
    public formBuilder: FormBuilder
  ) {
   
    this.projectType = localStorage.getItem("projectType");
    this.labels = JSON.parse(localStorage.getItem("labelProperties"));

    this.date = moment().format('YYYY-MM-DD hh:mm:ss');

    //for simple year drop down
    // this.selectedYear = new Date().getFullYear();
    // for (let year = this.selectedYear; year >= 2020; year--) {
    //   this.years.push(year);
    // }

  }
  ngOnInit() {
    this.getAllRegions();

  }

  getAllRegions() {
    this.loadingData = true;
    this.httpService.getRegions().subscribe(
      (data) => {
        const res: any = data;
        if (res.regionList) {
          this.regions = res.regionList;
          // localStorage.setItem('regionList', JSON.stringify(res.regionList));
        }
        if (!res.regionList) {
          this.toastr.info("No data Found", "Info");
        }
        this.clearLoading();
      },
      (error) => {
        this.clearLoading();
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
      }
    );
  }
  
  chosenYearHandler(normalizedYear: Moment, dp: any) {
    const ctrlValue = this.year.value;
    ctrlValue.year(normalizedYear.year());
    this.year.setValue(ctrlValue);
    dp.close();
    console.log("year", moment(this.year.value).format("YYYY"));
  }

  // chosenMonthHandler(normalizedMonth: Moment, dp: any) {
  //   const ctrlValue = this.year.value;
  //   ctrlValue.month(normalizedMonth.month());
  //   this.year.setValue(ctrlValue);
  //   // datepicker.close();
  // }


  getSamsungRetailerDataReport() {
    // if (this.endDate >= this.startDate) {
      this.loadingData = true;
      this.loadingReportMessage = true;
      const obj = {
        fullDate: moment(this.year.value).format("YYYY") + '-' + this.monthValue,
        // areaId: this.selectedArea.id || -1,
      };

      const url = "samsungRetailerDataReportController";
      const body = this.httpService.UrlEncodeMaker(obj);
      this.httpService.getKeyForProductivityReport(body, url).subscribe(
        (data) => {
          console.log(data, "query list");
          const res: any = data;

          if (res) {
            const obj2 = {
              key: res.key,
              fileType: res.fileType,
            };
            const url = "downloadReport";
            this.getproductivityDownload(obj2, url);
          } else {
            this.clearLoading();

            this.toastr.info(
              "Something went wrong,Please retry",
              "dashboard Data Availability Message"
            );
          }
        },
        (error) => {
          this.clearLoading();
        }
      );
    // } else {
    //   this.clearLoading();
    //   this.toastr.info(
    //     "Something went wrong,Please retry",
    //     "dashboard Data Availability Message"
    //   );
    // }
  }

  getproductivityDownload(obj, url) {
    const u = url;
    this.httpService.DownloadResource(obj, u);
    setTimeout(() => {
      this.loadingData = false;
      this.loadingReportMessage = false;
      this.httpService.updatedDownloadStatus(false);
    }, 1000);
  }

  clearLoading() {
    this.loading = false;
    this.loadingData = false;
    this.loadingReportMessage = false;
  }

}
