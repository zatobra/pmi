import {
  Component,
  OnInit,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { DashboardService } from "../../dashboard.service";
import { Router } from "@angular/router";
import { ModalDirective } from "ngx-bootstrap/modal";

@Component({
  selector: "role_management",
  templateUrl: "./role_management.component.html",
  styleUrls: ["./role_management.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class RoleManagementComponent implements OnInit {
  title = "Role Management";
  loadingData: boolean;
  rolesList: any = [];
  selectedRole: any = {};
  selectedStatus: any;
  insertForm: FormGroup;
  updateRoleForm: FormGroup;
  userInsertForm: FormGroup;
  roles: any = new FormControl({}, [Validators.required]);
  menus: any = [];
  selectedMenus: any = [];
  selectedMenu: any = {};
  //@ViewChildren("checked") private myCheckbox: any;
  labels: any;

  //insertForm: FormGroup;
  loadingModalButton: boolean;
  @ViewChild("insertModal") insertModal: ModalDirective;
  @ViewChild("updateRoleModal") updateRoleModal: ModalDirective;
  @ViewChild("userInsertModal") userInsertModal: ModalDirective;
  @ViewChild("userInfoModal") userInfoModal: ModalDirective;
  activeStatus: any = [
    { id: 1, value: "Y" },
    { id: 2, value: "N" },
  ];
  disable: boolean = true;

  users: any = [];
  form: FormGroup;
  clusterList: any = [];
  usersClusterIds: any;
  usersClusterIdsSplit: void;
  loadingUserList: boolean = false;
  selecteduser: any;
  checkedList: any = [];
  selectedCluster: any;
  currentSelected: {};
  taggedClusters: any = [];
  taggedClusterIds: any;
  taggedClusterTitles: any;
  adminId: any;
  selectedZone: any;
  selectedRegion: any = [];
  selectedCity: any = [];
  selectedDistribution: {};
  zoneList: any = [];
  userDataList: any;
  regionList: any = [];
  selectedType: any = {};
  oldVal: any = [];
  myList: any = [];

  constructor(
    private toastr: ToastrService,
    private httpService: DashboardService,
    public router: Router,
    public formBuilder: FormBuilder
  ) {
    this.clusterList = JSON.parse(localStorage.getItem("clusterList")) || [];
    console.log("clutserList: ", this.clusterList);
    this.zoneList = JSON.parse(localStorage.getItem("zoneList")) || [];
    this.insertForm = formBuilder.group({
      type_description: new FormControl("", [Validators.required]),
      active: new FormControl("", [Validators.required]),
    });

    this.updateRoleForm = formBuilder.group({
      type_description: new FormControl("", [Validators.required]),
      selectedRoleId: new FormControl("", [Validators.required]),
    });


    this.userInsertForm = formBuilder.group({
      username: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required]),
      active: new FormControl("", [Validators.required]),
      type: new FormControl("", [Validators.required]),
      // cluster:
      //   this.clusterList.length > 0
      //     ? new FormControl("", [Validators.required])
      //     : new FormControl(""),
      //     zone:  this.zoneList.length > 0
      //     ? new FormControl("", [Validators.required])
      //     : new FormControl(""),
      //     region:  this.regionList.length > 0
      //     ? new FormControl("", [Validators.required])
      //     : new FormControl(""),
      cluster: new FormControl(""),
        zone:  new FormControl(""),
        region:   new FormControl(""),
    });

    this.labels = JSON.parse(localStorage.getItem("labelProperties"));
    this.form = formBuilder.group({
      username: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required]),
      roleId: new FormControl(""),
      active: new FormControl("", [Validators.required]),
      cluster:
        this.clusterList.length > 0
          ? new FormControl("", [Validators.required])
          : new FormControl(""),
      zone:  this.zoneList.length > 0
      ? new FormControl("", [Validators.required])
      : new FormControl(""),
      region:  this.regionList.length > 0
      ? new FormControl("", [Validators.required])
      : new FormControl(""),
    });
  }

  ngOnInit() {
    this.getRoles();


    // this.form.get("cluster").valueChanges
    // .pipe(startWith(1), pairwise()).subscribe(
    //   ([prevValue, val]) => {
    //     console.log('prev val => ' + prevValue); // previous value
    //     console.log('curr val => ' + val); // new value
    //     this.getZoneByCluster(val, this.userDataList);
    //   }
    // );



    this.form.get("cluster").valueChanges.subscribe((val) => {
      debugger;
      if (val) {
        let len = val?.length;
        let last = val[len-1];
        let k = this.compareTwoArrayOfObjects(this.oldVal, val);
        
       if(!k){
        
        this.getZoneByCluster(val, this.userDataList);
       // this.oldVal= val;
       }
           
      }
    });

    this.form.get("zone").valueChanges.subscribe((val) => {
      if (val) {
        this.zoneChange(val, this.userDataList);
      }
    });

    this.form.get("region").valueChanges.subscribe((val) => {
      if (val) {
        let ids = this.joinIds(val);
        this.changeAllRegion(ids);
      }
    });
  }

  showUserInsertModal() {
    this.selectedCluster= null;
    this.selectedZone = null;
    this.selectedRegion= null;

    this.userInsertModal.show();
    
    
  }

  showUserInfoModal(user) {
    debugger;
    console.log("clusterList: ", this.clusterList);
    console.log("clusterList: ", this.zoneList);
    console.log("clusterList: ", this.regionList);
    this.userDataList = user;
    this.adminId = user.id;
    this.selecteduser = user;
    let selectedCluster = [];

    let clusterIdsUnsplitted = user.cluster_id;
    let clusterIds: [] = clusterIdsUnsplitted.split(",");

    
    for (let i of clusterIds) {
      if (i == -1) {
      //  selectedCluster = this.clusterList;
        const k = this.clusterList.findIndex((c) => c.id == -1);
        selectedCluster.push(this.clusterList[k]);
        // if (k > -1) {
        //   selectedCluster.splice(k, 1);
        // }
        // selectedCluster = this.clusterList;
        break;
      } else {
        const k = this.clusterList.findIndex((c) => c.id == i);
        if (k > -1) {
          const obj = {
            cluster_id: i,
          };
          selectedCluster.push(this.clusterList[k]);
        }
      }
      //console.log("slectedcluster: ", this.selectedCluster);
    } //end for

    console.log("slectedcluster: ", selectedCluster);
    this.form.patchValue({
      username: user.username,
      password: user.password,
      type_id: user.type_id,
      active: user.active,
      roleId: this.selectedRole.id,
      cluster: selectedCluster,
      //zone: ""
    });

    setTimeout(() => {
      this.userInfoModal.show();
      // And any other code that should run only after 1s
    }, 1500);

    // this.userInfoModal.show();
    // this.myList = [];
  }

  updateUserData(data) {
    this.loadingModalButton = true;
    this.userDataList = data;
    const name = data.username;
    const password = data.password;
    const active = data.active;
    const roleId = data.roleId;
    const clusterIdsList = data.cluster;
    const zoneIdsList = data.zone;
    const regionIdsList = data.region;
    const id = this.adminId;
    let clusterIds = this.joinIds(clusterIdsList);
    let zoneIds = this.joinIds(zoneIdsList);
    let regionIds = this.joinIds(regionIdsList);
    clusterIds = clusterIds.indexOf('-1') == -1 ? clusterIds : -1;
    zoneIds = zoneIds.indexOf('-1') == -1 ? zoneIds : -1;
    regionIds = regionIds.indexOf('-1') == -1 ? regionIds : -1;
    //let clusterIds= clusterIdsList.map(e => e.id).join(",");
    this.httpService
      .updateUserData(
        id,
        name,
        password,
        active,
        roleId,
        clusterIds ? clusterIds : -1,
        zoneIds,
        regionIds
      )
      .subscribe((data: any) => {
        if (data) {
          this.toastr.success("User Detail Updated");
          this.getUsersByRole();
        } else {
          this.toastr.error(data.message, "Error");
        }
        this.loadingModalButton = false;
      });

    // console.log([
    //   {name: "Joe", age: 22},
    //   {name: "Kevin", age: 24},
    //   {name: "Peter", age: 21}
    // ].map(e => e.name).join(","));
  }

  hideUserInfoModal() {
    this.selecteduser = {};
    this.selectedCluster = null;
    this.selectedZone = null;
    this.selectedRegion = null;
    this.form.reset();
    this.userInfoModal.hide();
  }

  getRoles() {
    this.loadingData = true;
    this.httpService.getRoles().subscribe(
      (data) => {
        const res: any = data;
        if (res) {
          this.rolesList = res;
        }
        if (!res) {
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

  getMenus() {
    // //this.selectedSurveyors = [];

    this.loadingData = true;
    // const obj = {
    //   roleId: this.roleId,
    //  // action: action,
    // };
    this.selectedMenus = [];
    console.log(this.selectedRole.id);
    console.log(this.selectedRole.type_description);
    this.httpService.displayMenus(this.selectedRole.id).subscribe(
      (data) => {
        if (data) {
          this.menus = data;
        }
        this.clearLoading();
      },
      (error) => {
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
        this.clearLoading();
      }
    );
  }

  getUsersByRole() {
    this.loadingUserList = true;
    this.selectedMenus = [];
    this.httpService.displayUsers(this.selectedRole.id).subscribe(
      (data) => {
        if (data) {
          this.users = data;
          //this.usersClusterIdsSplit=names.split(',');
          console.log("users list: ", this.users);
        }
        this.loadingUserList = false;
      },
      (error) => {
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
        this.loadingUserList = false;
      }
    );
  }

  changeMenu(event, menu) {
    const i = this.selectedMenus.findIndex((c) => c.menu_id == menu.menu_id);
    if (i > -1) {
      const obj = {
        menu_id: menu.menu_id,
        menu_header: menu.menu_header,
        menu_title: menu.menu_title,
        active: event.checked ? "Y" : "N",
      };
      this.selectedMenus.splice(i, 1, obj);
      let disablesave: boolean = false;
      this.disable = disablesave;
    } else {
      const obj = {
        menu_id: menu.menu_id,
        menu_header: menu.menu_header,
        menu_title: menu.menu_title,
        msl: menu.mustHave,
        active: event.checked ? "Y" : "N",
      };
      this.selectedMenus.push(obj);
      let disablesave: boolean = false;
      this.disable = disablesave;
    }
  }

  saveMenus() {
    this.loadingData = true;
    // const obj = {
    //   roleId: this.selectedRole.id,
    //   menus: this.selectedMenus,

    // };
    const roleId = this.selectedRole.id;
    const menus = this.selectedMenus;
    this.httpService.updateMenus(roleId, menus).subscribe(
      (data) => {
        if (data) {
          //if (data.success) {
          this.toastr.success("Menus Updated Successfully ");
          this.selectedMenus = [];
          //this.showCount("show");
        }
        this.clearLoading();
      },
      (error) => {
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
        this.clearLoading();
      }
    );
  }

  clearLoading() {
    this.loadingData = false;
  }

  showInsertModal() {
    this.insertModal.show();
  }

  hideInsertModal() {
    this.insertForm.reset();
    this.insertModal.hide();
  }

  hideUserInsertModal() {
    this.userInsertForm.reset();
    this.userInsertModal.hide();
  }

  insertUser(data) {
    const cluster= this.clusterList.length > 0 ? data.cluster : -1;
    console.log("data: ", data);
    this.loadingModalButton = true;
    const obj = {
      username: data.username,
      password: data.password,
      active: data.active,
      type: data.type,
      cluster: cluster && cluster.length>0 ? cluster : -1,
      zone: data.zone && data.zone.length>0 ? data.zone: -1,
      region: data.region && data.region.length>0 ? data.region: -1,
    };
    this.httpService.insertUser(obj).subscribe((data: any) => {
      if (data.id == 1) {
        this.toastr.success(data.title, data.description);
        if (this.selectedRole.id) {
          this.getUsersByRole();
        }
        this.hideUserInsertModal();
      } else {
        this.toastr.error(data.title, data.description);
      }
      this.loadingModalButton = false;
    });
  }

  insertRole(data) {
    this.loadingModalButton = true;
    // const formData = new FormData();
    const type_description = data.type_description;
    const active = data.active;

    // formData.append("formData", JSON.stringify(data));
    this.httpService
      .insertRole(type_description, active)
      .subscribe((data: any) => {
        if (data) {
          this.toastr.success("Role Added");
          this.getRoles();
          this.hideInsertModal();
        } else {
          this.toastr.error(data.message, "Error");
        }
        this.loadingModalButton = false;
      });
  }

  getSelectedValue(status: Boolean, value: String) {
    if (status) {
      this.checkedList.push(value);
    } else {
      var index = this.checkedList.indexOf(value);
      this.checkedList.splice(index, 1);
    }

    this.currentSelected = { checked: status, name: value };
  }

  async getZoneByCluster(clusterIdsList, userDataList) {
   //
   debugger;
   let clusterIds;


  

   if (isNaN(clusterIdsList)) {
     clusterIds = this.joinIds(clusterIdsList);
   }


     this.changeAllCluster(clusterIds, clusterIdsList);
   
  }


  async hi(clusterIdsList){
    debugger;
    let clusterIds;
 
 
   
 
    if (isNaN(clusterIdsList)) {
      clusterIds = this.joinIds(clusterIdsList);
    }
    //this.selectedZone = {};
    // this.selectedRegion = [];
    //this.selectedRole = {};
    this.selectedCity = {};
    this.selectedDistribution = {};
    let selectedZone = [];

    debugger;

    const data: any = await this.httpService
      .getZoneByCluster(clusterIds.includes('-1')? '-1' : clusterIds || -1)
      .toPromise();
    // const data: any = this.httpService.getZoneByCluster(clusterIds || -1).subscribe((data: any) => {
    if (data) {
      debugger;
      const res: any = data;
      console.log(res);
      this.zoneList = res;

      let zoneIdsUnsplitted = this.userDataList.zone_id;
      let zoneIds: [] = zoneIdsUnsplitted.split(",");

      for (let i of zoneIds) {
        if (i == -1) {
          // selectedZone = this.zoneList;
          const k = this.zoneList.findIndex((c) => c.id == -1);
          selectedZone.push(this.zoneList[k]);
          
          // if (k > -1) {
          //   selectedZone.splice(k, 1);
          // }
          // selectedZone = this.zoneList;
          break;
        } else {
          const k = this.zoneList.findIndex((c) => c.id == i);
          if (k > -1) {
            //  const obj = {
            //    zone_id: i,
            //  };
            selectedZone.push(this.zoneList[k]);
          }
        }
      } //end for
    }

    this.form.get("zone").setValue(selectedZone);
    this.loadingData = false;

    (error) => {
      error.status === 0
        ? this.toastr.error("Please check Internet Connection", "Error")
        : this.toastr.error(error.description, "Error");
      this.loadingData = false;
    };
  }


  getAllRegions() {
    this.loadingData = true;
    this.httpService.getRegions().subscribe(
      (data) => {
        const res: any = data;
        if (res.regionList) {
          this.regionList = res.regionList;
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

  async zoneChange(zoneIdsList, userDataList) {
    let zoneIds;
    if (isNaN(zoneIdsList)) {
      zoneIds = this.joinIds(zoneIdsList);
    }

    this.changeAllZone(zoneIds);
    // let zoneIds = this.joinZoneIds(zoneIdsList);

    let selectedRegion = [];
    let selected = [];
    this.loadingData = true;
    // this.selectedRegion = [];
    const data: any = await this.httpService
      .getRegion(zoneIds || -1)
      .toPromise();
    if (data) {
      this.regionList = data;

      let regionIdsUnsplitted = userDataList.region_id;
      let regionIds: [] = regionIdsUnsplitted.split(",");

      for (let i of regionIds) {
        if (i == -1) {
          // selectedRegion = this.regionList;
          const k = this.regionList.findIndex((c) => c.id == -1);
          selectedRegion.push(this.regionList[k]);
          // if (k > -1) {
          //   selectedRegion.splice(k, 1);
          // }
          // selected = selectedRegion;
          break;
        } else {
          const k = this.regionList.findIndex((c) => c.id == i);
          if (k > -1) {
            //  const obj = {
            //    zone_id: i,
            //  };
            selectedRegion.push(this.regionList[k]);
          }
        }
      } //end for
    }

    this.form.get("region").setValue(selectedRegion);
    this.loadingData = false;
  }

  // joinZoneIds(zoneIdsList: any) {
  //   return zoneIdsList.map(e => e.id).join(",");
  // }

  joinIds(idsList: any) {
    return idsList.map((e) => e.id).join(",");
  }

  async getZoneByClusterId() {
    console.log("cluster: ", this.selectedCluster);
    try {
      const data: any = await this.httpService
        .getZoneByCluster(this.selectedCluster || -1)
        .toPromise();
      if (data) {
        this.zoneList = data;
      }
    } catch (error) {
      this.toastr.error(error, "Please check Internet Connection");
    }
  }

  async getRegionByZoneId() {
    try {
      const data: any = await this.httpService
        .getRegion(this.selectedZone || -1)
        .toPromise();
      if (data) {
        this.regionList = data;
      }
    } catch (error) {
      this.toastr.error(error, "Please check Internet Connection");
    }
  }

  change(event)
  {
    debugger;
    // if(event.isUserInput) {
      console.log(event.source.value, event.source.selected);
    // }
  }


  changeAllCluster(selectedIds, clusterIdsList){
    debugger;
    this.myList = [];

    console.log("this.oldVal: ", this.oldVal);
    console.log("new Val clusterIdsList: ", clusterIdsList);

    if(clusterIdsList.length> this.oldVal.length){
      // this.myList.push( clusterIdsList.filter(x => this.oldVal.map(y => y.id)!=x.id));
      clusterIdsList?.forEach((item) => {
        var i = this.oldVal.findIndex(
          (x) =>
            x.id == item.id
        );
  
        if (i == -1)
          this.myList.push(item);
      });
      console.log("new Val clusterIdsList: ", this.myList);
      console.log("new Val clusterIdsList[0]: ", this.myList[0]);
      console.log("new Val clusterIdsList[0].id: ", this.myList[0].id);
      if(this.myList[0].id !='-1'){
        this.myList = clusterIdsList.filter(e => e.id!='-1');
        this.oldVal = this.myList;
        this.form.get("cluster").setValue(this.myList);
        this.hi(this.myList);
        
      }
      else{
        this.oldVal = this.clusterList;
        this.form.get("cluster").setValue(this.clusterList);
        this.hi(this.clusterList);
      }
    }

    else{
      // this.myList.push(this.oldVal.filter(x => clusterIdsList.map(y => y.id)!=x.id));
      this.oldVal?.forEach((item) => {
        var i = clusterIdsList.findIndex(
          (x) =>
            x.id == item.id
        );
  
        if (i == -1)
          this.myList.push(item);
      });
      console.log("new Val clusterIdsList: ", this.myList);
      console.log("new Val clusterIdsList[0]: ", this.myList[0]);
      console.log("new Val clusterIdsList[0].id: ", this.myList[0].id);
      if(this.myList[0].id !='-1'){
        this.myList = clusterIdsList.filter(e => e.id!='-1');
        this.oldVal = this.myList;
        this.form.get("cluster").setValue(this.myList);
        this.hi(this.myList);
      }
      else{
        this.oldVal = [];
        this.form.get("cluster").setValue(this.oldVal);
        this.hi(this.oldVal);
      }
    }

    // console.log("let myList: ", this.myList);
    // let len2 = selectedIds.split(",").length;
    // let arr: any = [];

 


    // let list = this.clusterList;
    // let slicedList = list.slice(1);
    // let ids = selectedIds.split(",");

    // for(let id of ids){
    //   const k = slicedList.findIndex((c) => c.id == id);
    //   if (k > -1) {
        
    //     slicedList.splice(k, 1);
        
    //   }
    // }

    // if(slicedList.length<=0){
    //   slicedList.push(this.clusterList[0]);
    //   this.form.get("cluster").setValue(slicedList);
    // }

  

  }

  changeAllZone(selectedIds){
    
    let list = this.zoneList;
    let slicedList = list.slice(1);
    let ids = selectedIds.split(",");

    for(let id of ids){
      const k = slicedList.findIndex((c) => c.id == id);
      if (k > -1) {
        
        slicedList.splice(k, 1);
        
      }
    }

    if(slicedList.length<=0){
      slicedList.push(this.zoneList[0]);
      this.form.get("zone").setValue(slicedList);
    }

  }

  changeAllRegion(selectedIds){
    
    let list = this.regionList;
    let slicedList = list.slice(1);
    let ids = selectedIds.split(",");

    for(let id of ids){
      const k = slicedList.findIndex((c) => c.id == id);
      if (k > -1) {
        
        slicedList.splice(k, 1);
        
      }
    }

    if(slicedList.length<=0){
      slicedList.push(this.regionList[0]);
      this.form.get("region").setValue(slicedList);
    }

  }

  

  compareTwoArrayOfObjects(
    first_array_of_objects,
    second_array_of_objects
    ){
    return (
        first_array_of_objects.length === second_array_of_objects.length &&
        first_array_of_objects.every((element_1) =>
            second_array_of_objects.some((element_2) =>
                Object.keys(element_1).every((key) => element_1[key] === element_2[key])
            )
        )
    );
  }

  editRole(data) {
    this.loadingModalButton = true;
    // const formData = new FormData();
    const type_description = data.type_description;
    const selectedRoleId = data.selectedRoleId;

    // formData.append("formData", JSON.stringify(data));
    this.httpService
      .editRole(type_description, selectedRoleId)
      .subscribe((data: any) => {
        if (data) {
          this.toastr.success("Role Updated");
          this.getRoles();
        } else {
          this.toastr.error(data.message, "Error");
        }
        this.loadingModalButton = false;
      });
  }

  showUpdateRoleModal() {
    this.updateRoleModal.show();
  }

  hideUpdateRoleModal() {
    this.updateRoleForm.reset();
    this.updateRoleModal.hide();
  }
}
