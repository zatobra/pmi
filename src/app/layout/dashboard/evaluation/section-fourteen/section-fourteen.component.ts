import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-section-fourteen",
  templateUrl: "./section-fourteen.component.html",
  styleUrls: ["./section-fourteen.component.scss"],
})
export class SectionFourteenComponent implements OnInit {
  @Input("data") data;
  surveyCompliance: any;
  userType: string;
  projectType: string;
  reevaluatorRole: string;
  evaluatorRole: string;
  allKeys: string[];
  constructor() {
    this.userType = localStorage.getItem("user_type");
    this.projectType = localStorage.getItem("projectType");
    this.reevaluatorRole = localStorage.getItem("Reevaluator");
    this.evaluatorRole = localStorage.getItem("Evaluator");
  }

  ngOnInit(): void {
    this.surveyCompliance = this.data.mslTable || [];
    this.allKeys = Object.keys(this.surveyCompliance[0]);
    console.log("allkeys: ", this.allKeys);
    debugger;
  }
}
