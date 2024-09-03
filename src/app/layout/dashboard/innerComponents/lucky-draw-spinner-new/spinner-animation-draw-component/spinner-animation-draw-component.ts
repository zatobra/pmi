import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Config } from "src/assets/config";
import { DashboardService } from "../../../dashboard.service";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";

@Component({
  selector: "spinner-animation-draw",
  templateUrl: "./spinner-animation-draw-component.html",
  styleUrls: ["./spinner-animation-draw-component.scss"],
})
export class SpinnerAnimationDrawComponent implements OnInit, AfterViewInit {
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
  spinnerWinnersList : any = []
  spinnerMessage: any ;
  prizesList: any = [];
  prizesListWithWinnersCount: any = [];
  prizeId: any;

  @ViewChild("counter") counterElement!: ElementRef;
  @ViewChild("counter2") counterElement2!: ElementRef;
  dataFinalValues: any = ["r", "a", "o", "f", "a", "r", "h", "a", "n"];
  dataFinalValues2: any = ["X", "X", "X", "X", "X", "X","X", "X", "X", "X", "X","X"];
  // dataFinalValues2: any = ["", "", "", "", "", ""];
  buttonEnable: boolean = true;
  params: any = {};

  constructor(
    public formBuilder: FormBuilder,
    private httpService: DashboardService,
    private toastr: ToastrService,
    private changede: ChangeDetectorRef,
    private activatedRoutes: ActivatedRoute,
    private readonly location: Location,
    private ngZone: NgZone
  ) {
    this.form = formBuilder.group({
      fileId: new FormControl("", Validators.required),
    });

    this.activatedRoutes.queryParams.subscribe((q) => {
      this.params = q;
    });
  }

  ngAfterViewInit(): void {
    //  this.count();
  }

  ngOnInit() {
    // this.getSpinTheWheelFilesList();
    // this.getSpinTheWheelPrizesList();
    // this.getSpinTheWheelPrizesListWithWinnersCount();
  }

  getSpinTheWheelFilesList() {
    this.loadingData = true;
    console.log("getSpinTheWheelFilesList");
    this.httpService.getSpinTheWheelFilesList().subscribe(
      (data) => {
        const res: any = data;
        if (res) {
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
    console.log("getSpinTheWheelPrizesListWithWinnersCount");
    this.loadingData = true;
    this.httpService.getSpinTheWheelPrizesListWithWinnersCount(-1).subscribe(
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
    
    // const fileId = this.form.get("fileId").value;
    this.httpService.startSpinTheWheel(this.params.fileId, this.params.prizeId, 1).subscribe(
      (data) => {
        const res: any = data;
        // if ('id' in res) {
          if (res.length>0) {
          this.spinnerWinnersList = res;
          this.spinnerMessage = this.spinnerWinnersList[0];
          let arr = this.spinnerMessage?.outlet_code;
          let newArr = [...arr];
          // 
          // yahn se start
          this.dataFinalValues = newArr;
          this.count();
          // this.count2();
          console.log("this.spinnerMessage", this.spinnerMessage);
        }
       else  {
          this.toastr.info("No Data Found", "Info");
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
    let counter= 0;
    debugger;

    setTimeout(() => {
      
      debugger;
      const elements = this.counterElement.nativeElement.querySelectorAll("i");
      // const elements = document.querySelectorAll('.counter > i');
      if (elements.length > 0) {
        //  elements.forEach(function (el: HTMLElement, i) {
          // const that=this;
          const executeIntervalPromise = new Promise<void>((resolve) => {
          elements.forEach( (el: HTMLElement, i) => {
            // console.log("in foreach i: "+ i);
            debugger;
          // var duration = 1000 + Array.from(elements).indexOf(el) * 1000;
          var duration = 500;
          // console.log("in foreach duration: "+ duration);
          // var interval = setInterval(function () {
            // const that2=that;
            const interval = setInterval(() => {
            // console.log("in setInterval duration: "+ duration);

              debugger;
            el.innerText = string.charAt(Math.random() * string.length);
            duration = duration - 10;
            // console.log("in setInterval duration2: "+ duration);
            if (duration <= 0) {
              debugger;
              // console.log("duration <= 0: "+ duration);
              clearInterval(interval);
              resolve();
              // el.innerText = el.getAttribute("data-final");
              el.innerText = dataFinalValues[i];
              counter++;
              // Check if all elements have been processed
             if (counter == elements.length) {
            debugger;
             this.buttonEnable = true;
             this.toastr.info(this.spinnerMessage?.outlet_name, "Winner is");
            // that2.buttonEnable = true;
           
          
            //  this.ngZone.run(() => {
            //   this.buttonEnable = true;
            // });

            //  this.changede.detectChanges();
            

             }
            }
          }, 100);
        });
      });
      }

      
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
      let counter = 0;
      
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
}
