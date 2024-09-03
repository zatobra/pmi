import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  projectType: any;
  userType: any;
  evaluatorRole: any;
  isDashboardPageEnabled = false;
  constructor() {
    this.userType = localStorage.getItem("user_type");
    this.projectType = localStorage.getItem("projectType");
    this.evaluatorRole = localStorage.getItem("Evaluator");
    if (
      this.userType == this.evaluatorRole ||
      (this.projectType == "DALDA" && this.userType == 9)
    ) {
      this.isDashboardPageEnabled == false;
    } else if (this.projectType == "Haleeb" || this.projectType == "Nivea") {
      this.isDashboardPageEnabled = true;
    }
  }
  ngOnInit() {}
}
