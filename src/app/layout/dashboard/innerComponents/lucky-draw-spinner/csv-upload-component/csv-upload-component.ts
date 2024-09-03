import { Component, OnInit, Input, Output, ViewChild } from "@angular/core";
import { DashboardService } from "../../../dashboard.service";
import * as moment from "moment";
import { environment } from "src/environments/environment";
import { ToastrService } from "ngx-toastr";
import { NgxPaginationModule } from "ngx-pagination";
import { CSVRecord } from "../CSVModel";
import { DataService } from "../data.service";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "csv-upload",
  templateUrl: "./csv-upload-component.html",
  styleUrls: ["./csv-upload-component.scss"],
})
export class CsvUploadComponent implements OnInit {
  // https://github.com/faisal5170/Angular7-readCSV

  public records: any[] = [];
  @ViewChild("csvReader") csvReader: any;
  form: FormGroup;
  user_id: string;
  loadingData: boolean = false;
  filesList: any = [];
  gettingData: boolean;

  constructor(
    private dataService: DataService,
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
    this.getSpinTheWheelFilesList();
  }

  uploadListener($event: any): void {
    this.loadingData = true;

    let text = [];
    let files = $event.srcElement.files;

    if (this.isValidCSVFile(files[0])) {
      let input = $event.target;

      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
        console.log("csvData: ", csvData);
        console.log("csvRecordsArray: ", csvRecordsArray);

        let headersRow = this.getHeaderArray(csvRecordsArray);
        console.log("headersRow: ", headersRow);

        this.records = this.getDataRecordsArrayFromCSVFile(
          csvRecordsArray,
          headersRow.length
        );
        console.log(" this.records: ", this.records);

        this.saveFileToDb(input);
      };

      reader.onerror = function () {
        console.log("error is occured while reading file!");
      };
    } else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let csvArr = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(",");
      // console.log("curruntRecord: ", curruntRecord);
      if (curruntRecord.length == headerLength) {
        let csvRecord: CSVRecord = new CSVRecord();
        csvRecord.staffIdentifier = curruntRecord[0].trim();
        csvRecord.staffName = curruntRecord[1].trim();
        // csvRecord.staffChances = curruntRecord[2].trim();
        csvArr.push(csvRecord);
      }
    }

    console.log("csvArr: ", csvArr);
    this.dataService.data = csvArr;

    return csvArr;
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(",");
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  fileReset() {
    this.csvReader.nativeElement.value = "";
    this.records = [];
  }

  saveFileToDb(event: any) {
    debugger;
    

    let input = event.target;
    if (input.files.length > 0) {
      this.loadingData = true;
      const file = input.files[0];
      this.form.get("avatar").setValue(file);

      const formData = new FormData();
      formData.append("userId", this.user_id);
      formData.append("filePath", this.form.get("avatar").value);
      this.httpService.uploadSpinTheWheel(formData).subscribe((data) => {
        if (data) {
          const response: any = data;

          this.loadingData = false;
          this.getSpinTheWheelFilesList();
          this.toastr.info(response, "Info");
        } else {
          this.loadingData = false;
          this.toastr.error("File Could Not Be Saved In DataBase!!");
        }
      });
    }
  }

  getSpinTheWheelFilesList() {
    debugger;
    console.log("getSpinTheWheelFilesList");
    this.dataService.setSharedDataBoolean(true);
    // this.form.get("avatar").setValue(file);
    // const formData = new FormData();
    // formData.append("userId", this.user_id);
    // formData.append("filePath", this.form.get("avatar").value);
    this.httpService.getSpinTheWheelFilesList().subscribe(
      (data) => {
        const res: any = data;
        if (res) {
          this.filesList = res;
          // this.dataService.setSharedData(this.filesList);
          this.dataService.setSharedData(this.filesList);
        }
        else {
          this.toastr.info("No Uploaded File Found", "Info");
        }
        this.dataService.setSharedDataBoolean(false);
      },
      (error) => {
        this.dataService.setSharedDataBoolean(false);
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
      }
    );
  }
}
