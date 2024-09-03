import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from "@angular/core";
import {
  CalendarEvent,
  CalendarMonthViewBeforeRenderEvent,
  CalendarView,
} from "angular-calendar";
import * as moment from "moment";
import { Subject } from "rxjs";

@Component({
  selector: "app-calender-demo",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: "./calender-demo.component.html",
  styleUrls: ["./calender-demo.component.scss"],
})
export class CalenderDemoComponent {
  dateArray: any = [
    { date: "2021-06-09", value: "Y" },
    { date: "2021-06-13", value: "Y" },
    { date: "2021-07-01", value: "Y" },
    { date: "2021-07-02", value: "Y" },
    { date: "2021-07-03", value: "Y" },
    { date: "2021-07-07", value: "Y" },
    { date: "2021-07-10", value: "Y" },
    { date: "2021-07-11", value: "Y" },
  ];
  refresh: Subject<any> = new Subject();

  view: CalendarView = CalendarView.Month;

  viewDate: Date = new Date();

  events: CalendarEvent[] = [];

  beforeMonthViewRender(renderEvent: CalendarMonthViewBeforeRenderEvent): void {
    renderEvent.body.forEach((day) => {
      if (day.inMonth) {
        const dayOfMonth = moment(day.date).format("YYYY-MM-DD");
        const i = this.dateArray.findIndex((e) => e.date == dayOfMonth);
        if (i > -1 && this.dateArray[i].value == "Y") {
          day.cssClass = "bg-grey";
        }
      }
    });
  }
  changeStatus(day) {
    if (day.inMonth) {
      const dayOfMonth = moment(day.date).format("YYYY-MM-DD");
      const i = this.dateArray.findIndex((e) => e.date == dayOfMonth);
      if (i > -1) {
        const obj = {
          date: dayOfMonth,
          value: this.dateArray[i].value == "Y" ? "N" : "Y",
        };
        this.dateArray.splice(i, 1, obj);
      } else {
        const obj = {
          date: dayOfMonth,
          value: "Y",
        };
        this.dateArray.push(obj);
      }
      console.log(this.dateArray);
      this.refresh.next();
    }
  }
}
