import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payroll-process',
  templateUrl: './payroll-process.component.html',
  styleUrls: ['./payroll-process.component.scss']
})
export class PayrollProcessComponent implements OnInit {
  dashboardService: DashboardService;
  monthlist: string[] = [];
  selectedMonthDate = '';
  selectedMonthName: string;
  fuelPriceForm: FormGroup; // Reactive form group
  fuelprice1: any;
  fuelprice2: any;
  id:any;
  monthdate:Date;
  showFuelPrices: boolean = false;
  month:String;
  loadingData: boolean ;
  loadingModal: boolean ;
  payRoll: boolean;
  monthIds: string[] = [];

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
      requestType : 'processMonth'
    }
    // const updateData = { month:selectedMonth.month,id:selectedMonth.id};
    this.httpService.getPayrollProcessMonth(obj).subscribe(
      (response: any[]) => {
        debugger;
        // this.monthlist = response.map((item) => item.MONTH_NAME);
        this.monthlist = response;
        this.monthIds = response.map((item) => item.id);
        // this.fuelprice1 = null;
        // this.fuelprice2 = null;
        this.loadingData = false;
        // Update the reactive form values
        
      },
      (error) => {
        this.loadingData=false;
        console.error('API Error:', error);
      }
    );
  }
  

  // getfuelprice(selectedMonth: { month: string, id: any }) {
  //   console.log("Selected Month: ", selectedMonth.month);
  //   console.log("Selected ID: ", selectedMonth.id);
  //   debugger;
    
  //   this.loadingData = true;
  //   const updateData = { month:selectedMonth.month,id:selectedMonth.id};
  //   this.httpService.gethrsallery_months(updateData).subscribe(
  //     (response: any[]) => {
  //       if (response.length > 0) {
  //         for (let i = 0; i < response.length; i++) {
  //           const element = response[i];
  //           this.fuelprice1 = element.fuel_price_1;
  //           this.fuelprice2 = element.fuel_price_2;
  //           this.id = element.id;
  //           this.monthdate = element.salary_month;
  //           this.month=element.months
  //           this.updateForm(); // Update the reactive form values
  //           // this.getmonths();
  //           this.loadingData = false;
  //         }
  //         // Set showFuelPrices to true when data is available
  //         this.showFuelPrices = true;
  //       } else {
  //         this.loadingData = false;
  //         console.error('API Error: Empty response array');
  //       }
  //     },
  //     (error) => {
  //       this.loadingData = false;
  //       console.error('API Error:', error);
  //     }
  //   );
  // }
  

  // Helper method to update the form values
  private updateForm() {
    this.fuelPriceForm.patchValue({
      fuelprice1: this.fuelprice1,
      fuelprice2: this.fuelprice2,
    });
  }
  saveData() {
    this.loadingData = true;
    const obj = {
      requestType : 'saveData',
      date : this.selectedMonthDate
    }
      this.httpService.savePayrollProcess(obj).subscribe(
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
}

