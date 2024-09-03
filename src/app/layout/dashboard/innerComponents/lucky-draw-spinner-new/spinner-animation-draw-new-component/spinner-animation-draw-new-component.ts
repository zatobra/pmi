import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
  Renderer2
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
import * as confetti from 'canvas-confetti';
import { interval } from "rxjs";
import { PausableObservable, pausable } from 'rxjs-pausable';

@Component({
  selector: "spinner-animation-draw-new",
  templateUrl: "./spinner-animation-draw-new-component.html",
  styleUrls: ["./spinner-animation-draw-new-component.scss"],
})
export class SpinnerAnimationDrawNewComponent implements OnInit, AfterViewInit {
  hasSpinner: boolean = false;
  hasMessage: boolean = false;
  main_logo = Config.main_logo;
  showStartButton = true ;
  @ViewChild("ele") ele : ElementRef;

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
  spinnerWinnersList: any = [];
  prizesList: any = [];
  prizesListWithWinnersCount: any = [];
  prizeId: any;
  // totalWinners: number = 1;
  totalWinners = 1;
  showWinners = false;

  @ViewChild("counter") counterElement!: ElementRef;
  @ViewChild("counter2") counterElement2!: ElementRef;
  dataFinalValues: any = ["r", "a", "o", "f", "a", "r", "h", "a", "n"];
  dataFinalValues2: any = ["X", "X", "X", "X", "X", "X","X", "X", "X", "X", "X","X"];
  // dataFinalValues2: any = ["", "", "", "", "", ""];
  buttonEnable: boolean = true;
  params: any = {};
  clicked: boolean = false;
  filteredTable: any = [];

  constructor(
    public formBuilder: FormBuilder,
    private httpService: DashboardService,
    private toastr: ToastrService,
    private changede: ChangeDetectorRef,
    private activatedRoutes: ActivatedRoute,
    private readonly location: Location,
    private ngZone: NgZone,
    private renderer2: Renderer2,
    private elementRef: ElementRef
  ) {
    this.form = formBuilder.group({
      fileId: new FormControl("", Validators.required),
    });

    this.activatedRoutes.queryParams.subscribe((q) => {
      this.params = q;
    });
    this.showStartButton = true;
  }

  ngAfterViewInit(): void {
    //  this.count();
  }
  paused = true;
  pausable: PausableObservable<number>;

  ngOnInit() {
    // this.getSpinTheWheelFilesList();
    // this.getSpinTheWheelPrizesList();
    // this.getSpinTheWheelPrizesListWithWinnersCount();



    this.shoot();
    this.pausable = interval(800)
      .pipe(pausable()) as PausableObservable<number>;
    this.pausable.subscribe(this.shoot.bind(this));
    this.pausable.pause();

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
    this.showStartButton = false;
    this.filteredTable = [];
    this.hasMessage = false;
    this.spinnerWinnersList = null;
    this.buttonEnable = false;
    this.dataFinalValues = [];
    this.hasSpinner = true;
    this.count2();
    
    // const fileId = this.form.get("fileId").value;
    this.httpService.startSpinTheWheel(this.params.fileId, this.params.prizeId, this.totalWinners).subscribe(
      (data) => {
        const res: any = data;
        // if ('id' in res) {
          if (res.length>0) {
          
          this.spinnerWinnersList = res;
          this.filteredTable.push(this.spinnerWinnersList[0]);
          let arr = res.length + ' Lucky Winners';
          let newArr = [...arr];
          // 
          // yahn se start
          this.dataFinalValues = newArr;
          this.count();
          // this.count2();
          console.log("this.spinnerWinnersList", this.spinnerWinnersList);
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
    ;

    setTimeout(() => {
      
      ;
      const elements = this.counterElement.nativeElement.querySelectorAll("i");
      // const elements = document.querySelectorAll('.counter > i');
      if (elements.length > 0) {
        //  elements.forEach(function (el: HTMLElement, i) {
          // const that=this;
          // const executeIntervalPromise = new Promise<void>((resolve) => {
          elements.forEach( (el: HTMLElement, i) => {
            // console.log("in foreach i: "+ i);
            ;
          // var duration = 1000 + Array.from(elements).indexOf(el) * 1000;
          var duration = 300;
          // console.log("in foreach duration: "+ duration);
          // var interval = setInterval(function () {
            // const that2=that;
            const interval = setInterval(() => {
            // console.log("in setInterval duration: "+ duration);

              ;
            el.innerText = string.charAt(Math.random() * string.length);
            duration = duration - 10;
            // console.log("in setInterval duration2: "+ duration);
            if (duration <= 0) {
              ;
              // console.log("duration <= 0: "+ duration);
              clearInterval(interval);
              // resolve();
              // el.innerText = el.getAttribute("data-final");
              el.innerText = dataFinalValues[i];
              counter++;
              // Check if all elements have been processed
             if (counter == elements.length) {
            ;
             this.buttonEnable = true;
            //  this.toastr.info(this.spinnerWinnersList?.outlet_name, "Winner is");
            // that2.buttonEnable = true;
           
          
            //  this.ngZone.run(() => {
            //   this.buttonEnable = true;
            // });

            //  this.changede.detectChanges();
            

             }
            }
          }, 100);
        });
      // });
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

  showWinnersList(){
    this.showWinners= true;
    this.surprise();
    // this.toggle();
  }

  // hideWinnersList(){
  //   this.showWinners= false;
  // }

  public surprise(): void {
    const canvas = this.renderer2.createElement('canvas');

    setTimeout(()=>{

      // const canvas = this.renderer2.createElement('canvas');
    // this.renderer2.appendChild(this.elementRef.nativeElement, canvas);

    // const targetDiv = this.elementRef.nativeElement.querySelector('#containerDiv');
    // const canvas = this.renderer2.createElement('canvas');
    // this.renderer2.appendChild(targetDiv, canvas);
    debugger;

   
    // this.renderer2.appendChild(this.ele.nativeElement, canvas);

    document.body.appendChild(canvas);

    // this.renderer2.appendChild(this.elementRef.nativeElement, canvas);


    // const targetDiv = document.getElementById('targetDiv');
//     element = this.counterElement2.nativeElement.querySelector("i");
// targetDiv.appendChild(canvas);
 
    const myConfetti = confetti.create(canvas, {
      resize: true // will fit all screen sizes
    });


 

    // myConfetti();


    // myConfetti({
    //   particleCount: 1000,
    //   spread: 360,
    //   ticks : 4200,
    //   zIndex : 101,
    //   // origin: {
    //   //   x: Math.random(),
    //   //   // since they fall down, start a bit higher than random
    //   //   y: Math.random() - 0.2
    //   // }
    //   // any other options from the global
    //   // confetti function
    // });


    // working
    var duration = 15 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }
    var interval = setInterval(function() {
      var timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      var particleCount = 150 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      myConfetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      myConfetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);



    
    //working
    // var duration = 15 * 1000;
    // var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }; 
    // function randomInRange(min, max) {
    //   // const randomInRange = (min, max)=> {
    //   return Math.random() * (max - min) + min;
    // }
    // function popConfetti() {
    //   var animationEnd = Date.now() + duration;
    //   function pop() {
    //     var timeLeft = animationEnd - Date.now();
    //     if (timeLeft <= 0) {
    //       // Call popConfetti recursively to continue popping confetti indefinitely
    //       popConfetti();
    //       return;
    //     }
    //     var particleCount = 150 * (timeLeft / duration);
    //     // since particles fall down, start a bit higher than random
    //     myConfetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
    //     myConfetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    
    //     // Call the pop function recursively after a delay (e.g., 250ms)
    //     setTimeout(pop, 250);
    //   }
    //   // Start the initial popping
    //   pop();
    // }
    // // Start the confetti popping
    // popConfetti();




// var end = Date.now() + (15 * 1000);
// var colors = ['#bb0000', '#ffffff'];
// (function frame() {
//   myConfetti({
//     particleCount: 2,
//     angle: 60,
//     spread: 180,
//     origin: { x: 0 },
//     colors: colors
//   });
//   myConfetti({
//     particleCount: 2,
//     angle: 120,
//     spread: 180,
//     origin: { x: 1 },
//     colors: colors
//   });
//   if (Date.now() < end) {
//     requestAnimationFrame(frame);
//   }
// }());



 
    this.clicked = true;

    }, 30)
 
    
  }

  toggle() {
    if (this.paused) {
      this.pausable.resume();
    } 
    else {
      this.pausable.pause();
    }
    this.paused = !this.paused;
  }

  shoot() {
    try {
      this.confetti({
        angle: this.random(60, 120),
        spread: this.random(10, 50),
        particleCount: this.random(40, 50),
        origin: {
            y: 0.6
        }
      });
    } catch(e) {
      // noop, confettijs may not be loaded yet
    }
  }

  random(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  confetti(args: any) {
    return window['confetti'].apply(this, arguments);
  }

  addDataInList(){
    if(this.filteredTable.length == this.spinnerWinnersList.length){
      this.toastr.info("No More Winner", "Info")
    }
    else{
      this.filteredTable.push(this.spinnerWinnersList[this.filteredTable.length]);
    }
    
  }
  
}
