import { Component, OnInit, ViewChild } from "@angular/core";
import { Config } from "src/assets/config";
import { CSVRecord } from "../CSVModel";
import { DataService } from "../data.service";
import { DashboardService } from "../../../dashboard.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "animation-spinner",
  templateUrl: "./animation-spinner-component.html",
  styleUrls: ["./animation-spinner-component.scss"],
})
export class AnimationSpinnerComponent implements OnInit {
  hasSpinner: boolean = false;
  hasMessage: boolean = false;
  main_logo = Config.main_logo;

  options: any = {
    prefix: "Staff ID ",
    duration: 11,
    separator: "",
  };
  endVal: number;

  staffIdentifier: string;
  staffName: string;

  loadingData: boolean = false;
  form: FormGroup;
  filesList: any = [];
  spinnerMessage: any;

  constructor(
    private dataService: DataService,
    public formBuilder: FormBuilder,
    private httpService: DashboardService,
    private toastr: ToastrService
  ) {
    this.form = formBuilder.group({
      fileId: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    //  this.getSpinTheWheelFilesList();
    //  this.filesList= this.dataService.getSharedData();
    this.getSharedDataFromService();
    this.getSharedDataBooleanFromService();

    // this.filesList =await this.dataService.getSpinTheWheelFilesList();
    // console.log("this.filesList:",this.filesList);
  }

  // doSomethingOnComplete() {
  //   console.log(this.dataService.data);
  //   this.hasAnimationCompleted = true;
  // }

  start() {
    this.endVal = undefined;
    this.staffIdentifier = undefined;
    this.staffName = undefined;
    this.hasSpinner = true;
    this.hasMessage = false;
    if (this.dataService.data && this.dataService.data.length > 0) {
      const min = 0;
      // const max = (this.dataService.data.length) - 1;
      const max = this.dataService.data.length;
      const randomInt = this.getRandomInt(min, max);
      this.staffIdentifier = this.dataService.data[randomInt].staffIdentifier;
      this.staffName = this.dataService.data[randomInt].staffName;
      this.endVal = this.dataService.data[randomInt].staffIdentifier;
      setTimeout(() => {
        this.hasSpinner = false;
        this.hasMessage = true;
      }, 2000);
    } else {
      console.log("No data loaded");
      alert("No file uploaded. Please upload participants.csv");
    }
  }

  /**
   * Returns a random integer between min (inclusive) and max (inclusive).
   * The value is no lower than min (or the next integer greater than min
   * if min isn't an integer) and no greater than max (or the next integer
   * lower than max if max isn't an integer).
   * Using Math.round() will give you a non-uniform distribution!
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
   */
  private getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
    // return Math.floor(Math.random() * max);
  }

  getSpinTheWheelFilesList() {
    console.log("getSpinTheWheelFilesList");
    this.loadingData = true;
    // this.form.get("avatar").setValue(file);
    // const formData = new FormData();
    // formData.append("userId", this.user_id);
    // formData.append("filePath", this.form.get("avatar").value);
    this.httpService.getSpinTheWheelFilesList().subscribe(
      (data) => {
        const res: any = data;
        if (res) {
          this.filesList = res;
        }
        if (!res) {
          this.toastr.info("No Uploaded File Found", "Info");
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

  getSharedDataFromService() {
    this.loadingData = true;
    this.dataService.getSharedData().subscribe(
      (data) => {
        const res: any = data;
        if (res) {
          this.filesList = res;
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

  getSharedDataBooleanFromService() {
    this.loadingData = true;
    this.dataService.getSharedDataBoolean().subscribe(
      (data) => {
        const res: any = data;
        this.loadingData = res;
      }
    );
  }

  startSpinner(){
    this.hasSpinner = true;
    this.hasMessage = false;
    const fileId = this.form.get("fileId").value;
    this.httpService.startSpinTheWheel(fileId, -1, 1).subscribe(
      (data) => {
        const res: any = data;
        if (res) {
          this.spinnerMessage = res;
          console.log("this.spinnerMessage", this.spinnerMessage);
        }
        if (!res) {
          this.toastr.info("No Uploaded File Found", "Info");
        }
        this.loadingData = false;
        this.hasSpinner = false;
        this.hasMessage = true;
      },
      (error) => {
        this.loadingData = false;
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
          this.hasSpinner = false;
           this.hasMessage = true;
      }
      
    );
  }
}
