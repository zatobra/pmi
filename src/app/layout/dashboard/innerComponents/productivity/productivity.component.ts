import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-productivity",
  templateUrl: "./productivity.component.html",
  styleUrls: ["./productivity.component.scss"],
})
export class ProductivityComponent implements OnInit {
  title = "";
  labels: any;

  constructor(public router: Router) {
    this.labels = JSON.parse(localStorage.getItem("labelProperties"));
    if (this.router.url == "/dashboard/supervisor_productivity") {
      this.title = "Productivity Analysis";
    } else {
      this.title = this.labels.surveyorLabel + " Productivity";
    }
  }

  ngOnInit() {}
}
