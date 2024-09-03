import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import * as moment from "moment";
import { ModalDirective } from "ngx-bootstrap/modal";
import { NgxDrpOptions, PresetItem, Range } from "ngx-mat-daterange-picker";
import { Config } from "src/assets/config";
import { environment } from "src/environments/environment";

import { InstotrackerService } from "../instotracker-service.service";

import jsPDF from 'jspdf';

//dom-to-image
import domtoimage from "dom-to-image";
import jspdf from "jspdf";
import { SidebarSharedService } from "src/app/shared/services/sidebar-shared.service";

@Component({
  selector: "app-body",
  templateUrl: "./body.component.html",
  styleUrls: ["./body.component.css"],
})
export class BodyComponent implements OnInit {
  //#region variables
  @ViewChild("dateRangePicker", { static: true }) dateRangePicker;
  @ViewChild("productDetailModal", { static: true })
  productDetailModal: ModalDirective;

  range: Range = { fromDate: new Date(), toDate: new Date() };
  options: NgxDrpOptions;
  presets: Array<PresetItem> = [];
  images: any = [];
  allData: any = [];
  searchFilter = "";
  allDataClone: any[];

  p: number = 1;
  d: number = 1;
  filterModel: any = {};
  ip = Config.BASE_URI;
  rangeDates: any;
  // range: any;
  filterProducts: any;
  singleShopSelected: boolean = false;
  selelctedShop: any = {};
  currentRange: any;
  loading = true;
  successTrigger = false;
  errorTrigger = false;
  myMessage: any;
  zones: any = [];
  selectedZone: any = {};
  loadingData: boolean;
  regions: any = [];
  selectedRegion: any = {};
  cities: any = [];
  selectedCity: any = {};
  categories: any = [];
  selectedCategory = [];
  chanels: any = [];
  selectedChanel: any = {};
  wrongRange: boolean = false;
  filterData: any[] = [];
  selectedProduct: any = {};
  allDataSelectedShop: any = [];
  imageLoading = false;
  channelName: string = "";
  filterDataClone: any[] = [];
  user: any;
  errorMessage: string;
  userId: any;
  imageTypeList: any = [];
  assetNamesList: any = [];
  imageTypeName: string;
  clusterId: string | number;
  zoneId: string | number;
  regionId: string | number;
  selectedAssetName: any;

  //#endregion

  columns: string[] = [];
  columnFilters: { [key: string]: string } = {}; 

 
  downloadingPdf: boolean;
  @ViewChild('content') content: ElementRef;
  projectType: string;

  constructor(private generalService: InstotrackerService,
    private cdr: ChangeDetectorRef,private sidebarSharedService : SidebarSharedService) {
    this.clusterId = localStorage.getItem("clusterId") || -1;
    this.zoneId = localStorage.getItem("clusterId") || -1;
    this.regionId = localStorage.getItem("clusterId") || -1;
  }

  ngOnInit() {
    debugger;
    this.sidebarSharedService.setHideSidebar(true);
    this.user = localStorage.getItem("user_id");
    this.projectType = localStorage.getItem("projectType");
    this.getZoneList();
    var d = new Date();
    var s = moment(d).subtract(1, "day").format("YYYY-MM-DD");
    var e = moment(d).subtract(1, "day").format("YYYY-MM-DD");
    this.currentRange = JSON.stringify({
      startDate: s,
      endDate: e,
      userId: this.user,
      // clusterId: this.selectedCluster.id
      // ? this.selectedCluster.id == -1
      //   ? localStorage.getItem("clusterId")
      //   : this.selectedCluster.id
      // : localStorage.getItem("clusterId"),
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
    });
    console.log("contructor date range", this.currentRange);
    console.log("ngOnInit: ");
    // this.getData(this.currentRange);
    this.currentRange = JSON.parse(this.currentRange);

    var e = moment(d).subtract(1, "day").format("YYYY-MM-DD");
    const today = new Date();
    today.setDate(today.getDate() - 1);

    this.setupPresets();
    this.options = {
      presets: this.presets,
      format: "mediumDate",
      range: { fromDate: today, toDate: today },
      applyLabel: "Submit",
      calendarOverlayConfig: {
        shouldCloseOnBackdropClick: false,
        // hasBackDrop: false
      },
      // cancelLabel: "Cancel",
      // excludeWeekends:true,
      // fromMinMax: {fromDate:fromMin, toDate:fromMax},
      // toMinMax: {fromDate:toMin, toDate:toMax}
    };
  }

  //#region date range
  updateRange(range: Range) {
    console.log("updateRange: ");
    this.loading = true;
    this.range = range;
    console.log("update range", this.range);
    var s = moment(this.range.fromDate).format("YYYY-MM-DD");
    var e = moment(this.range.toDate).format("YYYY-MM-DD");
    var maxDate = moment(this.range.fromDate)
      .add(6, "days")
      .format("YYYY-MM-DD");
    console.log("max Date", maxDate);

    this.currentRange = JSON.stringify({
      startDate: s,
      endDate: e,
      userId: this.user,
      // clusterId: this.selectedCluster.id
      // ? this.selectedCluster.id == -1
      //   ? localStorage.getItem("clusterId")
      //   : this.selectedCluster.id
      // : localStorage.getItem("clusterId"),
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
    });
    if (s <= e && e <= maxDate) {
      this.getData(this.currentRange);
    } else {
      this.errorMessage = "Start-date can not be greater than end-date";

      if (e > maxDate) this.errorMessage = "Only 7 days range is allowed";

      this.wrongRange = true;

      setTimeout(() => {
        this.wrongRange = false;
      }, 4000);
    }
    this.currentRange = JSON.parse(this.currentRange);
  }

  setupPresets() {
    // this.presets = [
    //   { presetLabel: "Yesterday", range: { fromDate: yesterday, toDate: today } },
    //   { presetLabel: "Last 7 Days", range: { fromDate: minus7, toDate: today } },
    //   { presetLabel: "Last 30 Days", range: { fromDate: minus30, toDate: today } },
    //   { presetLabel: "This Month", range: { fromDate: currMonthStart, toDate: currMonthEnd } },
    //   { presetLabel: "Last Month", range: { fromDate: lastMonthStart, toDate: lastMonthEnd } }
    // ]
  }
  // #endregion

  getShop(shop) {
    // console.log(shop);
    // this.allData = [];
    // this.allData = this.allDataClone;
    // this.singleShopSelected = true;
    this.selelctedShop = shop;
    localStorage.setItem("selelctedShop", JSON.stringify(this.selelctedShop));

    let filterData: any = [];
    filterData = this.allData.filter((d) => d.shopId === shop.shopId);
    console.log("shopes", filterData);
    if (filterData.length > 0) {
      this.allDataSelectedShop = filterData;
      localStorage.setItem(
        "allDataSelectedShop",
        JSON.stringify(this.allDataSelectedShop)
      );
    }

    // window.scroll(0,0);

    window.open(
      environment.hash + "dashboard/instogram/shop/" + shop.shopId,
      "_blank"
    );
  }

  getAllDataClassification(channelName: string) {
    console.log(channelName);

    // console.log('filter data',this.filterData);
    // this.allData = this.allDataClone;
    this.channelName = channelName;
    this.allData = [];

    if (this.filterData.length == 0) {
      let d = this.allDataClone.filter((d) => d.channelName === channelName);
      this.allData = d;
    } else if (this.filterData.length > 0) {
      let d = this.filterData.filter((d) => d.channelName === channelName);
      this.allData = d;
    }

    console.log("all data", this.allData);
  }

  getAllDataClassification2(imageTypeName: string) {
    console.log(imageTypeName);

    // console.log('filter data',this.filterData);
    // this.allData = this.allDataClone;
    this.imageTypeName = imageTypeName;
    this.allData = [];

    if (this.filterData.length == 0) {
      let d = this.allDataClone.filter((d) => d.imageType === imageTypeName);
      this.allData = d;
    } else if (this.filterData.length > 0) {
      let d = this.filterData.filter((d) => d.imageType === imageTypeName);
      this.allData = d;
    }

    console.log("all data", this.allData);
  }

  categoryChange() {
    console.log(this.selectedCategory);
    this.allData = [];
    this.allData = this.allDataClone;
    let filterData: any = [];

    this.selectedCategory.forEach((e) => {
      var ft = this.allData.filter(
        (d) => d.assetName === e.title && d.imageType === "Primary"
      );
      filterData.push(ft);
    });
    if (filterData[2]) {
      this.allData = filterData[0].concat(filterData[1]).concat(filterData[2]);
      console.log("triple filter list", this.allData);
    } else if (filterData[1]) {
      this.allData = filterData[0].concat(filterData[1]);
      console.log("double filter list", this.allData);
    } else if (filterData[0]) {
      this.allData = filterData[0];
      console.log("single filter list", this.allData);
    }
  }

  zoneChange() {
    console.log("zonechange this.selectedZone ",this.selectedZone);
    console.log("zonechange this.selectedregion ",this.selectedRegion);
    console.log("zonechange this.selectedAssetNames ",this.selectedAssetName);
    // debugger
    this.regions = [];
    this.cities = [];
    this.chanels = [];
    // this.loadingData = true;
    this.allData = this.allDataClone;
    let zoneId = this.selectedZone.id
      ? this.selectedZone.id == -1
        ? localStorage.getItem("zoneId")
        : this.selectedZone.id
      : localStorage.getItem("zoneId");
      console.log("zoneId: ", zoneId);
    this.filterData = [];
    this.generalService.getRegion(zoneId).subscribe((data) => {
      this.regions = data;
      // this.filterAllData();
    });
    if (this.channelName)
      // this.filterData = this.allData.filter(
      //   (d) =>
      //     d.zone == this.selectedZone.title && d.channelName == this.channelName
      // );
      this.filterData = this.allData.filter((d) =>
      this.filterZone(d) && d.channelName == this.channelName && this.filterAssetName(d)
    );
    else {
      this.filterData = this.allData.filter(
        (d) => this.filterZone(d) && this.filterAssetName(d)
      );
      this.filterDataClone = this.filterData;
    }

    this.allData = this.filterData;
    this.loadingData = false;
    console.log("zonechnage this.allData ", this.allData );
    this.getUniqueChanelList(this.allData);
    this.getUniqueImageTypeList(this.allData);
  }

  getCategoryName(product) {
    return product.assetName; //product.assetItemList[0].value;
  }

  regionChange() {
    console.log("regionchange this.selectedZone ",this.selectedZone);
    console.log("regionchange this.selectedregion ",this.selectedRegion);
    console.log("regionchange this.selectedAssetNames ",this.selectedAssetName);
    this.loadingData = true;

    this.allData = this.allDataClone;

    let regionId= this.selectedRegion.id
    ? this.selectedRegion.id == -1
      ? localStorage.getItem("regionId")
      : this.selectedRegion.id
    : localStorage.getItem("regionId");
    console.log("regionId: ", regionId);

    this.filterData = [];
    // console.log('regions id', this.selectedRegion);
    this.generalService.getCities(regionId).subscribe((data) => {
      this.cities = data[0] || [];
      // console.log('cities list', data);
      // this.chanels = data[1];
      // this.filterAllData();
    });

    if (this.channelName)
      // this.filterData = this.allData.filter(
      //   (d) =>
      //     d.zone == this.selectedZone.title &&
      //     d.region == this.selectedRegion.title &&
      //     d.channelName == this.channelName
      // );
      this.filterData = this.allData.filter((d) =>
      this.filterZone(d) && this.filterRegion(d) && this.filterAssetName(d) && d.channelName == this.channelName
    );
    else {
      // this.filterData = this.allData.filter(
      //   (d) =>
      //     d.zone == this.selectedZone.title &&
      //     d.region == this.selectedRegion.title
      // );
      this.filterData = this.allData.filter((d) =>
      this.filterZone(d) && this.filterRegion(d) && this.filterAssetName(d)
    );
      this.filterDataClone = this.filterData;
    }

    this.allData = this.filterData;
    console.log("regionchnage this.allData ", this.allData );

    this.loadingData = false;
    this.getUniqueChanelList(this.allData);
    this.getUniqueImageTypeList(this.allData);
  }

  cityChange() {
    this.loadingData = true;
    // console.log("seelcted city", this.selectedCity);
    this.allData = this.allDataClone;
    this.filterData = [];

    if (this.channelName)
      this.filterData = this.allData.filter(
        (d) =>
          d.zone == this.selectedZone.title &&
          d.region === this.selectedRegion.title &&
          d.city == this.selectedCity.title &&
          d.channelName == this.channelName
      );
    else {
      this.filterData = this.allData.filter(
        (d) =>
          d.zone == this.selectedZone.title &&
          d.region === this.selectedRegion.title &&
          d.city == this.selectedCity.title
      );
      this.filterDataClone = this.filterData;
    }

    this.allData = this.filterData;
    this.loadingData = false;
    this.getUniqueChanelList(this.allData);
    this.getUniqueImageTypeList(this.allData);
  }

  assetNamesChange() {
    console.log("assetNamesChange this.selectedZone ",this.selectedZone);
    console.log("assetNamesChange this.selectedregion ",this.selectedRegion);
    console.log("assetNamesChange this.selectedAssetNames ",this.selectedAssetName);
    this.loadingData = true;
    // console.log("seelcted city", this.selectedCity);
    this.allData = this.allDataClone;
    this.filterData = [];
    console.log("this.selectedAssetName:",this.selectedAssetName)

    if (this.selectedAssetName){
      this.filterData = this.allData.filter((d) =>
      this.filterZone(d) && this.filterRegion(d) && this.filterAssetName(d)
    );
    }
      // this.filterData = this.allData.filter(
      //   (d) =>
      //     d.zone == this.selectedZone.title &&
      //     d.region === this.selectedRegion.title
      //     &&
      //      d.assetName == this.selectedAssetName
          
      // );
  
    else {
      this.filterData = this.allData.filter((d) =>
      this.filterZone(d) && this.filterRegion(d)
    );
      this.filterDataClone = this.filterData;
    }


    

    this.allData = this.filterData;
    console.log("assetnameschnage this.allData ", this.allData );
    this.loadingData = false;
    this.getUniqueChanelList(this.allData);
    this.getUniqueImageTypeList(this.allData);
  }

  filterZone(data): boolean {
    return !this.selectedZone.title ||  data.zone === this.selectedZone.title;
  }
  
  filterRegion(data): boolean {
    return !this.selectedRegion.title  ||  data.region === this.selectedRegion.title;
  }
  
  filterAssetName(data): boolean {
    return !this.selectedAssetName || data.assetName === this.selectedAssetName;
  }

  chanelChange() {
    // console.log("seelcted chanel", this.selectedChanel);
    // this.generalService.getCategories(this.selectedChanel,this.uId).subscribe(data => {
    //   this.categories = data;
    //   // this.filterAllData();

    // }, error => { });
    this.allData = this.allDataClone;
    this.filterData = [];
    // console.log(this.allData[0])

    if (this.channelName)
      this.filterData = this.allData.filter(
        (d) =>
          d.zone == this.selectedZone.title &&
          d.region === this.selectedRegion.title &&
          d.areaPmpkl == this.selectedChanel.areaPmpkl &&
          d.channelName == this.channelName
      );
    else {
      this.filterData = this.allData.filter(
        (d) =>
          d.zone == this.selectedZone.title &&
          d.region === this.selectedRegion.title &&
          d.areaPmpkl == this.selectedChanel.areaPmpkl
      );
      this.filterDataClone = this.filterData;
    }
    this.allData = this.filterData;
    this.getUniqueChanelList(this.allData);
    this.getUniqueImageTypeList(this.allData);
  }

  getall() {
    this.singleShopSelected = false;

    if (this.filterData.length > 0) this.allData = this.filterData;
    else this.allData = this.allDataClone;
  }

  getZoneList() {
    this.generalService.getZone().subscribe((data: any) => {
      console.log("zone list", data);
      this.zones = data.zoneList;
    });
  }

  getData(range) {
    console.log("getData: ",range);
    this.loadingData = true;
    this.selectedCity = {};
    this.selectedRegion = {};
    this.selectedCategory = [];
    this.selectedZone = {};
    this.allData = [];
    this.chanels = [];

    this.generalService.getDataByDateRange(range).subscribe((data) => {
      this.allData = data;
      console.log("this.allData: ", this.allData);
      this.allDataClone = this.allData.slice();


      const allKeys = Object.keys(this.allDataClone[0]);
      // Filter out the 'id' key
      // this.columns = allKeys.filter(key => key !== 'id');
      // Filter out specific columns ('m_code' and 'full_name')
      this.columns = allKeys.filter(key => key == 'merchandiserCode' || key == 'zone' || key == 'region'
        || key=='imageType' || key =='asm' || key == 'shopName' || key == 'shopCode' || key == 'chillerDescription' || key == 'channelName'
      );
      // to change order
      const newOrder = ['zone', 'region','asm', 'merchandiserCode','imageType','shopName','shopCode','chillerDescription','channelName'];
      this.columns = this.columns.sort((a, b) => newOrder.indexOf(a) - newOrder.indexOf(b));

      console.log("allKeys: ", allKeys);
      console.log("this.columns: ", this.columns);

      this.getUniqueChanelList(this.allDataClone);
      this.getUniqueImageTypeList(this.allData);
      this.getUniqueAssetNameList(this.allData);
      console.log(this.allData[0]);
      if (this.allData.length == 0) {
        this.successTrigger = true;
        this.myMessage = "No Data Found";
      }
      this.loading = false;
      this.loadingData = false;

      // setTimeout(() => {
      //   this.loadingData = false;

      // }, 5000);
    });
  }

  getRandumHeightWidth() {
    // console.log('randum height',Math.floor(Math.random() * 40) + 300)
    return {
      height: Math.floor(Math.random() * 200) + 100 + "px",
      width: Math.floor(Math.random() * 400) + 200 + "px",
    };
    // ;
  }

  getAlert(product) {
    this.selectedProduct = product;
    this.showProductDetailModal();
    this.imageLoading = true;
    setTimeout(() => {
      this.imageLoading = false;
    }, 2000);
  }

  showProductDetailModal(): void {
    this.productDetailModal.show();
  }

  hideProductDetailModal(): void {
    this.productDetailModal.hide();
  }

  detDetailProdutsForShop(shop) {
    console.log("selected SHOP ", shop);

    this.loadingData = true;
    this.generalService.getDetailDataForShop(shop.shopId).subscribe((data) => {
      console.log("selected data ", data);

      this.allDataSelectedShop = [];
      this.allDataSelectedShop = data;
      this.loadingData = false;
    });
  }

  getSuperSearch(search) {
    console.log(search.keyCode);

    if (search == "" && this.filterData) this.allData = this.filterData;
    else this.allData = this.allDataClone;

    if (this.searchFilter.length > 1) {
      this.loadingData = true;

      this.generalService
        .getSuperSearch(this.searchFilter)
        .subscribe((data) => {
          console.log("search date", data);
          this.allData = data;
          this.loadingData = false;
        });
    } else if (search.length <= 1) {
      this.allData = this.allDataClone;
    }
  }

  clearFilter(filter: string) {
    if (filter == "all" || filter == "selectedZone") {
      this.filterData = [];
      this.allData = this.allDataClone;

      this.selectedZone = {};
      this.selectedRegion = {};
      this.selectedChanel = {};
      this.selectedCity = {};

      this.regions = [];
      this.chanels = [];
      this.cities = [];
      if (filter == "all" && this.channelName) {
        this.channelName = "";
      }
      // else {
      //   this.getAllDataClassification(this.channelName)
      // }
    } else if (filter == "selectedRegion") {
      this.selectedRegion = {};
      this.selectedChanel = {};
      this.selectedCity = {};
      this.chanels = [];
      this.cities = [];
      this.zoneChange();
    } else if (filter == "selectedChanel") {
      this.selectedChanel = {};
      this.regionChange();
    } else if (filter == "selectedCity") {
      this.selectedCity = {};
      this.regionChange();
    } else if (filter == "channelName") {
      this.channelName = "";
      if (
        this.selectedZone ||
        this.selectedRegion ||
        this.selectedChanel ||
        this.selectedCity
      )
        this.allData = this.filterData || this.filterDataClone;
      else this.allData = this.allDataClone;
    }
  }

  getUniqueChanelList(data: any) {
    let list: any = [];
    data.forEach((e) => {
      list.push(e.channelName);
    });

    let d = new Set(list);
    console.log("filter channels", d);
    this.chanels = [];
    this.chanels = d;
  }

  getUniqueImageTypeList(data: any) {
    let list: any = [];
    data.forEach((e) => {
      list.push(e.imageType);
    });

    let d = new Set(list);
    console.log("filter channels", d);
    this.imageTypeList = [];
    this.imageTypeList = d;
  }

  goToSurvey(item) {
    window.open(
      `${environment.hash}dashboard/evaluation/list/details/${item.surveyId}/${item.shopId}`,
      "_blank"
    );
  }


  getUniqueAssetNameList(data: any) {
    let list: any = [];
    const newData = data.filter(e=> e.imageType== 'VD');
    newData.forEach((e) => {
      list.push(e.assetName);
    });

    let d = new Set(list);
    console.log("filter assetName", d);
    this.assetNamesList = [];
    this.assetNamesList = d;
  }


  // setImageUrl() {
  //   for (const data of this.allData) {
  //     for (const image of data.allData) {
  //       if (image.url != null) {
  //         if (
  //           image.url.indexOf("https")
  //         ) {
  //           const i = image.allData.findIndex((e) => e.url == image.url);
  //           data.image[i].shopFullImg = true;
  //           data.image[i].assetImageURL = true;
  //           data.image[i].assetFullImg = true;
  //         }
  //       }
  //     }
  //   }
  // }
  setImageUrl() {
    this.images = [];
    for (const image of this.allData) {
      if (
        image.shopFullImg == "https" &&
        image.assetImageURL == "https" &&
        image.assetFullImg == "https"
      ) {
        this.images.push(image);
      }
    }
    console.log(this.images);
  }

  applyTextFilter(column: string, value: string) {
    // Set the filter value for the column
    if (value === '') {
      delete this.columnFilters[column];
    } else {
      this.columnFilters[column] = value.toLowerCase();
    }
  
    console.log('this.columnFilters[column]: ', this.columnFilters[column]);
    console.log('this.columnFilters: ', this.columnFilters);
  
    // Apply filters based on the current filter settings
    let filteredData = this.allDataClone;
  
    Object.entries(this.columnFilters).forEach(([col, val]) => {
      if (val && val !== '') {
        filteredData = filteredData.filter(item => (item[col] || '').toLowerCase().includes(val));
      }
    });
  
    this.allData = filteredData;
    this.cdr.detectChanges(); // Manually trigger change detection
  }
  

  applyFilter(column: string, value: string) {
    // Normalize value to lowercase for text inputs
    const filterValue = (column === 'shopName' || column === 'shopCode') ? value.toLowerCase() : value;
  
    // If "All" option is selected or input is empty, remove the filter for that column
    if (filterValue === '') {
      delete this.columnFilters[column];
    } else {
      // Set the filter value for the column
      this.columnFilters[column] = filterValue;
    }
  
    console.log('this.columnFilters[column]: ', this.columnFilters[column]);
    console.log('this.columnFilters: ', this.columnFilters);
  
    // Apply filters based on the current filter settings
    let filteredData = this.allDataClone;
  
    Object.entries(this.columnFilters).forEach(([col, val]) => {
      if (val && val !== '') {
        if (col === 'shopName' || col === 'shopCode') {
          filteredData = filteredData.filter(item => (item[col] || '').toLowerCase().includes(val));
        } else {
          filteredData = filteredData.filter(item => item[col] === val);
        }
      }
    });
  
  
    this.allData = filteredData;
    console.log("this.allData: ",this.allData);
    this.cdr.detectChanges(); // Manually trigger change detection
  }
  
  getColumnOptions(column: string): string[] {
    const uniqueValues = new Set<string>();

    // for filter options to be dependent
    this.allData.forEach(item => {
      if(item[column]){
        uniqueValues.add(item[column]);
      }
      
    });


     // for filter options to be independent
    //  this.allDataClone.forEach(item => {
    //   uniqueValues.add(item[column]);
    // });

    return Array.from(uniqueValues);
  }
  
  // updateColumnOptions(column: string) {
  //   const uniqueValues = new Set<string>();
  //   this.allData.forEach(item => {
  //     uniqueValues.add(item[column]);
  //   });
  //   this.columnOptions[column] = Array.from(uniqueValues);
  // }
  
  ngAfterViewInit() {
    // Apply initial filter after the view has been initialized
    if (Object.keys(this.columnFilters).length === 0) {
      this.applyFilter('', '');
    }
    // if (this.paginator) {
    //   console.log('Paginator pageIndex:', this.paginator.pageIndex);
    //   // Access other MatPaginator properties here
    // }
  }


  // working // in usage
// for multiple imagebase64 in single request
downloadPDFNew2() {
  debugger;
  const dat =  moment().format("D MMMM YYYY");
  const ch = this.channelName? this.channelName : 'All';
  var s = moment(this.range.fromDate).format("D"); // Start day
  var e = moment(this.range.toDate).format("D"); // End day
  var startMonth = moment(this.range.fromDate).format("MMMM"); // Start month
  var year = moment(this.range.fromDate).format("YYYY"); // Year
  
  const formattedDateRange = (s === e) ? `${s} ${startMonth} ${year}` : `${s}-${e} ${startMonth} ${year}`;
console.log(formattedDateRange); // Output: 24-26 March 2024

  console.log('PDF download started.');
 
  this.downloadingPdf = true;
  const that = this;
  const node = this.content.nativeElement;

  //   const blackDiv = document.createElement('div');
  // blackDiv.style.backgroundColor = 'black';
  // blackDiv.style.height = '200px';
  // blackDiv.style.width = '100%';
  // node.insertBefore(blackDiv, node.firstChild); 



  // Create parent div with class "row"
const rowDiv = document.createElement('div');
rowDiv.className = 'row';

// Create divs with Bootstrap classes and content
const col1Div = document.createElement('div');
col1Div.className = 'col-md-6';
col1Div.style.marginTop= '20px';
col1Div.textContent = `Title: ${ch}`;

const col2Div = document.createElement('div');
col2Div.className = 'col-md-6';
col2Div.style.marginTop= '20px';
col2Div.textContent = `User Name: ${localStorage.getItem("user_name")}`;

const col3Div = document.createElement('div');
col3Div.className = 'col-md-6';
col3Div.textContent = `Date Range: ${formattedDateRange}`;

const col4Div = document.createElement('div');
col4Div.className = 'col-md-6';
col4Div.textContent = `Extracted Date: ${dat}`;

// Append the columns to the row
rowDiv.appendChild(col1Div);
rowDiv.appendChild(col2Div);
rowDiv.appendChild(col3Div);
rowDiv.appendChild(col4Div);
 rowDiv.style.backgroundColor = 'black';
  rowDiv.style.height = '150px';
  rowDiv.style.width = '100%';
rowDiv.style.paddingLeft= '50px';
  rowDiv.style.fontWeight= 'bold';
  rowDiv.style.fontSize= '20px';
  rowDiv.style.color = 'white';

// Add the row to the document
node.insertBefore(rowDiv, node.firstChild);



  // const blackDiv = document.createElement('div');
  // blackDiv.style.backgroundColor = 'black';
  // blackDiv.style.height = '200px';
  // blackDiv.style.width = '100%';
  // blackDiv.style.position = 'absolute'; // Position absolute to overlay content
  // blackDiv.style.zIndex = '9999'; // Ensure it's above content
  // node.insertBefore(blackDiv, node.firstChild);

  // Array to store image URLs
  const imageUrls = [];

  // Iterate over each image in the content and collect their URLs
  const images = node.querySelectorAll('img');
  images.forEach((image) => {
    let src = image.src; // Get the src attribute of the image
    imageUrls.push(src);
  });

  // Make a single request to the backend to fetch base64-encoded images
  console.log("imageProxyServletNewMultiple this.ip: ",this.ip);
  fetch(this.ip + '/imageProxyServletNewMultiple', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ imageUrls })
  })
  .then((response) => response.json())
  .then((data) => {
    // console.log('Base64 image data received:', data);
    // Replace the image sources with the received base64-encoded images
    images.forEach((image, index) => {
      // if(image.src.includes("wasabi")){
      //   image.src =  data[index];
      // }
      // else{
      //   image.src = image.src;
      // }
      image.src =  data[index];
      
    });

    // Convert the entire content (with integrated images) to PDF
    domtoimage.toPng(node, { height: node.scrollHeight, width: node.scrollWidth })
      .then((dataUrl) => {
        // Create a new jsPDF instance
        console.log("node.scrollHeight: " + node.scrollHeight);
        console.log("node.scrollWidth: " + node.scrollWidth);
        const pdf = new jsPDF('p', 'pt', [node.scrollHeight, node.scrollWidth]);

        // Add the image to the PDF with the same dimensions as in the view
        pdf.addImage(dataUrl, 'PNG', 0, 0, node.scrollWidth, node.scrollHeight);

        // Save the PDF
        const filename = 'example.pdf';
        pdf.save(filename);
        console.log('PDF generation completed.');
        node.removeChild(rowDiv);
      })
      .catch((error) => {
        console.error('Error generating PDF:', error);
        alert("Error plz check your internet or relogin");
        node.removeChild(rowDiv);
      })
      .finally(() => {
        that.downloadingPdf= false;
        node.removeChild(rowDiv);
        that.cdr.detectChanges();
      });
  })
  .catch((error) => {
    console.error('Error fetching base64 image data:', error);
    alert("Error: plz check your internet or relogin");
    that.downloadingPdf= false;
    node.removeChild(rowDiv);
    that.cdr.detectChanges();
  });
}

   // working // in usage
  // for multiple imagebase64 in single request
  downloadPDFNew3() {
    console.log("In downloadPDFNew2.");
    console.log("this.allData.", this.allData);
    // if (this.allData?.length < 8) {
      console.log("Window PDF download started.");

      const elementsToHidenew2 = document.querySelectorAll(".notprint");
      elementsToHidenew2?.forEach((element: HTMLElement) => {
        element.style.display = "none";
      });


      // let originalContents = document.body.innerHTML;

      // const dat = moment().format("D MMMM YYYY");
      // const ch = this.channelName ? this.channelName : "All";
      // var s = moment(this.range.fromDate).format("D"); // Start day
      // var e = moment(this.range.toDate).format("D"); // End day
      // var startMonth = moment(this.range.fromDate).format("MMMM"); // Start month
      // var year = moment(this.range.fromDate).format("YYYY"); // Year

      // const formattedDateRange =
      //   s === e
      //     ? `${s} ${startMonth} ${year}`
      //     : `${s}-${e} ${startMonth} ${year}`;
      // console.log(formattedDateRange); // Output: 24-26 March 2024

      // const that = this;
      // const node = this.print.nativeElement;

      // const rowDiv1 = document.createElement("div");
      // rowDiv1.className = "notpr";
      // rowDiv1.style.backgroundColor = "black";
      // // Create parent div with class "row"
      // const rowDiv = document.createElement("div");
      // rowDiv.className = "row";

      // rowDiv1.insertBefore(rowDiv, rowDiv1.firstChild);

      // // Create divs with Bootstrap classes and content
      // const col1Div = document.createElement("div");
      // col1Div.className = "col-md-6 col-print-6";
      // col1Div.style.marginTop = "20px";
      // col1Div.style.width = "50%";
      // // col1Div.style.float = 'left';
      // col1Div.textContent = `Title: ${ch}`;

      // const col2Div = document.createElement("div");
      // col2Div.className = "col-md-6 col-print-6";
      // col2Div.style.marginTop = "20px";
      // col2Div.style.width = "50%";
      // // col2Div.style.float = 'left';
      // col2Div.textContent = `User Name: ${this.userName}`;

      // const col3Div = document.createElement("div");
      // col3Div.className = "col-md-6 col-print-6";
      // col3Div.style.width = "50%";
      // // col3Div.style.float = 'left';
      // col3Div.textContent = `Date-Range: ${formattedDateRange}`;

      // const col4Div = document.createElement("div");
      // col4Div.className = "col-md-6 col-print-6";
      // col4Div.style.width = "50%";
      // // col4Div.style.float = 'left';
      // col4Div.textContent = `Extracted Date: ${dat}`;

      // // Append the columns to the row
      // rowDiv.appendChild(col1Div);
      // rowDiv.appendChild(col2Div);
      // rowDiv.appendChild(col3Div);
      // rowDiv.appendChild(col4Div);
      // //  rowDiv.style.backgroundColor = 'black';
      // rowDiv.style.height = "200px";
      // rowDiv.style.width = "100%";
      // rowDiv.style.paddingLeft = "50px";
      // rowDiv.style.fontWeight = "bold";
      // rowDiv.style.fontSize = "20px";
      // rowDiv.style.color = "white";

      // // Add the row to the document
      // node.insertBefore(rowDiv1, node.firstChild);

      

      window.print();
      elementsToHidenew2.forEach((element: HTMLElement) => {
        element.style.display = ""; // Restore original display property
      });

      // const elementsToHidenew3 = document.querySelectorAll(".notpr");
      // elementsToHidenew3.forEach((element: HTMLElement) => {
      //   element.style.display = "none"; // Restore original display property
      // });
      this.downloadingPdf = false;
     
      console.log("Window PDF download ended.");
    // } 
  }
}
