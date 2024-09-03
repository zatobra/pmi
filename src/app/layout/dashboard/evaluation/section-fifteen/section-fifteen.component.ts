import { KeyValuePipe } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { ModalDirective } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { Config } from "src/assets/config";

import { EvaluationService } from "../evaluation.service";

@Component({
  selector: "app-section-fifteen",
  templateUrl: "./section-fifteen.component.html",
  styleUrls: ["./section-fifteen.component.scss"],
})
export class SectionFifteenComponent implements OnInit {
  @Input("data") data;
  @Input("evaluatorId") taggedEvaluatorId;
  // @ViewChild('childModal') childModal: ModalDirective;
  @ViewChild("childModal") childModal: ModalDirective;
  @Output("showModal") showModal: any = new EventEmitter<any>();
  @Input("isEditable") isEditable: any;
  @Input("surveyId") surveyId: any;
  @Output("assetTypeId") assetTypeForEmit: any = new EventEmitter<any>();
  selectedShop: any = {};
  selectedImage: any = {};
  // ip=environment.ip;

  ip: any = Config.BASE_URI;
  hover = "hover";
  zoomOptions = {
    Mode: "hover",
  };
  zoomedImage =
    "https://image.shutterstock.com/image-photo/micro-peacock-feather-hd-imagebest-260nw-1127238569.jpg";
  formData: any;
  availability: any;
  changeColor: boolean;
  updatingMSL: boolean;
  selectedProduct: any = {};
  colorUpdateList: any = [];
  selectedSku: any;
  evaluatorId: any;
  projectType: any;
  MSLCount = 0;
  loadingData: boolean;
  loading = false;
  MSLNAvailabilityCount: number;
  facing: any;
  totalDesiredFacing: any;
  selectedValue: any;

  statusArray: any = [
    { title: "Yes", value: "1" },
    { title: "No", value: "0" },
  ];

  constructor(
    private toastr: ToastrService,
    private httpService: EvaluationService,
    private keyValuePipe: KeyValuePipe
  ) {
    this.evaluatorId = localStorage.getItem("user_id");
    this.projectType = localStorage.getItem("projectType");
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    debugger;
    if (changes.data.currentValue) {
      this.data = changes.data.currentValue;
      this.formData = this.keyValuePipe.transform(this.data.formData) || [];
      this.selectedImage = this.data.imageList[0];
    }
    console.log("data=",this.data);
  }

  unsorted() {}

  setSelectedImage(img) {
    this.selectedImage = img;
  }

  showChildModal(shop): void {
    this.selectedShop = shop;
    this.showModal.emit(this.selectedShop);
    // this.childModal.show();
  }

  hideChildModal() {
    this.childModal.hide();
  }

  updateMultiOptionData(value, data) {
    this.loading = true;
    let selectedOption;
    for (const option of data.optionList) {
      if (value == option.id) {
        selectedOption = option;
        break;
      }
    }
    if (selectedOption.conditionalFieldId) {
      this.showConditionalFields(selectedOption);
      this.hideExistingChildFields(data);
      const j = this.formData.findIndex((e) => e.value.fieldId == data.fieldId);
      this.formData[j].value.answer = selectedOption.title;
    }
    if (value != null) {
      if (this.isEditable) {
        const obj = {
          msdId: data.id,
          surveyId: data.surveyId,
          title: data.question,
          categoryTitle: this.data.sectionTitle,
          newValueId: selectedOption.id,
          newValue: selectedOption.title,
          type: 4,
          evaluatorId: this.evaluatorId,
        };

        this.httpService.updateData(obj).subscribe((data: any) => {
          if (data.success) {
            this.loading = false;
            this.toastr.success("Data Updated Successfully");
          } else {
            this.toastr.error(data.message, "Update Data");
          }
        });
      } else {
        this.toastr.error(
          "Operation not allowed. Please login  with the relevent Id",
          "Error"
        );
      }
    } else {
      this.toastr.error("Value is Incorrect");
      this.loading = false;
    }
  }

  updateConditionalFieldData(data, index) {
    if (this.isEditable) {
      const obj = {
        detailId: data.id,
        surveyId: this.surveyId,
        formId: data.formId,
        fieldId: data.fieldId,
        title: data.question,
        categoryTitle: this.data.sectionTitle,
        newValue: data.answer,
        type: 4,
        evaluatorId: this.evaluatorId,
      };

      this.httpService
        .updateConditionalFieldData(obj)
        .subscribe((data: any) => {
          if (data.success) {
            this.loading = false;
            this.toastr.success("Data Updated Successfully");
            this.formData[index].value.id = data.msdId;
          } else {
            this.toastr.error(data.message, "Update Data");
          }
        });
    } else {
      this.toastr.error(
        "Operation not allowed. Please login  with the relevent Id",
        "Error"
      );
    }
  }

  showConditionalFields(selectedOption) {
    this.formData.forEach((e, index) => {
      if (e.value.fieldId == selectedOption.conditionalFieldId) {
        this.formData[index].value.answer =
          this.formData[index].value.optionList[0].title;
        this.formData[index].value.isVisible = true;
        if (!this.formData[index].value.id) {
          this.updateConditionalFieldData(this.formData[index].value, index);
        }
      }
    });
  }

  hideExistingChildFields(data) {
    this.formData.forEach((element) => {
      element.value.optionList.forEach((option) => {
        if (data.answer == option.title) {
          const i = this.formData.findIndex(
            (e) => e.value.fieldId == option.conditionalFieldId
          );
          this.formData[i].value.isVisible = false;
          this.updateConditionalFieldData(this.formData[i].value, i);
        }
      });
    });
  }

  updateTextData(value) {
    this.loading = true;
    if (value.dataType == 1 || (value.answer != null && value.answer >= 0)) {
      if (this.isEditable) {
        const obj = {
          msdId: value.id,
          newValue: value.answer,
          newValueId: -1,
          title: value.question,
          categoryTitle: this.data.sectionTitle,
          type: 8,
          evaluatorId: this.evaluatorId,
        };

        this.httpService.updateData(obj).subscribe((data: any) => {
          if (data.success) {
            this.loading = false;
            this.toastr.success("Data Updated Successfully");
          } else {
            this.toastr.error(data.message, "Update Data");
          }
        });
      } else {
        this.toastr.error(
          "Operation not allowed. Please login  with the relevent Id",
          "Error"
        );
      }
    } else {
      this.toastr.error("Value is Incorrect");
      this.loading = false;
    }
  }
}
