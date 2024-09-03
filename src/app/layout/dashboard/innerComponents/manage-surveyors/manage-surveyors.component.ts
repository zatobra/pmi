import {
  AfterContentChecked,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  ChangeDetectorRef,
} from "@angular/core";
import { Router } from "@angular/router";
import { DashboardService } from "../../dashboard.service";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ModalDirective } from "ngx-bootstrap/modal";

@Component({
  selector: "app-manage-surveyors",
  templateUrl: "./manage-surveyors.component.html",
  styleUrls: ["./manage-surveyors.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ManageSurveyorsComponent implements OnInit, AfterContentChecked {
  @ViewChild("surveyorInfoModal", { static: true })
  surveyorInfoModal: ModalDirective;
  @ViewChild("insertModal") insertModal: ModalDirective;
  zones: any = [];
  regions: any = [];
  selectedZone: any = {};
  selectedRegion: any = {};
  surveyorList: any = [];
  supervisorList: any = [];
  merchandiserList: any=[];
  managerList: any = [];
  eva: any = [];
  productsSetList: any = [];
  loadingData: boolean;
  regionList: any=[]; 

  projectType: any;
  sortOrder = true;
  sortBy: "m_code";
  form: FormGroup;
  loadingModal: boolean;
  loadingModalButton: boolean;
  activeStatus: any = ["Y", "N"];
  selectedSurveyor: any = {};
  clusterList: any = [];
  labels: any;
  selectedCluster: any = {};
  title = "";

  insertForm: FormGroup;
  insertTitle = "";
  insertType: any;
  employeeList: any = [];
  merchandiserEmployeeList: any = [];
  merchandiserFilteredEmployees: any[];
  supervisorEmployeeList: any = [];
  supervisorFilteredEmployees: any[];
  managerEmployeeList: any = [];
  managerFilteredEmployees: any[];
  searchTerm: string;

  constructor(
    private toastr: ToastrService,
    private httpService: DashboardService,
    public router: Router,
    public formBuilder: FormBuilder,
    private readonly changeDetector: ChangeDetectorRef
  ) {
    this.zones = JSON.parse(localStorage.getItem("zoneList"));
    this.projectType = localStorage.getItem("projectType");
    this.labels = JSON.parse(localStorage.getItem("labelProperties"));
    this.title = "Manage " + this.labels.surveyorLabel;
    this.clusterList = JSON.parse(localStorage.getItem("clusterList"));
    console.log(this.clusterList);
    this.form = formBuilder.group({
      id: new FormControl(""),
      m_code: new FormControl(""),
      fullName: new FormControl(""),
      password: new FormControl("", [Validators.required]),
      supervisorId: new FormControl(""),
      evaluatorId: new FormControl(""),
      employeeId: new FormControl("", [Validators.required]),
      productsSetId: new FormControl("", [Validators.required]),
      region_id: new FormControl("", [Validators.required]),
      email: new FormControl(""),
      phone: new FormControl(""),
      cnic: new FormControl(""),
      active: new FormControl("", [Validators.required]),
    });

    // this.form = formBuilder.group({
    //   id: new FormControl(""),
    //   m_code: new FormControl(""),
    //   fullName: new FormControl("", [Validators.required]),
    //   password: new FormControl("", [Validators.required]),
    //   supervisorId: new FormControl(""),
    //   evaluatorId: new FormControl(""),
    //   productsSetId: new FormControl(""),
    //   email: new FormControl(""),
    //   phone: new FormControl(""),
    //   cnic: new FormControl(""),
    //   active: new FormControl("", [Validators.required]),
    // });
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  ngOnInit() {
    this.getEvaluator();
    this.getEmployeeList();
    this.getProductsSet();
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

  getZoneByCluster() {
    this.loadingData = true;
    this.selectedZone = {};
    this.selectedRegion = {};
    this.httpService.getZoneByCluster(this.selectedCluster.id || -1).subscribe(
      (data) => {
        const res: any = data;
        if (res) {
          this.zones = res;
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

  loadSurveyors() {
    this.loadingData = true;
    this.httpService
      .getSurveyors(
        this.selectedCluster.id,
        this.selectedZone.id,
        this.selectedRegion.id
      )
      .subscribe(
        (data) => {
          const res: any = data;
          if (res) {
            this.surveyorList = res;
            console.log("merch data: ", this.surveyorList);
            this.getMerchandisers();
            this.getSupervisors();
            this.getManagers();
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

  getEvaluator() {
    this.loadingData = true;
    this.httpService.getEvaluatorData().subscribe((data) => {
      //this.eva = data;
      if (data) {
        // console.log("evaluator data", data);
        this.eva = data;
        this.loadingData = false;
      }
      this.loadingData = false;
    });
  }

  getProductsSet() {
    this.loadingData = true;
    this.httpService.getProductSets().subscribe((data) => {
      if (data) {
        this.productsSetList = data;
        this.loadingData = false;
      }
      this.loadingData = false;
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

  updateSurveyorData(data) {
    this.loadingModalButton = true;
    const formData = new FormData();
    // console.log("sup id: ", data.supervisorId);
    if (!data.supervisorId || !data.evaluatorId) {
      data.supervisorId = -1;
    }
    if (!data.evaluatorId) {
      data.evaluatorId = -1;
    }
    if (!data.employeeId) {
      data.employeeId = -1;
    }
    // console.log("sup id: ", data.supervisorId);
    // console.log("update data: ", data);
    formData.append("formData", JSON.stringify(data));
    this.httpService.updateSurveyorData(formData).subscribe((data: any) => {
      if (data.success == "true") {
        this.loadSurveyors();
        this.hideSurveyorInfoModal();
        this.toastr.success(data.message);
      } else {
        this.toastr.error(data.message, "Error");
      }
      this.loadingModalButton = false;
    });
  }

  showSurveyorInfoModal(surveyor) {
    this.selectedSurveyor = surveyor;
    this.form.patchValue({
      id: surveyor.id,
      m_code: surveyor.m_code,
      fullName: surveyor.fullName,
      password: surveyor.password,
      supervisorId: surveyor.supervisorId,
      email: surveyor.email,
      phone: surveyor.phone,
      active: surveyor.active,
      cnic: surveyor.cnic,
      evaluatorId: surveyor.evaluatorId,
      employeeId: surveyor.employeeId,
      productsSetId: surveyor.productsSetId > 0 ? surveyor.productsSetId : null,
      region_id: surveyor.region_id,
    });
    this.surveyorInfoModal.show();
  }

  hideSurveyorInfoModal() {
    this.selectedSurveyor = {};
    this.form.reset();
    this.surveyorInfoModal.hide();
  }

  getMerchandisers(){
    this.merchandiserList = [];
    for (const surveyor of this.surveyorList) {
      if (surveyor.type == 1) {
        this.merchandiserList.push(surveyor);
      }
    }
    // const noSuperVisor={
    //   supervisorList.
    // };
    console.log(this.merchandiserList);
  }

  getSupervisors() {
    this.supervisorList = [];
    for (const surveyor of this.surveyorList) {
      if (surveyor.type == 2) {
        this.supervisorList.push(surveyor);
      }
    }
    // const noSuperVisor={
    //   supervisorList.
    // };
    console.log(this.supervisorList);
  }

  getManagers() {
    this.managerList = [];
    for (const surveyor of this.surveyorList) {
      if (surveyor.type == 3) {
        this.managerList.push(surveyor);
      }
    }
    // const noSuperVisor={
    //   supervisorList.
    // };
    console.log(this.managerList);
  }

  showInsertModal(data) {
    console.log(data);
    this.insertTitle = data.insertTitle;
    this.insertType = data.insertType;
    this.insertModal.show();
  }

  hideInsertModal() {
    // this.insertForm.reset();
    this.form.reset();
    this.insertModal.hide();
  }

  addSurveyor(data) {
    console.log("insertformData: ", data);
    this.loadingModalButton = true;
    // let emp : {} = this.merchandiserEmployeeList.find(e=> e.id== data.employeeId);
    const obj = {
      // act: 2,
      m_code: data.m_code,
      fullname: data.fullName,
      active: data.active,
      password: data.password,
      phone: data.phone,
      supervisorId: data.supervisorId ? data.supervisorId : -1,
      evaluatorId: data.evaluatorId ? data.evaluatorId : -1,
      productsSetId: data.productsSetId,
      regionId: data.region_id,
      // evaluatorId: data.evaluatorId,
      employeeId: data.employeeId ? data.employeeId : -1,
      email: data.email,
      cnic: data.cnic,
      type: this.insertType,
    };
    // const active = data.active;
    this.httpService.insertSurveyor(obj).subscribe((data: any) => {
      if (data.success == "true") {
        this.toastr.success(this.insertTitle, " Added");
        this.loadSurveyors();
        this.hideInsertModal();
      } else {
        this.toastr.error(data.message, "Error");
      }
      this.loadingModalButton = false;
    });
  }

  // employe list working
  getEmployeeList() {
    this.loadingData = true;
    let obj = { 
      surveyorType: "",
      mustHave: "Y" 
    };
    this.httpService.getEmployeeList(obj).subscribe((data) => {
      //this.eva = data;
      if (data) {
        // console.log("evaluator data", data);
        this.employeeList = data;
        this.getMerchandisersEmployee();
            this.getSupervisorsEmployee();
            this.getManagersEmployee();
        this.loadingData = false;
      }
      this.loadingData = false;
    });
  }

  getMerchandisersEmployee(){
    this.merchandiserEmployeeList = [];
    for (const employee of this.employeeList) {
      if (employee.employee_type == 'MERCHANDISER') {
        this.merchandiserEmployeeList.push(employee);
      }
    }
    // const noSuperVisor={
    //   supervisorList.
    // };
    this.merchandiserFilteredEmployees = this.merchandiserEmployeeList;
    console.log(this.merchandiserEmployeeList);
  }

  getSupervisorsEmployee() {
    this.supervisorEmployeeList = [];
    for (const employee of this.employeeList) {
      if (employee.employee_type == 'SUPERVISOR') {
        this.supervisorEmployeeList.push(employee);
      }
    }
    // const noSuperVisor={
    //   supervisorList.
    // };
    this.supervisorFilteredEmployees = this.supervisorEmployeeList;
    console.log(this.supervisorEmployeeList);
  }

  getManagersEmployee() {
    this.managerEmployeeList = [];
    for (const employee of this.employeeList) {
      if (employee.employee_type == 'PROJECT_MANAGER') {
        this.managerEmployeeList.push(employee);
      }
    }
    // const noSuperVisor={
    //   supervisorList.
    // };
    this.managerFilteredEmployees = this.managerEmployeeList;
    console.log(this.managerEmployeeList);
  }

  selectEmployee(employee: any) {
    this.form.get('employeeId').setValue(employee.employee_id);
    this.searchTerm = '';
    this.merchandiserFilteredEmployees = this.merchandiserEmployeeList;
  }

  onNotifyClicked(filteredlist: any){
    console.log(this.filteredList)
    this.merchandiserFilteredEmployees=filteredlist;
  }
  filteredList(filteredList: any) {
    throw new Error("Method not implemented.");
  }

  onNotifyClickedSupervisor(filteredlist: any){
    console.log(this.filteredList)
    this.supervisorFilteredEmployees=filteredlist;
  }

  onNotifyClickedManager(filteredlist: any){
    console.log(this.filteredList)
    this.managerFilteredEmployees=filteredlist;
  }

  onKey(value) {
    this.merchandiserFilteredEmployees = this.search(value);
  }

  search(value: string) {
    let filter = value.toLowerCase();
    // return this.merchandiserEmployeeList.filter((option) =>
    //   option.employee_name.toLowerCase().startsWith(filter)
    // );

    return this.merchandiserEmployeeList.filter((x) =>
    Object.keys(x).some((key) =>
      String(x[key]).toLowerCase().includes(value.toLowerCase())
    )
  );
  }
  // employe list working end

}
