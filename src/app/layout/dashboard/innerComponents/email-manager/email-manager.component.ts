import { Component, OnInit, ViewChild } from "@angular/core";
import { ModalDirective } from "ngx-bootstrap/modal";

@Component({
  selector: "email-manager",
  templateUrl: "./email-manager.component.html",
  styleUrls: ["./email-manager.component.scss"],
})
export class EmailManagerComponent implements OnInit {
  title = "Email Manager";
  tabName = "home";
  @ViewChild("sosModal", { static: true }) sosModal: ModalDirective;

  constructor() {}

  ngOnInit() {}

  clickedNow(title, tabName) {
    this.title = title;
    this.tabName = tabName;
  }

  showSoSModal(): void {
    this.sosModal.show();
  }

  hideSoSModal(): void {
    this.sosModal.hide();
  }
}
