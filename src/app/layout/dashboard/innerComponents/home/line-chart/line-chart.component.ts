import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseChartDirective, Color } from "ng2-charts";
import { ChartDataSets, ChartOptions } from "chart.js";
import { DashboardService } from "../../../dashboard.service";
@Component({
  selector: "line-chart",
  templateUrl: "./line-chart.component.html",
  styleUrls: ["./line-chart.component.scss"],
})
export class LineChartComponent implements OnInit {
  constructor(private httpService: DashboardService) {}

  chartData: any = [];
  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;
  public lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: "Productive" },
    { data: [8, 48, 40, 19, 86, 27, 90], label: "Successful" },
    // { data: [180, 480, 90, 270, 400], label: 'Series C', yAxisID: 'y-axis-1' }
  ];
  public lineChartLabels: any[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];
  public lineChartOptions: ChartOptions = {
    responsive: true,
    elements: {
      line: {
        tension: 0,
      },
    },
  };
  public lineChartColors: Color[] = [
    // { // grey
    //   backgroundColor: 'rgba(148,159,177,0.2)',
    //   borderColor: 'rgba(148,159,177,1)',
    //   pointBackgroundColor: 'rgba(148,159,177,1)',
    //   pointBorderColor: '#fff',
    //   pointHoverBackgroundColor: '#fff',
    //   pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    // },
    // { // dark grey
    //   backgroundColor: 'rgba(77,83,96,0.2)',
    //   borderColor: 'rgba(77,83,96,1)',
    //   pointBackgroundColor: 'rgba(77,83,96,1)',
    //   pointBorderColor: '#fff',
    //   pointHoverBackgroundColor: '#fff',
    //   pointHoverBorderColor: 'rgba(77,83,96,1)'
    // },
    {
      // red
      // backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: "red",
      pointBackgroundColor: "rgba(148,159,177,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(148,159,177,0.8)",
    },
    {
      // green
      // backgroundColor: '#AFFCAF',
      borderColor: "green",
      pointBackgroundColor: "rgba(148,159,177,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(148,159,177,0.8)",
    },
  ];
  public lineChartLegend = true;
  public lineChartType = "line";

  ngOnInit() {
    this.httpService.getLineChartData().subscribe(
      (data) => {
        const res: any = data;

        this.chartClicked = res;
        this.lineChartData[0].data = res.completion;
        this.lineChartData[1].data = res.successfull;
        this.lineChartLabels = res.date;
      },
      (error) => {}
    );
  }
  // public lineChartPlugins = [pluginAnnotations];

  // public randomize(): void {
  //   for (let i = 0; i < this.lineChartData.length; i++) {
  //     for (let j = 0; j < this.lineChartData[i].data.length; j++) {
  //       this.lineChartData[i].data[j] = this.generateNumber(i);
  //     }
  //   }
  //   this.chart.update();
  // }

  private generateNumber(i: number) {
    return Math.floor(Math.random() * (i < 2 ? 100 : 1000) + 1);
  }

  // events
  public chartClicked({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  // public hideOne() {
  //   const isHidden = this.chart.isDatasetHidden(1);
  //   this.chart.hideDataset(1, !isHidden);
  // }

  public pushOne() {
    this.lineChartData.forEach((x, i) => {
      const num = this.generateNumber(i);
      const data: number[] = x.data as number[];
      data.push(num);
    });
    this.lineChartLabels.push(`Label ${this.lineChartLabels.length}`);
  }

  public changeColor() {
    this.lineChartColors[2].borderColor = "green";
    this.lineChartColors[2].backgroundColor = `rgba(0, 255, 0, 0.3)`;
  }

  public changeLabel() {
    this.lineChartLabels[2] = ["1st Line", "2nd Line"];
    // this.chart.update();
  }
}
