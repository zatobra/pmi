import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { ModalDirective } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { Config } from "src/assets/config";

import { EvaluationService } from "../evaluation.service";

@Component({
  selector: "section-seven-view",
  templateUrl: "./section-seven-view.component.html",
  styleUrls: ["./section-seven-view.component.scss"],
})
export class SectionSevenViewComponent implements OnInit {
  @Input("data") data;
  @Input("evaluatorId") taggedEvaluatorId;
  @Input("projectTypeFromShopDetailsMap") projectTypeFromShopDetailsMap;
  @Input("show_unit_available") show_unit_available;
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
  products: any;
  availability: any;
  changeColor: boolean;
  updatingMSL: boolean;
  selectedProduct: any = {};
  colorUpdateList: any = [];
  selectedSku: any;
  surveyId: any;
  evaluatorId: any;
  MSLCount = 0;
  loadingData: boolean;
  loading = false;
  totalProducts: any;
  facing: any;
  totalDesiredFacing: any;
  formData: any = [];
  secondaryData: any = [];
  projectType: any;
  depth: any;

  public isPortrait: boolean;

  statusArray: any = [
    { title: "Yes", value: "1" },
    { title: "No", value: "0" },
  ];
  unit_availableORavailable_sku_Label: string;
  empty_facing_Label: string;
  face_unit_label: string;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private httpService: EvaluationService
  ) {}

  ngOnInit() {
    const arr = this.router.url.split("/");
    this.surveyId = +arr[arr.length - 1];
    this.evaluatorId = localStorage.getItem("user_id");
    this.projectType = localStorage.getItem("projectType") ? localStorage.getItem("projectType") : this.projectTypeFromShopDetailsMap || '';

    if(this.projectType.toLowerCase() == 'pmi_audit'){
      this.unit_availableORavailable_sku_Label = "Back Stock";
      this.empty_facing_Label = "Front Stock";
      this.face_unit_label = "Price";
    }

    else{
      this.unit_availableORavailable_sku_Label = "Stock";
      this.empty_facing_Label = "Empty Facing";
      if(this.projectType.toLowerCase()=='pmi_merch'){
        this.face_unit_label = "Stock";
      }
      else{
        this.face_unit_label = "Facing";
      }
      
    }

  }

  // image size - portrait - landscape
  checkOrientation(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
   // this.isPortrait = imgElement.naturalHeight > imgElement.naturalWidth;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data.currentValue) {
      this.data = changes.data.currentValue;
      this.selectedImage = this.data.imageList[0];
      this.products = this.data.mslTable
        ? this.data.mslTable
        : this.data.skuTable
        ? this.data.skuTable
        : [];
      this.secondaryData = this.data.secondaryData || [];
      // this.formData = this.keyValuePipe.transform(this.data.formData) || [];
      if (this.products.length > 0) {
        this.availability = this.getAvailabilityCount(this.products);
        this.facing = this.getFacingCount(this.products);
        this.totalProducts = this.getTotalProducts(this.products);
        this.depth = this.getDepthCount(this.products);
      }
    }
  }

  setSelectedImage(img) {
    this.selectedImage = img;
  }

  getAvailabilityCount(products) {
    const sum = [];
    products.forEach((element) => {
      if (element.available_sku > 0 && element.MSL == "Yes") {
        sum.push(element);
      }
    });
    return sum.length;
  }
  getTotalProducts(products) {
    const sum = [];
    products.forEach((element) => {
      if (element.MSL == "Yes") {
        sum.push(element);
      }
    });
    return sum.length;
  }

  getFacingCount(products) {
    let sum = 0;
    products.forEach((el) => {
      sum = +el.face_unit + sum;
    });
    return sum;
  }

  getDepthCount(products) {
    let sum = 0;
    products.forEach((el) => {
      sum = +el.available_sku + sum;
    });
    return sum;
  }
  getMSLNAvailbilityCount(products) {
    const pro = [];
    const msl = [];
    products.forEach((p) => {
      let obj = {};
      if (p.MSL === "Yes" && p.available_sku >= 1) {
        obj = {
          available_sku: p.available_sku,
          MSL: p.MSL,
        };
        pro.push(obj);
      }

      if (p.MSL === "Yes") {
        msl.push(p);
      }
    });
    this.MSLCount = msl.length;
    return pro.length;
  }

  updateString(value) {
    return value ? "Yes" : "No";
  }

  changeSku(value) {
    this.loading = true;
    if (this.isEditable) {
     // this.changeColor = true;
      this.updatingMSL = true;

      this.colorUpdateList.push(value.id);
      const obj = {
        msdId: value.id,
        categoryTitle: this.data.sectionTitle,
        title: value.product_title,
        type: 1,
        newValue: !!value.available_sku ? 0 : 1,
        surveyId: value.survey_id,
        evaluatorId: this.evaluatorId,
      systemError: value.systemError ? value.systemError : "N",
      };

      // return value?'YES':'NO';

      this.httpService.updateData(obj).subscribe((data: any) => {
        if (data.success) {
          this.loading = false;
          this.toastr.success("Data Updated Successfully");
          const key = data.msdId;
          this.products.forEach((e) => {
            if (key == e.id) {
              const i = this.products.findIndex((p) => p.id == key);
              const obj = {
                id: e.id,
                available_sku:
                  e.available_sku == 0
                    ? (e.available_sku = 1)
                    : (e.available_sku = 0),
                MSL: e.MSL,
                product_title: e.product_title,
                face_unit: e.face_unit,
                empty_facing : e.empty_facing || 0,
                desired_facing: e.desired_facing,
                category_title: e.category_title,
                is_competition: e.is_competition,
                color: "red",
              };

              this.products.splice(i, 1, obj);
              // this.products[i].color = "red";
              // this.products[i].systemError = e.systemError
              //   ? e.systemError
              //   : "N";
              // this.products[i].available_sku =
              //   e.available_sku == 0
              //     ? (e.available_sku = 1)
              //     : (e.available_sku = 0);

              // console.log(this.products[i])
            }

            // }

            this.availability = this.getAvailabilityCount(this.products);
            this.depth = this.getDepthCount(this.products);
          });
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





// stock update in pmi_audit project
  changeSkuAvailableSku(value) {
    this.loading = true;
    if (this.isEditable) {
     // this.changeColor = true;
      this.updatingMSL = true;

      this.colorUpdateList.push(value.id);
      const obj = {
        msdId: value.id,
        categoryTitle: this.data.sectionTitle,
        title: value.product_title,
        type: 1,
        newValue: value.available_sku,
        surveyId: value.survey_id,
        evaluatorId: this.evaluatorId,
      systemError: value.systemError ? value.systemError : "N",
      };

      // return value?'YES':'NO';

      this.httpService.updateData(obj).subscribe((data: any) => {
        if (data.success) {
          this.loading = false;
          this.toastr.success("Data Updated Successfully");
          const key = data.msdId;
          this.products.forEach((e) => {
            if (key == e.id) {
              const i = this.products.findIndex((p) => p.id == key);
              const obj = {
                id: e.id,
                available_sku:
                  e.available_sku,
                MSL: e.MSL,
                product_title: e.product_title,
                face_unit: e.face_unit,
                empty_facing : e.empty_facing || 0,
                desired_facing: e.desired_facing,
                category_title: e.category_title,
                is_competition: e.is_competition,
                color: "red",
              };

              this.products.splice(i, 1, obj);
              // this.products[i].color = "red";
              // this.products[i].systemError = e.systemError
              //   ? e.systemError
              //   : "N";
              // this.products[i].available_sku =
              //   e.available_sku == 0
              //     ? (e.available_sku = 1)
              //     : (e.available_sku = 0);

              // console.log(this.products[i])
            }

            // }

            this.availability = this.getAvailabilityCount(this.products);
            this.depth = this.getDepthCount(this.products);
          });
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









  changeFacing(value) {
    this.loading = true;
    if (this.isEditable) {
      this.changeColor = true;
      this.updatingMSL = true;
      if (value !== null) {
        this.colorUpdateList.push(value.id);
        const obj = {
          msdId: value.id,
          newValue: value.face_unit,
          categoryTitle: this.data.sectionTitle,
          title: value.product_title,
          type: 2,
          surveyId: value.survey_id,
          evaluatorId: this.evaluatorId,
         systemError: value.systemError ? value.systemError : "N",
        };

        // return value?'YES':'NO';

        this.httpService.updateData(obj).subscribe((data: any) => {
          if (data.success) {
            this.loading = false;
            this.toastr.success("Data Updated Successfully");
            // this.products=data.productList;
            const key = data.msdId;
            this.products.forEach((e) => {
              if (key === e.id) {
                const i = this.products.findIndex((p) => p.id === key);
                // this.products[i].color = "red";
                // this.products[i].systemError = e.systemError
                //   ? e.systemError
                //   : "N";
                const obj = {
                  id: e.id,
                  available_sku: e.available_sku,
                  MSL: e.MSL,
                  product_title: e.product_title,
                  face_unit: e.face_unit,
                  empty_facing : e.empty_facing || 0,
                  desired_facing: e.desired_facing,
                  category_title: e.category_title,
                  is_competition: e.is_competition,
                  color: "red",
                };

                this.products.splice(i, 1, obj);

                console.log(this.products[i]);
              }

              // }

              this.facing = this.getFacingCount(this.products);
            });
          } else {
            this.toastr.error(data.message, "Update Data");
          }
        });
      } else {
        this.toastr.error("Facing Value is Incorrect");
        this.loading = false;
      }
    } else {
      this.toastr.error(
        "Operation not allowed. Please login  with the relevent Id",
        "Error"
      );
    }
  }



  changeEmptyFacing(value) {
    this.loading = true;
    if (this.isEditable) {
      this.changeColor = true;
      this.updatingMSL = true;
      if (value !== null) {
        this.colorUpdateList.push(value.id);
        const obj = {
          msdId: value.id,
          newValue: value.empty_facing,
          categoryTitle: this.data.sectionTitle,
          title: value.product_title,
          type: 24,
          surveyId: value.survey_id,
          evaluatorId: this.evaluatorId,
         systemError: value.systemError ? value.systemError : "N",
        };

        // return value?'YES':'NO';

        this.httpService.updateData(obj).subscribe((data: any) => {
          if (data.success) {
            this.loading = false;
            this.toastr.success("Data Updated Successfully");
            // this.products=data.productList;
            const key = data.msdId;
            this.products.forEach((e) => {
              if (key === e.id) {
                const i = this.products.findIndex((p) => p.id === key);
                // this.products[i].color = "red";
                // this.products[i].systemError = e.systemError
                //   ? e.systemError
                //   : "N";
                const obj = {
                  id: e.id,
                  available_sku: e.available_sku,
                  MSL: e.MSL,
                  product_title: e.product_title,
                  face_unit: e.face_unit,
                  empty_facing : e.empty_facing || 0,
                  desired_facing: e.desired_facing,
                  category_title: e.category_title,
                  is_competition: e.is_competition,
                  color: "red",
                };

                this.products.splice(i, 1, obj);

                console.log(this.products[i]);
              }

              // }

              this.facing = this.getFacingCount(this.products);
            });
          } else {
            this.toastr.error(data.message, "Update Data");
          }
        });
      } else {
        this.toastr.error("Facing Value is Incorrect");
        this.loading = false;
      }
    } else {
      this.toastr.error(
        "Operation not allowed. Please login  with the relevent Id",
        "Error"
      );
    }
  }




  showChildModal(shop): void {
    this.selectedShop = shop;
    this.showModal.emit(this.selectedShop);
    // this.childModal.show();
  }

  showFacingChildModal(product) {
    if (this.isEditable) {
      this.selectedProduct = product;
      // if (this.selectedProduct.available_sku > 0 ) {
      //   this.selectedProduct.face_unit = 0;
      // } else {
      //   this.selectedProduct.face_unit = 1;
      // }
      this.childModal.show();
    }
  }
  hideChildModal() {
    this.childModal.hide();
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

  updateMultiSelectData(value, data) {
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

  changeUtilization(value) {
    this.loading = true;
    if (value.utilization != null) {
      if (this.isEditable) {
        const obj = {
          msdId: value.secondarySurveyId,
          newValue: value.utilization,
          categoryTitle: this.data.sectionTitle,
          title: value.categoryTitle,
          type: 3,
          surveyId: value.survey_id,
          evaluatorId: this.evaluatorId,
        };

        this.httpService.updateData(obj).subscribe((data: any) => {
          if (data.success) {
            this.loading = false;
            this.toastr.success("Data Updated Successfully");
            const key = data.msdId;
            this.products.forEach((e) => {
              // for (const key of this.colorUpdateList) {
              if (key === e.id) {
                // const i = this.products.findIndex((p) => p.id === key);
                // const obj = {
                //   id: e.id,
                //   available_sku: e.available_sku,
                //   MSL: e.MSL,
                //   product_title: e.product_title,
                //   face_unit: e.face_unit,
                //   desired_facing: e.desired_facing,
                //   category_title: e.category_title,
                //   color: 'red'
                // };
                // this.products.splice(i, 1, obj);
                // console.log(this.products[i])
              }

              // }
            });
          } else {
            this.toastr.error(data.message, "Update Data");
          }
        });
      }
    } else {
      this.toastr.error("Utilization Value is Incorrect");
      this.loading = false;
    }
  }

  setAvailabilityPercentage(availability, totalProducts) {
    return ((availability / totalProducts) * 100).toFixed(2);
  }
  checkUncheckSingle(event, product) {
    const i = this.products.findIndex((p) => p.id == product.id);
    this.products[i].systemError = event.checked == true ? "Y" : "N";
    product.systemError = event.checked == true ? "Y" : "N";
    this.changeFacing(product);
  }
}
