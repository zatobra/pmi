import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Config } from "src/assets/config";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
// import "src/assets/zoom.js-master/dist/zoom.js"



// declare const zoom: any;
@Component({
  selector: "test-component-git-libt",
  templateUrl: "./test-component-git-lib.html",
  styleUrls: ["./test-component-git-lib.scss"],
})
export class TestComponentGitLib implements AfterViewInit{
  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    // const element = document.getElementById('elementId');
    // zoom(element); // Apply zoom to the element
  }
}