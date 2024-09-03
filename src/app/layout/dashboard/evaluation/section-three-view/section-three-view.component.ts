import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "section-three-view",
  templateUrl: "./section-three-view.component.html",
  styleUrls: ["./section-three-view.component.scss"],
})
export class SectionThreeViewComponent implements OnInit {
  @Input("data") data;
  @Input("isEditable") isEditable: any;
  @Output("productList") productForEmit: any = new EventEmitter<any>();

  products: any = [];
  tagList: any = [];
  availability: any;
  changeColor: boolean;
  updatingMSL: boolean;
  colorUpdateList: any = [];
  surveyId: any;
  MSLCount: number = 0;
  MSLNAvailabilityCount: number;
  totalAmount = 0;
  totalQuantity = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    var arr = this.router.url.split("/");
    this.surveyId = +arr[arr.length - 1];
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.data = changes.data.currentValue;
    this.tagList = this.data.tagsList || [];
    console.log("tabList", this.tagList);
    this.calculateData(this.tagList);
  }

  calculateData(data) {
    data.forEach((element) => {
      if (element.heading == "Amount" && element.values.length > 0) {
        this.totalAmount = element.values.reduce(
          (a, v) => parseInt(a) + parseInt(v)
        );
      } else if (element.heading == "Quantity" && element.values.length > 0) {
        this.totalQuantity = element.values.reduce(
          (a, v) => parseInt(a) + parseInt(v)
        );
      }
    });

    console.log(
      "total amount",
      this.totalAmount,
      "total quantity",
      this.totalQuantity
    );
  }
}
