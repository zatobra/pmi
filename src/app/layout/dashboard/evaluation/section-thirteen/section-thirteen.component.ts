import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-section-thirteen",
  templateUrl: "./section-thirteen.component.html",
  styleUrls: ["./section-thirteen.component.scss"],
})
export class SectionThirteenComponent implements OnInit {
  @Input("data") data;
  mslSummary: any;
  constructor() {}

  ngOnInit() {
    this.mslSummary = this.data.mslTable || [];
  }
  setTotalPercentage(msl, available) {
    return msl == 0 && available == 0
      ? 0
      : ((available / msl) * 100).toFixed(2);
  }
}
