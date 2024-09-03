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
  selector: "section-nine-view",
  templateUrl: "./section-nine-view.component.html",
  styleUrls: ["./section-nine-view.component.scss"],
})
export class SectionNineViewComponent implements OnInit {
  @Input("data") data;
  @Input("evaluatorId") taggedEvaluatorId;
  // @ViewChild('childModal') childModal: ModalDirective;
  @ViewChild("childModal") childModal: ModalDirective;
  @Output("showModal") showModal: any = new EventEmitter<any>();
  @Input("isEditable") isEditable: any;
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
  surveyId: any;
  evaluatorId: any;
  projectType: any;
  MSLCount = 0;
  loadingData: boolean;
  loading = false;
  MSLNAvailabilityCount: number;
  facing: any;
  totalDesiredFacing: any;

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
    if (changes.data.currentValue) {
      this.data = changes.data.currentValue;
      this.formData = this.keyValuePipe.transform(this.data.formData) || [];
      this.selectedImage = this.data.imageList[0];
    }
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
    if (value != null) {
      if (this.isEditable) {
        const obj = {
          msdId: data.id,
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
            const key = data.msdId;
            const i = this.formData.findIndex((p) => p.value.id == key);
            if (i > -1) {
              this.formData[i].value.color = "red";
            }
            this.toastr.success("Data Updated Successfully");
            // const key = data.msdId;
            // this.formData.forEach((e) => {
            //   // for (const key of this.colorUpdateList) {
            //   if (key == e.value.id) {
            //     const i = this.formData.findIndex((p) => p.value.id == key);
            //     const obj = {
            //       id: e.value.id,
            //       question: e.value.question,
            //       answer: e.value.answer,
            //       fieldType: e.value.fieldType,
            //       color: "red",
            //     };

            //     this.formData.splice(i, 1, obj);
            //   }

            //   // }
            // });
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

  updateTextData(value) {
    this.loading = true;
    if (value.answer != null && value.answer >= 0) {
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
            const key = data.msdId;
            const i = this.formData.findIndex((p) => p.value.id == key);
            if (i > -1) {
              this.formData[i].value.color = "red";
            }
            // this.formData.forEach((e) => {
            //   // for (const key of this.colorUpdateList) {
            //   if (key == e.value.id) {
            //     const i = this.formData.findIndex((p) => p.value.id == key);
            //     const obj = {
            //       id: e.value.id,
            //       question: e.value.question,
            //       answer: e.value.answer,
            //       fieldType: e.value.fieldType,
            //       color: "red",
            //     };

            //     this.formData.splice(i, 1, obj);
            //   }

            //   // }
            // });
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
