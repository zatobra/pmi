import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-payroll-unprocess',
  templateUrl: './payroll-unprocess.component.html',
  styleUrls: ['./payroll-unprocess.component.scss']
})
export class PayrollUnprocessComponent implements OnInit {
  dashboardService: DashboardService;
  monthlist: string[] = [];
  selectedMonthDate: string;
  fuelPriceForm: FormGroup; // Reactive form group
  fuelprice1: any;
  fuelprice2: any;
  id:any;
  // monthdate:Date;
  showFuelPrices: boolean = false;
  month:String;
  loadingData: boolean ;
  loadingModal: boolean ;
  payRoll: boolean;
  monthIds: string[] = [];
  monthDate: any;
  selectedDate: any; // Declare selectedDate

  constructor(private httpService: DashboardService, private fb: FormBuilder,private toaster: ToastrService ) { 
    this.dashboardService = httpService;
    this.fuelPriceForm = this.fb.group({
      fuelprice1: [null, Validators.required],
      fuelprice2: [null, Validators.required],
    });
  }
  

  ngOnInit(): void {
    
   
      this.getmonths();
   
    
  }

  getmonths() {
    this.loadingData = true;
    // const updateData = { month: "aa",id:1, };
    const obj = {
      requestType : 'unprocessMonth'
    }
    // const updateData = { month:selectedMonth.month,id:selectedMonth.id};
    debugger;
    this.httpService.getPayrollUnprocessMonth(obj).subscribe(
      (response: any[]) => {
        // this.monthlist = response.map((item) => item.MONTH_NAME);
        // this.monthIds = response.map((item) => item.id);
        // this.monthDate = response.map((item) => item.salary_month);
        // this.fuelprice1 = null;
        // this.fuelprice2 = null;
        this.monthlist = response;
        this.loadingData = false;
        // Update the reactive form values
        // this.selectedDate = this.monthDate[0];
        console.log(this.monthDate);
      },
      (error) => {
        this.loadingData=false;
        console.error('API Error:', error);
      }
    );
  }

  saveData() {
    this.loadingData = true;
    const obj = {
      requestType : 'saveData',
      date : this.selectedMonthDate
    }
      this.httpService.savePayrollUnprocess(obj).subscribe(
        (response) => {
          this.toaster.success('Updated successfully.');
          //this.getfuelprice();
          this.getmonths();
          this.loadingData = false;
        },
        (error) => {
          this.toaster.error('Error updating fuel prices.');
          this.loadingData = false;
        }
      );
  }
  

 

  // Helper method to update the form values
  private updateForm() {
    this.fuelPriceForm.patchValue({
      fuelprice1: this.fuelprice1,
      fuelprice2: this.fuelprice2,
    });
  }
  
  // saveFuelPrices() {
  //   // Check if the form is valid
  //   this.loadingData = true;
  //   debugger;
  //     const obj = {
  //        f1:0.0, f2:0.0,id:0,
  //       date: this.selectedDate // Use selectedDate
  //     };

  //     debugger;
  //     console.log(obj, "11");

  //     this.httpService.updatef1f2(obj).subscribe(
  //       (response) => {
  //         this.toaster.success('Updated successfully.');
  //         //this.getfuelprice();
  //         this.getmonths();
  //         this.loadingData = false;
  //       },
  //       (error) => {
  //         this.toaster.error('Error updating fuel prices.');
  //         this.loadingData = false;
  //       }
  //     );
    
  // }
}

