import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  AfterViewInit,
} from "@angular/core";
import { DashboardService } from "../../dashboard.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { ModalDirective } from "ngx-bootstrap/modal";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";

@Component({
  selector: "app-manage-emails",
  templateUrl: "./manage-emails.component.html",
  styleUrls: ["./manage-emails.component.scss"],
})
export class ManageEmailsComponent implements OnInit, AfterViewInit {
  loadingData = false;
  loadingModal = false;
  loadingModalButton = false;
  projectType: any;
  emailList: any = [];
  tmpEmailList: any = [];
  emailTypes: any = [];
  selectedEmailType: any;
  addressTypes: any = [];
  clusterList: any = [];
  zones: any = [];
  regions: any = [];
  zoneObj = { id: -1, title: "All" };
  selectedCluster: any = {};
  selectedZone: any;
  selectedRegion: any;

  activeStatus: any = [
    { id: 1, value: "Y" },
    { id: 2, value: "N" },
  ];

  labels: any;

  isUpdateRequest: boolean;
  modalTitle: any;

  @ViewChild("childModal", { static: true }) childModal: ModalDirective;

  form: FormGroup;
  filteredList: any;
  areas: any = [];
  zoneList: any;
  regionList: any;
  areaList: any;

  constructor(
    private httpService: DashboardService,
    private router: Router,
    private toastr: ToastrService,
    public formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.clusterList = JSON.parse(localStorage.getItem("clusterList")) || [];

    this.projectType = localStorage.getItem("projectType");

    this.form = formBuilder.group({
      id: new FormControl(""),
      email: new FormControl("", [Validators.required]),
      addressType: new FormControl("", [Validators.required]),
      emailType: new FormControl("", [Validators.required]),
      emailTypeTitle: new FormControl(""),
      cluster:
        this.clusterList?.length == 0 || !this.clusterList
          ? this.formBuilder.group({
              id: -1,
              title: "All",
            })
          : this.formBuilder.group({
              id: new FormControl("", [Validators.required]),
              title: new FormControl(""),
            }),
      // zone:  this.zones?.length > 0
      //   ? new FormControl("", [Validators.required])
      //   : new FormControl(""),
      // zone: this.formBuilder.group({
      //   id: new FormControl("", [Validators.required]),
      //   title: new FormControl(""),
      // }),
      //   region:  this.regions?.length > 0
      //   ? new FormControl("", [Validators.required])
      //   : new FormControl(""),
      //   area:  this.areas?.length > 0
      //   ? new FormControl("", [Validators.required])
      //   : new FormControl(""),
      active: new FormControl("", [Validators.required]),
      // regionId: new FormControl(""),
      // zoneId: new FormControl(""),
      // areaId: new FormControl(""),
      area_id: new FormControl(""),
      zone_id: new FormControl(""),
      region_id: new FormControl(""),
    });
    this.labels = JSON.parse(localStorage.getItem("labelProperties"));
  }

  async ngOnInit() {
    this.getAllEmails();
    debugger;
    this.zones = JSON.parse(localStorage.getItem("zoneList"));
    await this.zoneChange(-1);
    debugger;
    await this.regionChange(-1);
    this.zoneList = this.zones;
    this.regionList = this.regions;
    this.areaList = this.areas;
  }

  ngAfterViewInit() {
    const message = "all done loading :)";
    this.cdr.detectChanges();
  }

  getAllEmails() {
    this.loadingData = true;
    const obj = {
      act: 23,
      emailType: null,
    };
    this.httpService.getFilterData(obj).subscribe(
      (data) => {
        const res: any = data;
        if (res) {
          this.emailList = data;
          this.getEmailTypes();
        }
        if (!res) {
          this.toastr.info("No data Found", "Info");
        }
        this.loadingData = false;
      },
      (error) => {
        this.loadingData = false;
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
      }
    );
  }
  getEmailByType() {
    this.tmpEmailList = [];
    if (this.selectedEmailType.emailType == "All") {
      this.tmpEmailList = this.emailList;
    } else {
      for (const element of this.emailList) {
        if (element.emailType == this.selectedEmailType.emailType) {
          this.tmpEmailList.push(element);
        }
      }
    }
    this.filteredList = this.tmpEmailList;
  }

  getEmailTypes() {
    const obj = {
      emailType: "All",
      emailTypeTitle: "All",
    };
    this.emailTypes.push(obj);
    const emailSet = Array.from(
      new Set(this.emailList.map((item: any) => item.emailType))
    ).map((emailType) => {
      return {
        emailType: emailType,
        emailTypeTitle: this.emailList.find((e) => e.emailType == emailType)
          .emailTypeTitle,
      };
    });
    for (const element of emailSet) {
      this.emailTypes.push(element);
    }

    // console.log("emailTypes", this.emailTypes);
    // this.emailTypes= this.emailTypes.filter(e=> e.emailType)
    // console.log("emailTypes", this.emailTypes);
  }

  getZoneByCluster(cluster) {
    this.loadingModal = true;
    debugger;
    // this.selectedZone = {};
    // this.selectedRegion = {};
    this.httpService.getZoneByCluster(cluster.id || -1).subscribe(
      (data) => {
        const res: any = data;
        if (res) {
          this.zones = res;
        }
        this.loadingModal = false;
      },
      (error) => {
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
        this.loadingModal = false;
      }
    );
  }

  getSelectiveClusters() {
    this.loadingData = true;
    this.httpService.getAllClusters().subscribe(
      (data) => {
        const res: any = data;
        if (res.clusterList) {
          this.clusterList = res.clusterList;
        }
        this.loadingData = false;
      },
      (error) => {
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
        this.loadingData = false;
      }
    );
  }

  async zoneChange(zoneId) {
    debugger;
    console.log("zone", this.selectedZone, "zone2: ", zoneId);
    this.loadingModal = true;
    // this.selectedRegion = {};
    const data: any = await this.httpService
      .getRegion(zoneId || -1)
      .toPromise();
    try {
      if (data) {
        const res: any = data;
        if (res) {
          this.regions = res;
        }
      }
      this.loadingModal = false;
    } catch (error) {
      this.loadingModal = false;
      this.toastr.error(error, "Please check Internet Connection");
    }
  }

  showInsertModal() {
    debugger;
    // this.clusterList = JSON.parse(localStorage.getItem("clusterList")) || [];
    // if (this.clusterList.length > 0) {
    //   this.zones = [];
    // } else {
    //   this.zones = JSON.parse(localStorage.getItem("zoneList"));
    // }
    // this.regions = [{
    //   id: -1,
    //   title: "All"
    // }];
    this.isUpdateRequest = false;
    this.modalTitle = "Add New Email";
    if (this.emailList.length == 0) {
      this.getAllEmails();
    }
    this.form.patchValue({
      id: -1,
      // zone: {
      //   id: -1,
      //   title: "All"
      // },
      // region: {
      //   id: -1,
      //   title: "All"
      // },
    });
    this.addressTypes = Array.from(
      new Set(this.emailList.map((item: any) => item.addressType))
    );
    this.childModal.show();
  }

  showUpdateModal(data) {
    console.log("data: ", data);
    this.clusterList = JSON.parse(localStorage.getItem("clusterList")) || [];
    if (this.clusterList?.length > 0) {
      this.zones = [];
      this.getZoneByCluster(data.cluster);
    } else {
      this.zones = JSON.parse(localStorage.getItem("zoneList"));
    }
    console.log("zones: ", this.zones);
    console.log("regions: ", this.regions);
    this.regions = [];
    this.isUpdateRequest = true;
    this.modalTitle = "Update Email";
    this.addressTypes = Array.from(
      new Set(this.emailList.map((item: any) => item.addressType))
    );
    this.zoneChange2(data.zone_id);
    this.regionChange2(data.region_id);
    this.form.patchValue({
      id: data.id,
      email: data.email,
      emailType: data.emailType,
      emailTypeTitle: data.emailTypeTitle,
      addressType: data.addressType,
      cluster:
        this.clusterList?.length == 0
          ? { id: -1, title: "All" }
          : {
              id: data.cluster.id,
              title: data.cluster.title,
            },
      zone: {
        id: data.zone.id,
        title: data.zone.title,
      },
      region: {
        id: data.region.id,
        title: data.region.title,
        type: data.region.type,
        zone_id: data.region.zone_id,
      },
      region_id: data.region_id,
      zone_id: data.zone_id,
      area_id: data.area_id,

      area: {
        id: data.area.id,
        title: data.area.title,
      },
      active: data.active,
    });
    this.childModal.show();
  }

  hideModal() {
    debugger;
    // this.clusterList = [];
    // this.zones = [];
    this.regions = this.regionList;
    this.areas = this.areaList;
    this.form.reset();
    console.log("this.form.value", this.form.value);
    this.childModal.hide();
  }

  insertUpdateData(form) {
    // debugger;
    // console.log("form:", form);
    // delete form.cluster;
    // delete form.email;
    // console.log("form:", form);
    // form.append("clutser_id", '1111');
    const formData = new FormData();
    formData.append("data", JSON.stringify(form));
    // formData.append("clutser_id", '1111');
    const url = this.isUpdateRequest ? "/updateEmail" : "/addNewEmail"; // UpdateEmailController || AddEmailController
    this.loadingModal = true;
    this.loadingModalButton = true;
    this.httpService.addUpdateEmail(formData, url).subscribe((data: any) => {
      if (data.success == "true") {
        this.toastr.success(data.message);
        if (this.isUpdateRequest) {
          this.spliceEmail(form, -1);
        } else {
          this.addNewEmail(form, data.id);
        }
      } else {
        this.toastr.error(data.message, "Error");
      }

      this.loadingModal = false;
      this.loadingModalButton = false;
    });
  }

  getEmailTypeTitle() {
    this.loadingModal = true;
    const emailType = this.form.get("emailType").value;
    const i = this.emailTypes.findIndex((e) => e.emailType === emailType);
    this.form.controls["emailTypeTitle"].setValue(
      this.emailTypes[i].emailTypeTitle
    );
    this.loadingModal = false;
  }
  addNewEmail(data, id) {
    const obj = this.fillObj(data, id);
    this.emailList.push(obj);
    if (this.tmpEmailList.length > 0) {
      this.getEmailByType();
    }
  }

  spliceEmail(data, id) {
    const j = this.emailList.findIndex((e) => e.id == data.id);
    const i = this.tmpEmailList.findIndex((e) => e.id == data.id);
    const obj = this.fillObj(data, id);
    this.tmpEmailList.splice(i, 1, obj);
    this.emailList.splice(j, 1, obj);
    this.filteredList = this.tmpEmailList;
  }

  fillObj(data, id) {
    let obj = {
      id: id > -1 ? id : data.id,
      email: data.email,
      emailType: data.emailType,
      emailTypeTitle: data.emailTypeTitle,
      addressType: data.addressType,
      cluster:
        this.clusterList?.length == 0
          ? {
              id: -1,
              title: "All",
            }
          : {
              id: data.cluster.id,
              title:
                this.clusterList[
                  this.clusterList?.findIndex((e) => e.id == data.cluster.id)
                ].title,
            },
      zone: {
        id: data.zone_id,
        title:
          this.zoneList[this.zoneList.findIndex((e) => e.id == data.zone_id)]
            .title,
      },
      region: {
        id: data.region_id,
        title:
          this.regions[this.regions.findIndex((e) => e.id == data.region_id)]
            .title,
      },
      area: {
        id: data.area_id,
        title:
          this.areas[this.areas.findIndex((e) => e.id == data.area_id)].title,
      },
      active: data.active,
      zone_id: data.zone_id,
      region_id: data.region_id,
      area_id: data.area_id,
    };
    console.log("obj", obj);
    return obj;
  }

  changeStatus(checkedEvent, email) {
    console.log("id: ", email?.id, "checkedEvent", checkedEvent.target.checked);
    console.log("email in changestatus: ", email);
    const obj = email;
    obj.id = email.id;
    if (email.active == "Y") {
      obj.active = "N";
    } else {
      obj.active = "Y";
    }
    this.loadingModal = true;
    this.loadingModalButton = true;
    this.httpService.addUpdateEmailById(obj).subscribe((data: any) => {
      if (data.success == "true") {
        // this.toastr.success(data.message);
        console.log("Status Change: ", data.message);
        email.active = obj.active;
        this.spliceEmail(email, -1);
      } else {
        this.toastr.error(data.message, "Error");
      }

      this.loadingModal = false;
      this.loadingModalButton = false;
    });
  }

  onNotifyClicked(filteredlist: any) {
    console.log(this.filteredList);
    this.filteredList = filteredlist;
  }

  async regionChange(regionId) {
    console.log("this.selectedRegion", this.selectedRegion, "region", regionId);

    // this.loadingData = true;
    const data: any = await this.httpService
      .getAreaByRegion(regionId || -1)
      .toPromise();
    if (data) {
      // this.channels = data[0];
      const res: any = data;
      if (res) {
        this.areas = res;
        // this.areas.push({
        //   id: -1,
        //   title: "All"
        // })
      } else {
        // this.clearLoading();
        this.toastr.info(
          "Something went wrong,Please retry",
          "Connectivity Message"
        );
      }
    }
  }

  zoneChange2(zoneId) {
    debugger;
    const zone = this.form.get("zone_id").value;
    if (zone && zone != -1) {
      this.regions = this.regionList.filter((r) => r.zone_id == zone);
      this.regions.push({
        id: -1,
        title: "All",
      });
    } else {
      this.regions = this.regionList;
    }
    this.sort(this.regions);
  }

  sort(items) {
    items.sort((a, b) => {
      return a.id - b.id;
    });
  }

  regionChange2(regionId) {
    debugger;
    const region = this.form.get("region_id").value;
    if (region && region != -1) {
      this.areas = this.areaList.filter((a) => a.regionId == region);
      this.areas.push({
        id: -1,
        title: "All",
      });
    } else {
      this.areas = this.areaList;
    }
    this.sort(this.areas);
  }
}
