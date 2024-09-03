import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'app-samsung-hr-incentives-file-upload',
  templateUrl: './samsung-hr-incentives-file-upload-component.html',
  styleUrls: ['./samsung-hr-incentives-file-upload-component.scss']
})
export class SamsungHrIncentivesFileUploadComponent implements OnInit {
  loadingData: boolean;
  form: FormGroup;
  response: any ;

  constructor( private toastr: ToastrService,
    private httpService: DashboardService,
    public formBuilder: FormBuilder) {
      this.form = formBuilder.group({
        // selectedRegionUp: this.selectedRegionUp,
        // selectedOption: this.selectedOption,
        avatar: null,
      });
     }

  ngOnInit() {
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.get("avatar").setValue(file);
    }
  }

  uploadData(post) {
    const formData = new FormData();
    // formData.append("cityId", post.selectedRegionUp);
    // formData.append("newSurveyor", "No");
    // formData.append("fileType", this.radioOptions);
    // formData.append("fullDate", moment(this.year.value).format("YYYY") + '-' + this.monthValue);
    // // formData.append('startDate', post.date);
    // console.log("fulldate: ", moment(this.year.value).format("YYYY") + '-' + this.monthValue);
    formData.append("filePath", this.form.get("avatar").value);

    if (this.form.get("avatar").value == null) {
      this.loadingData = false;
      this.toastr.error("Plz select a file to upload");
    } 
    else {
      this.loadingData = true;
      this.httpService.uploadHrIncentives(formData).subscribe((data) => {
        if (data) {
          debugger;
          this.response = data;
          if (this.response?.length > 0) {
            this.loadingData = false;
            console.log(this.response, "Info");
            this.toastr.info(this.response, "Info");
          }
        } else {
          this.loadingData = false;
          this.toastr.error("There is an error in ur file!!");
        }
      });
    }
  }

}
