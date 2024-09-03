import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Config } from "src/assets/config";
import { DashboardService } from "../../../dashboard.service";
import { environment } from "src/environments/environment";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "spinner-animation",
  templateUrl: "./spinner-animation-component.html",
  styleUrls: ["./spinner-animation-component.scss"],
})
export class SpinnerAnimationComponent implements OnInit, AfterViewInit {
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
  prizesList: any = [];
  prizesListWithWinnersCount: any = [];
  prizeId: any;

  @ViewChild("counter") counterElement!: ElementRef;
  @ViewChild("counter2") counterElement2!: ElementRef;
  dataFinalValues: any = ["r", "a", "o", "f", "a", "r", "h", "a", "n"];
  dataFinalValues2: any = ["x", "x", "x", "x", "x", "x"];
  // dataFinalValues2: any = ["", "", "", "", "", ""];
  buttonEnable: boolean = true;

  constructor(
    public formBuilder: FormBuilder,
    private httpService: DashboardService,
    private toastr: ToastrService,
    private changede: ChangeDetectorRef
  ) {
    this.form = formBuilder.group({
      fileId: new FormControl("", Validators.required),
    });
  }
  ngAfterViewInit(): void {
    //  this.count();
  }

  ngOnInit() {
   
    this.getSpinTheWheelFilesList();
    // this.getSpinTheWheelPrizesList();
    this.getSpinTheWheelPrizesListWithWinnersCount();
    const that= this;
    document.addEventListener("visibilitychange", function (e) {
      if (!document.hidden) {
        that.getSpinTheWheelPrizesListWithWinnersCount();
      }
    });
  }

  getSpinTheWheelFilesList() {
    this.loadingData = true;
    console.log("getSpinTheWheelFilesList");
    this.httpService.getSpinTheWheelFilesList().subscribe(
      (data) => {
        const res: any = data;
        if (res?.length>0) {
          this.filesList = res;
        } else {
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

  getSpinTheWheelPrizesList() {
    console.log("getSpinTheWheelFilesList");
    this.loadingData = true;
    this.httpService.getSpinTheWheelPrizesList().subscribe(
      (data) => {
        const res: any = data;
        if (res) {
          this.prizesList = res;
        } else {
          this.toastr.info("No Prize Found", "Info");
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

  getSpinTheWheelPrizesListWithWinnersCount(){
    const fileId = this.form.get("fileId").value;
    console.log("getSpinTheWheelPrizesListWithWinnersCount");
    this.loadingData = true;
    this.httpService.getSpinTheWheelPrizesListWithWinnersCount(fileId || -1).subscribe(
      (data) => {
        const res: any = data;
        if (res) {
          this.prizesListWithWinnersCount = res;
        } else {
          this.toastr.info("No Prize Found", "Info");
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

  startSpinner() {
    this.hasMessage = false;
    this.spinnerMessage = null;
    this.buttonEnable = false;
    this.dataFinalValues = [];
    this.hasSpinner = true;
    this.count2();
    
    const fileId = this.form.get("fileId").value;
    this.httpService.startSpinTheWheel(fileId, this.prizeId, 1).subscribe(
      (data) => {
        const res: any = data;
        if (res) {
          
          this.spinnerMessage = res;
          let arr = this.spinnerMessage?.outlet_code;
          let newArr = [...arr];
          // 
          // yahn se start
          this.dataFinalValues = newArr;
          this.count();
          // this.count2();
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

  onRadioButtonChange(event) {
    console.log("event.value=" + event.value);
    console.log("this.prizeId=" + this.prizeId);
  }

  count() {
    
    const dataFinalValues: any = this.dataFinalValues;
    console.log("dataFinalValues", this.dataFinalValues);
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const string = numbers + letters;

    setTimeout(() => {
      // this.loadingData = false;
      // this.hasSpinner = false;
      // this.hasMessage = true;
      let k = 0;
      
      const elements = this.counterElement.nativeElement.querySelectorAll("i");
      // const elements = document.querySelectorAll('.counter > i');
      if (elements.length > 0) {
        elements.forEach(function (el: HTMLElement, i) {
          k++;
          var duration = 1000 + Array.from(elements).indexOf(el) * 1000;
          var interval = setInterval(function () {
            el.innerText = string.charAt(Math.random() * string.length);
            // this.changede.detectChanges();
            duration = duration - 50;
            if (duration <= 0) {
              clearInterval(interval);
              // el.innerText = el.getAttribute("data-final");
              el.innerText = dataFinalValues[i];
              // this.changede.detectChanges();
            }
          }, 50);
          console.log("i:", i);
          console.log("elements.length:", elements.length);
          if(i==elements.length-1){
            this.buttonEnable = true;
          }
          
        });
        // debugger;
        // this.buttonEnable = true;
      }

      console.log("k:", k);
      
    }, 30);
  }

  count2() {
    
    // const dataFinalValues: any = this.dataFinalValues;
    console.log("dataFinalValues", this.dataFinalValues);
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const string = numbers + letters;

    // setTimeout(() => {
      // this.loadingData = false;
      // this.hasSpinner = false;
      // this.hasMessage = true;
      let k = 0;
      
      let elements;
      if(this.counterElement2){
        elements = this.counterElement2.nativeElement.querySelectorAll("i");
      }
      else{
        elements = this.counterElement.nativeElement.querySelectorAll("i");
      }
      
      // const elements = document.querySelectorAll('.counter > i');
      if (elements.length > 0) {
        elements.forEach(function (el: HTMLElement, i) {
          k++;
          var duration = 1000 + Array.from(elements).indexOf(el) * 1000;
          var interval = setInterval(function () {
            el.innerText = string.charAt(Math.random() * string.length);
            // this.changede.detectChanges();
            // duration = duration - 50;
            if (duration <= 0) {
              clearInterval(interval);
              // el.innerText = el.getAttribute("data-final");
              el.innerText = this.dataFinalValues2[i];
              // this.changede.detectChanges();
            }
          }, 50);
        });
      }

      console.log("k:", k);
    // }, 1000);
  }

  countNew() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const string = numbers + letters;

    this.dataFinalValues.forEach((value, index) => {
      var duration =
        1000 + Array.from(this.dataFinalValues).indexOf(value) * 1000;
      const interval = setInterval(() => {
        this.dataFinalValues[index] = string.charAt(
          Math.floor(Math.random() * string.length)
        );
        duration = duration - 50;
        if (duration <= 0) {
          clearInterval(interval);
          this.dataFinalValues[index] = value;
        }
      }, 50);
    });
  }

  // gotoSpinnerDraw(prize?){
  //   window.open(
  //     `${environment.hash}dashboard/spinner-animation-draw?fileId=${this.form.get("fileId").value}&prizeId=${prize?.id}&prizeCategory=${prize?.category}`,
  //     "_blank"
  //   );
  // }

  gotoSpinnerDraw(prize?){
    window.open(
      `${environment.hash}dashboard/spinner-animation-draw-new?fileId=${this.form.get("fileId").value}&prizeId=${prize?.id}&prizeCategory=${prize?.category}`,
      "_blank"
    );
  }
}
