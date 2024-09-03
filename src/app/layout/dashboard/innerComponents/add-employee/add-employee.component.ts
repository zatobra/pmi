import { Component, OnInit, ViewChild } from "@angular/core";
import { DashboardService } from "../../dashboard.service";
import { ToastrService } from "ngx-toastr";
import { ModalDirective } from "ngx-bootstrap/modal";
import { ExcelService } from "../../excel.service";
import { Config } from "src/assets/config";
import { Title } from "@angular/platform-browser";
import {ngxCsv} from 'ngx-csv';

import { MatDialog } from "@angular/material/dialog";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
import * as moment from 'moment';

export interface DialogData {
  animal: string;
  name: string;
}

// class ImageSnippet {
//   constructor(public src: string, public file: File) {}
// }

@Component({
  selector: "app-add-employee",
  templateUrl: "./add-employee.component.html",
  styleUrls: ["./add-employee.component.scss"],
})
export class AddEmployeeComponent implements OnInit {
  title = "Manage Employee";
  @ViewChild("childModal") childModal: ModalDirective;
  @ViewChild("addEmployee", { static: true }) addEmployee: ModalDirective;
  @ViewChild("profileImage", { static: true }) profileImage: ModalDirective;
  @ViewChild("editEmployee", { static: true }) editEmployee: ModalDirective;
  @ViewChild("inactiveDate", { static: true }) inactiveDate: ModalDirective;

  loadingData = false;
  startDate = new Date();
  attendanceList: any;
  selectedWorkType: any = {};
  tableData: any = [];
  selectedId: any;
  selectedWorkTypeId: any;
  selectedWork: any;
  selectedRegionFilter = -1;
  selectedZoneFilter = -1;
  selectedAttendanceType: any = "";
  regions: any = [];
  zones: any = [];
  employeeList: any = [];
  employeeType = Config.EMPLOYEE_TYPES;
  selectedFileType: any = {};
  sortBy: any;
  sortOrder: boolean;
  isAdmin = false;
  selectedTownName = "";
  selectedTownId = -1;
  selectedEmployeeType : any;
  selectedRegionIdForTownModal = -1;
  employeeNameForAddition = "";
  townObject = {
    cityName: "",
    cityId: -1,
  };
  uploadForm: FormGroup;
  uploadFormData: FormGroup;
  ip: any = Config.BASE_URI;
  selectedItem: any = {};
  existingName: any;
  employeeId: any;
  updatedEmployeeName: any;
  updatedEmployeeCnic: any;
  updatedEmployeeRegionId: any;
  updatedEmployeePhone: any;
  updatedEmployeeEmail: any;
  updatedEmployeeType: any;
  userId: any;
  downloadList = Config.DOWNLOAD_FILE_TYPES;
  selectedMustHave: any ;
  mustHaveList = ["Y", "N"];
  // employeeSalaryForAddition: number;
  // joiningDate = new Date();
  minDate = new Date(2000, 0, 1);
  maxDate = new Date();
  public image: any ;
  // selectedFile: ImageSnippet;
  // image: any;

  animal: string;
  name: string;
  selectedRegion: {};
  selectedZone: any;
  labels: any;
  regionList: any = [];
  updatedBasicSalary: any;
  updatedPhoneCard: any;
  updatedInternetAllowance: any;
  updatedConveyanceAllowance: any;
  selectedEmployee: any = {};

  constructor(
    private httpService: DashboardService,
    private toastr: ToastrService,
    private excelService: ExcelService,
    private titleService: Title,
    public dialog: MatDialog,
    public formBuilder: FormBuilder
  ) {
    this.labels = JSON.parse(localStorage.getItem("labelProperties"));
    this.titleService.setTitle(this.title);
    this.uploadForm = formBuilder.group({
      name: new FormControl("", [Validators.required]),
      type: new FormControl("", [Validators.required]),
      region_id : new FormControl("", [Validators.required]),
      basicSalary: new FormControl(),
      cnic: new FormControl(),
      phone: new FormControl(),
      email: new FormControl(),
      path: new FormControl(""),
      joiningDate: new FormControl(),
      phoneCard: new FormControl(),
      internetAllowance: new FormControl(),
      conveyanceAllowance: new FormControl(),
    });
  }

  ngOnInit() {
    if (parseInt(localStorage.getItem("user_zone_id")) === -1) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
    this.zones = JSON.parse(localStorage.getItem("zones"));
    this.userId = localStorage.getItem('user_id');
    this.getAllRegions();
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

  // getRegionsByZoneId() {
  //   if (parseInt(localStorage.getItem("user_zone_id")) == -1) {
  //     let parsedData: any = [];
  //     const obj = {
  //       zoneId: this.selectedZoneFilter,
  //     };
  //     this.httpService.getRegionsByZoneId(obj).subscribe((data) => {
  //       parsedData = JSON.stringify(data);
  //       this.regions = JSON.parse(parsedData);
  //     });
  //   }
  // }

  zoneChange() {
    this.loadingData = true;
    this.selectedRegion = {};
    this.httpService.getRegion(this.selectedZone.id).subscribe(
      (data) => {
        const res: any = data;
        if (res) {
          this.regions = res;
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

  getEmployeeList() {

    if(this.selectedEmployeeType === ""){
      this.toastr.info("Please select employee type.");
      return;
    }
    this.loadingData = true;
    this.httpService
      .getEmployeeList({ surveyorType: this.selectedEmployeeType,mustHave: this.selectedMustHave })
      .subscribe((data) => {
        this.loadingData = false;
        this.employeeList = data;
      }, (error) => {
        this.loadingData = false;
        this.toastr.error(error.message, 'Error');
      });
  }

  getArrowType(key) {
    if (key === this.sortBy) {
      return this.sortOrder ? "arrow_upward" : "arrow_downward";
    } else {
      return "";
    }
  }

  sortIt(key) {
    this.sortBy = key;
    this.sortOrder = !this.sortOrder;
  }

  resetFilters() {
    this.selectedRegionFilter = -1;
    this.selectedZoneFilter = -1;
  }

  showChildModal(town?): void {
    this.selectedTownName = town.title;
    this.selectedTownId = town.id;
    this.childModal.show();
  }

  hideChildModal(): void {
    this.childModal.hide();
  }

  showAddEmployeeModal(item?): void {
    this.addEmployee.show();
  }

 
  openDateModal(id:any){
    this.employeeId = id;
    this.inactiveDate.show();
  }
  hideDateModal(item?): void{
    this.inactiveDate.hide();
  }
  hideAddEmployeeModal(): void {
    this.uploadForm.reset();
    this.image= null;
    this.addEmployee.hide();
  }

  addEmployeeInSystem(post) {
    this.loadingData = true;
    debugger;
    const formData = new FormData();

    console.log("this.image: ", this.image);
    post.salary = post.basicSalary;
    formData.append("employeeData", JSON.stringify(post));
    if(this.image){
      formData.append("path", this.image);
    }
    debugger;

      this.httpService.insertEmployeeFromPortal(formData).subscribe((res: any) => {
        if (res.success) {
          this.loadingData = false;
          this.toastr.success(res.message);
          if(this.selectedEmployeeType && this.selectedMustHave){
            this.getEmployeeList();
          }
          
          this.hideAddEmployeeModal();
        } else {
          this.toastr.warning(res.message);
        }
      }, (error) => {
        this.loadingData = false;
        this.toastr.error(error.message, 'Error');
      });

  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      this.image = <File>event.target.files[0];
      const file = event.target.files[0];
      this.image = file;
      const reader = new FileReader();
      reader.readAsDataURL(this.image);
      reader.onload = (_event) => {};
    }
  }

  showProfileImageModal(): void {
    this.profileImage.show();
  }

  hideProfileImageModal(): void {
    this.profileImage.hide();
  }

  setSelectedItem(item) {
    this.selectedItem = item;
  }

  openModal(item: any) {
    this.existingName = item.employee_name;
    this.employeeId = item.employee_id;
    this.updatedEmployeePhone = item.phone;
    this.updatedEmployeeEmail = item.email;
    this.updatedEmployeeCnic = item.cnic;
    this.updatedEmployeeType = item.employee_type;
    this.updatedEmployeeRegionId = item.region_id;


    this.updatedBasicSalary = item.basic_salary;
    this.updatedPhoneCard = item.phone_card;
    this.updatedInternetAllowance = item.internet_allowance;
    this.updatedConveyanceAllowance = item.conveyance_allowance;

    this.editEmployee.show();
  }

  hideEmployeeEditModal() {
    this.existingName = undefined;
    this.employeeId = undefined;
    this.updatedEmployeeName = undefined;
    this.updatedEmployeePhone = undefined;
    this.updatedEmployeeEmail = undefined;
    this.updatedEmployeeCnic = undefined;
    this.updatedEmployeeType = undefined;
    this.updatedEmployeeRegionId = undefined;
    this.editEmployee.hide();
  }
  updateInactivedate(){
    this.loadingData = true;
    debugger;
    const obj = {
      inactiveDate: moment(this.startDate).format('YYYY-MM-DD'),
      employeeId: this.employeeId,
    };
    console.log("data: ",obj);
   debugger;
    this.httpService.updateDate(obj).subscribe(
      (data: any) => {
        if (data.success) {
          this.hideDateModal();
          this.toastr.success(data.message, 'Success');
        } else {
          this.toastr.error(data.message, 'Error');
        }
        this.loadingData = false;
        this.getEmployeeList();
      },
      (error) => {
        this.toastr.error(error.message, 'Error');
        this.loadingData = false;
      }
    );
  }
  updateEmployeeName() {
    this.loadingData = true;
   
    const obj = {
      updatedName: this.existingName,
      employeeId: this.employeeId,
      userId: this.userId,
      cnic: this.updatedEmployeeCnic || "",
      phone : this.updatedEmployeePhone || "",
      email : this.updatedEmployeeEmail || "",
      regionId : this.updatedEmployeeRegionId || "-1",

      basicSalary: this.updatedBasicSalary || "",
      phoneCard  : this.updatedPhoneCard || "",
      internetAllowance : this.updatedInternetAllowance || "",
      conveyanceAllowance : this.updatedConveyanceAllowance || "",

      type : this.updatedEmployeeType,
    };
    console.log("obj: ", obj);
    this.httpService.updateEmployeeName(obj).subscribe(
      (data: any) => {
        if (data.success) {
          this.hideEmployeeEditModal();
          this.getEmployeeList();
          this.toastr.success(data.message, 'Data Updtaed');
        } else {
          this.toastr.error(data.message, 'Error');
        }
        this.loadingData = false;
      },
      (error) => {
        this.toastr.error(error.message, 'Error');
        this.loadingData = false;
      }
    );
  }
  updateEmployeeStatus(surveyor: any, status: any) {
debugger;
    this.loadingData = true;
    const obj = {
      employeeId: surveyor.employee_id,
      status: status,
     };
    this.httpService.updateEmployeeStatus(obj).subscribe(
      (data: any) => {
       if (data.success) {
          this.toastr.success(data.message, 'Success');
        } else {
          this.toastr.error(data.message, 'Error');
        }
        this.loadingData = false;
       this.getEmployeeList();
      },
      (error) => {
        this.toastr.error(error.message, 'Error');
        this.loadingData = false;
      }
    );

  }

  downloadFile(file) {

    this.loadingData = true;
    console.log(file);
    const type = file.key;
    let data: any = {};
    const fileTitle = 'add employee';

    data = this.employeeList; 
    var csvOptions = {
      headers: Object.keys(this.employeeList[0])
    };
    if (type === 'csv') {
      new ngxCsv(data, fileTitle, csvOptions);
    } else if (type === 'xlsx') {
      this.excelService.exportAsExcelFile(data, fileTitle);
    }

    this.selectedFileType = {};
    setTimeout(() => {
      this.loadingData = false;
    }, 1000);
    this.loadingData = false;
  }

}
