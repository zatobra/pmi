import { Component, OnInit, Input, Output, ViewChild } from "@angular/core";
import { DashboardService } from "../../../dashboard.service";
import * as moment from "moment";
import { environment } from "src/environments/environment";
import { ToastrService } from "ngx-toastr";
import { NgxPaginationModule } from "ngx-pagination";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "spinner-fileupload",
  templateUrl: "./spinner-fileupload-component.html",
  styleUrls: ["./spinner-fileupload-component.scss"],
})
export class SpinnerFileuploadComponent implements OnInit {
  public records: any[] = [];
  @ViewChild("csvReader") csvReader: any;
  form: FormGroup;
  user_id: string;
  loadingData: boolean = false;
  filesList: any = [];
  gettingData: boolean;

  constructor(
    public formBuilder: FormBuilder,
    private httpService: DashboardService,
    private toastr: ToastrService
  ) {
    this.form = formBuilder.group({
      avatar: null,
    });
    this.user_id = localStorage.getItem("user_id");
  }
  ngOnInit(): void {
    // this.getSpinTheWheelFilesList();
  }

  fileReset() {
    this.csvReader.nativeElement.value = "";
    this.records = [];
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.get("avatar").setValue(file);
    }
  }

  saveFileToDb() {
    debugger;

    if (this.form.get("avatar").value == null) {
      this.loadingData = false;
      this.toastr.error("Plz select a file to upload");
    } else {
      this.loadingData = true;
      const formData = new FormData();
      formData.append("userId", this.user_id);
      formData.append("filePath", this.form.get("avatar").value);
      this.httpService.uploadSpinTheWheel(formData).subscribe((data) => {
        if (data) {
          const response: any = data;
          this.loadingData = false;
          this.toastr.info(response, "Info");
        } else {
          this.loadingData = false;
          this.toastr.error("File Could Not Be Saved In DataBase!!");
        }
      });
    }
  }
}
