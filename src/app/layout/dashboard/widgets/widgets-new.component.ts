import {
  AfterContentChecked,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  ChangeDetectorRef,
  HostListener,
} from "@angular/core";
import { DashboardService } from "../dashboard.service";
import { Config } from "src/assets/config";
import { ToastrService } from "ngx-toastr";
import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";
import * as moment from "moment";
import { Color, Label, MultiDataSet } from "ng2-charts";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-widgets-new",
  templateUrl: "./widgets-new.component.html",
  styleUrls: ["./widgets-new.component.scss"],
  encapsulation: ViewEncapsulation.Emulated,
})
export class WidgetsNewComponent implements OnInit {

  iconClasses = [
    'fa fa-briefcase fa-2x','fa fa-bullseye fa-2x','fa fa-binoculars fa-2x','fa fa-bandcamp fa-2x','fa fa-universal-access fa-2x',
    'fa fa-briefcase fa-2x','fa fa-bullseye fa-2x','fa fa-binoculars fa-2x','fa fa-bandcamp fa-2x','fa fa-universal-access fa-2x',
  ];
  bgClasses = [
    'bg-c-red','bg-c-orange','bg-c-green','bg-c-blue','bg-c-purple','bg-c-pink','bg-c-cyan','bg-c-gray'
  ]

  iconList = [
    {value: '', iconClass:'', bgClass: ''},
    {value: '', iconClass:'', bgClass: ''},
    {value: '', iconClass:'', bgClass: ''},
    {value: '', iconClass:'', bgClass: ''},
    {value: '', iconClass:'', bgClass: ''},
    {value: '', iconClass:'', bgClass: ''},
  ];


  barList = [
    {value: '',  bgClass: ''},
    {value: '',  bgClass: ''},
    {value: '',  bgClass: ''},
    {value: '',  bgClass: ''},
    {value: '',  bgClass: ''},
    {value: '',  bgClass: ''},
  ];

  doughnetList = [
    {value: '',  bgClass: ''},
    {value: '',  bgClass: ''},
    {value: '',  bgClass: ''},
    {value: '',  bgClass: ''},
    {value: '',  bgClass: ''},
    {value: '',  bgClass: ''},
  ];

  barChartList = [
    {
      values: [[70,80,90, 100, 30,25]], 
      titles: [["Productivity %"],["Unscuceful"], ["Sucesful"], ["OUt of route"], ["OUt of "], ["Inbound "]], 
      iconClass:'', 
      bgClass: ''
    },
  ];


  // charts
  public doghnutChartOptions: ChartOptions = {
    responsive: true,
    defaultColor: "red",
    legend: {
      display: false,
      //   display: true,
      //   labels:{
      //     fontSize: 5,
      //     fontColor: 'red',
      // }
    },

    // title: {
    //   display: true,
    //   text: 'heellllo',
    //   fontSize: 20
    // },

    plugins: {
      labels: {
        align: "bottom",
        backgroundColor: "#ccc",
        borderRadius: 3,
        font: {
          size: 18,
        },
      },
    },
  };

//   interface ChartFontOptions {
//     defaultFontColor?: ChartColor | undefined;
//     defaultFontFamily?: string | undefined;
//     defaultFontSize?: number | undefined;
//     defaultFontStyle?: string | undefined;
// }

  public barChartOptions: ChartOptions = {
    responsive: true,
    defaultColor: "red",
    tooltips:{bodyFontColor: "red",footerFontColor: "red"},
    legend: {
      display: false,
      //   display: true,
      //   labels:{
      //     fontSize: 5,
      //     fontColor: 'red',
      // }
    },

    // title: {
    //   display: true,
    //   text: 'heellllo',
    //   fontSize: 20
    // },

    plugins: {
      labels: {
        align: "bottom",
        backgroundColor: "#ccc",
        borderRadius: 3,
        font: {
          size: 18,
        },
      },
    },
  };



  doughnutChartLabels: Label[] = [
    "Successful         %",
    "                              ",
  ];
  doughnutChartLabels2: Label[] = [
    "Productivity        %",
    "                            ",
  ];
  doughnutChartLabels3: Label[] = [
    "Unvisited          %",
    "                               ",
  ];
  ChartDataSets


  barChartLabels: Label[] = [
    ["Productivity %"],["Unscuceful"], ["Sucesful"], ["OUt of route"], ["OUt of "], ["Inbound "]
  ];
  barChartDataN: MultiDataSet = [
   [70,80,90, 100, 30,25]
  ];
    // barChartColors: Color = 
    // {
    //   backgroundColor: ["#121110", "#E1A7BA"],
    // };

    barChartColors: Color[] = [
      {
        backgroundColor: ["blue", "#45bf43","gray","indigo","purple", "brown"],
      }
    ];

  // doughnutChartLabels: Label[] = [];
  // doughnutChartLabels2: Label[] = [];
  // doughnutChartLabels3: Label[] = [];
  doughnutChartData: MultiDataSet = [[50, 50]];
  // doughnutChartDatas: SingleDataSet = [50];
  doughnutChartData2: MultiDataSet = [[50, 50]];
  doughnutChartData3: MultiDataSet = [[50, 50]];
  doughnutChartType: ChartType = "doughnut";
  barChartType: ChartType = "bar";
  colors: Color[] = [
    {
      backgroundColor: ["#1B28B4", "#ACA7E1"],
    },
  ];
  colors2: Color[] = [
    {
      backgroundColor: [ "#cccccc","#f2f2f2"],
    },
  ];
  colors3: Color[] = [
    {
      backgroundColor: ["#819A04", "#B6BC96"],
    },
  ];
  colors4: Color[] = [
    {
      backgroundColor: ["#047c9a", "#B6BC96"],
    },
  ];
  // charts


  // bar charts
  public barChartLegend = true;
  public barChartPlugins = [];


  

  public barChartData: ChartConfiguration = {
    // labels: [ '2006', '2007', '2008', '2009', '2010', '2011', '2012' ],
    // datasets: [
    //   { data: [ 65, 59, 80, 81, 56, 55, 40 ], label: 'Series A' },
    //   { data: [ 28, 48, 40, 19, 86, 27, 90 ], label: 'Series B' }
    // ]


   
    data:  {
      labels: ['lahore', 'karachi'],
      datasets: [
          { data: [ 65, 59 ], label: 'Series A' },
          { data: [ 28, 48 ], label: 'Series B' }
        ],
  },
    options: {
      responsive: true,
      // aspectRatio?: number,
      maintainAspectRatio: false,
  },

}

  // public barChartOptions: ChartConfiguration = {
  //   responsive: false,
  // };

  //bar charts


  // ip2: any = Config.BASE_URI2;
  ip2: any = Config.BASE_URI;

  statsData: any;
  loadingData: boolean;
  reportId: any;
  queryId: any;

  constructor(
    private toastr: ToastrService,
    private httpService: DashboardService,
    private activatedRoutes: ActivatedRoute,
  ) {
        
  }
  height : any = 25;

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    if(window.innerWidth < 768){
      this.height=10;
      console.log("if window.innerWidth: ",window.innerWidth);
    } 
    else{
      this.height=25;
    }
    console.log("window.innerWidth: ",window.innerWidth);
    // Adjust the breakpoint as needed
  }


  ngOnInit() {
    this.activatedRoutes.params.subscribe((params) => {
      if (params.queryId) {
        this.queryId = params.queryId;
      }
    });
    this.getAppBuilds();
    this.setChartData();
    this.checkScreenSize();
  }

  



  //charts
  setChartData() {

    // this.doughnutChartData = [
    //   [this.dashboardStatsObj.successfulPercent? this.dashboardStatsObj.successfulPercent: 5, 100-this.dashboardStatsObj.successfulPercent]
    // ];
    this.doughnutChartData = [[50, 100 - 50]];
    // this.doughnutChartDatas = [50];
    this.doughnutChartData2 = [[70, 100 - 70]];
    this.doughnutChartData3 = [[70, 100 - 70]];

    // this.doughnutChartData = [
    //   [60, 40]
    // ];
    // this.doughnutChartData2 = [
    //   [70, 30]
    // ];
    // this.doughnutChartData2 = [
    //   [50, 50]
    // ];

    // this.doughnutChartDatas=[
    //   [30]
    // ];
  }
  //charts





  getAppBuilds(){
    this.loadingData = true;
    this.statsData = [];
    const obj = {
      clusterId: -1,
      zoneId: -1,
      regionId: -1,
      distributionId: -1,
      cityId: -1,
      channelId: -1,
      routeId: -1,
      type: 1,
      storeType : null,
      startDate: '2023-12-20',
      endDate: '2023-12-20'
    }
    this.httpService.getDashboardData(obj).subscribe(
      (data: any) => {
        const res: any = data;
        console.log(res);
        if (res) {
          this.statsData = res[0];
          this.loadingData = false;
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

  getIconClass(){
    let bgClasses = [
      'bg-c-red','bg-c-orange','bg-c-green','bg-c-blue','bg-c-purple','bg-c-pink','bg-c-cyan','bg-c-gray'
    ]
  }

  getBgClass(){
    let iconClasses = [
      'fa fa-briefcase','fa fa-thumbs-o-up','fa fa-thumbs-o-down','fa fa-bandcamp','fa-universal-access',
    ]
  }

  dataFeteched(data){
    this.statsData = data;
    console.log("this.statsData", this.statsData);

  }

}
