import {
  Component,
  OnInit,
  SimpleChanges,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from "@angular/core";
import { environment } from "src/environments/environment";
import { Config } from "src/assets/config";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { EvaluationService } from "../evaluation.service";
import { ModalDirective } from "ngx-bootstrap/modal";

@Component({
  selector: "section-eight-view",
  templateUrl: "./section-eight-view.component.html",
  styleUrls: ["./section-eight-view.component.scss"],
})
export class SectionEightViewComponent implements OnInit {
  @Input("data") data;
  @Input("evaluatorId") taggedEvaluatorId;
  @Input("projectType") projectType;
  @ViewChild("childModal", { static: true }) childModal: ModalDirective;
  @Output("showModal") showModal: any = new EventEmitter<any>();
  @Input("isEditable") isEditable: any;
  @Output("productList") productForEmit: any = new EventEmitter<any>();
  selectedShop: any = {};
  selectedImage: any = {};
  hundred: number = 100;
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
  colorUpdateList: any = [];
  surveyId: any;
  flag = 0;
  evaluatorId: any;
  MSLCount = 0;
  MSLNAvailabilityCount: number;
  facing: any;
  availableDepth: any;
  desiredDepth: any;
  stock: any;
  total: any;
  recommendedScore: any;

  selectedProduct: any = {};
  selectedFacing: any;
  selectedSku: any;
  loadingData: boolean;
  loading = false;

  planogramList: any = [];
  tags: any;
  scores: any;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private httpService: EvaluationService
  ) {
    this.projectType = localStorage.getItem("projectType");
  }

  ngOnInit() {
    const arr = this.router.url.split("/");
    this.surveyId = +arr[arr.length - 1];
    this.evaluatorId = localStorage.getItem("user_id");

    // this.sumM(tab);
  }
  // sumM(tab) {
  //   throw new Error("Method not implemented.");
  // }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data.currentValue) {
      this.data = changes.data.currentValue;
      this.selectedImage = this.data.imageList[0];
      this.products = this.data.chillerTable || [];
      console.log("products", this.products);
      this.tags = this.data.tagsList || [];
    }

    if (this.products.length > 0) {
      this.facing = this.getFacingCount(this.products);
      this.availableDepth = this.getAvailDepthCount(this.products);
      this.desiredDepth = this.getDesDepthCount(this.products);
      this.stock = this.getStockCount(this.products);
      this.total = this.getTotalCount(this.availableDepth, this.desiredDepth);
      // this.recommendedScore = this.getRecommendedScore(
      //   this.availableDepth,
      //   this.desiredDepth
      // );
    }

    if (this.tags.length > 0) {
      this.scores = this.getscores(this.tags);
    }
    this.planogramList = JSON.stringify(this.data.planogramImageList);
  }

  setSelectedImage(img) {
    this.selectedImage = img;
  }
  getFacingCount(products) {
    let sum = 0;
    products.forEach((el) => {
      sum = +el.face_unit + sum;
    });
    return sum;
  }

  getAvailDepthCount(products) {
    let sum = 0;
    products.forEach((el) => {
      sum = +el.unit_available + sum;
    });
    return sum;
  }

  getDesDepthCount(products) {
    let sum = 0;
    products.forEach((el) => {
      sum = sum + el.desiredDepth;
    });
    return sum;
  }

  getStockCount(products) {
    let sum = 0;
    products.forEach((el) => {
      sum = sum + el.stock;
    });
    return sum;
  }

  getscores(tags) {
    let sum = 0;
    tags.forEach((el) => {
      if (el.isEditable == true && !isNaN(el.value)) {
        sum = sum + Number(el.value);
      }
    });
    return sum;
  }

  getTotalCount(availableDepth, desiredDepth) {
    const percentage = ((availableDepth / desiredDepth) * 100).toFixed(1);
    return percentage;
  }

  getRecommendedScore(availableDepth, desiredDepth) {
    if (availableDepth > desiredDepth) {
      availableDepth = desiredDepth;
    }
    return ((availableDepth / desiredDepth) * 25).toFixed();
  }
  showChildModal(shop): void {
    this.selectedShop = shop;
    this.selectedFacing = this.selectedShop.face_unit;
    this.showModal.emit(this.selectedShop);
    // this.childModal.show();
  }

  showChillerChildModal(product, value) {
    if (value === 1) {
      this.flag = 1;
    } else {
      this.flag = 2;
    }
    this.selectedProduct = product;
    this.childModal.show();
  }

  hideChildModal() {
    this.childModal.hide();
  }

  toggleValue(product, flag) {
    if (product.unit_available != null && product.face_unit != null) {
      this.loading = true;
      if (this.isEditable) {
        this.changeColor = true;
        this.colorUpdateList.push(product.id);
        const obj = {
          msdId: product.detailId,
          facing: product.face_unit,
          unit_available: product.unit_available,
          surveyId: product.surveyId,
          evaluatorId: this.evaluatorId,
          flag: flag,
        };
        this.httpService.updateChillerData(obj).subscribe((data: any) => {
          if (data.success) {
            this.loading = false;
            this.toastr.success("Data Updated Successfully");
            this.childModal.hide();
            const key = data.detailId;
            this.products.forEach((e) => {
              if (key === e.detailId) {
                const i = this.products.findIndex((p) => p.detailId === key);
                const obj = {
                  id: e.detailId,
                  stock: e.stock,
                  unit_available: e.unit_available,
                  product_title: e.product_title,
                  face_unit: e.face_unit,
                  color: "red",
                };

                this.products.splice(i, 1, obj);
                // console.log(this.products[i])
              }
              localStorage.setItem(
                "productList",
                JSON.stringify(this.products)
              );

              this.facing = this.getFacingCount(this.products);
              this.availableDepth = this.getAvailDepthCount(this.products);
              this.total = this.getTotalCount(
                this.availableDepth,
                this.desiredDepth
              );
              // this.recommendedScore = this.getRecommendedScore(
              //   this.availableDepth,
              //   this.desiredDepth
              // );
            });

            this.productForEmit.emit(this.products);
            // this.toastr.success('Status updated successfully.','Update MSL');
            this.updatingMSL = false;
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

  changeAvailability(product) {
    this.loading = true;
    if (product.unit_available != null) {
      if (this.isEditable) {
        const obj = {
          msdId: product.detailId,
          newValue: product.unit_available,
          evaluatorId: this.evaluatorId,
          title: product.product_title,
          categoryTitle: this.data.sectionTitle,
          type: 5,
        };
        this.httpService.updateData(obj).subscribe((data: any) => {
          if (data.success) {
            this.loading = false;
            this.toastr.success("Data Updated Successfully");
            this.childModal.hide();
            const key = data.detailId;
            this.products.forEach((e) => {
              if (key === e.detailId) {
                const i = this.products.findIndex((p) => p.detailId === key);
                const obj = {
                  id: e.detailId,
                  stock: e.stock,
                  unit_available: e.unit_available,
                  product_title: e.product_title,
                  face_unit: e.face_unit,
                  color: "red",
                };

                this.products.splice(i, 1, obj);
              }

              this.availableDepth = this.getAvailDepthCount(this.products);
              this.total = this.getTotalCount(
                this.availableDepth,
                this.desiredDepth
              );
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
    } else {
      this.toastr.error("Availability Value is Incorrect");
      this.loading = false;
    }
  }

  changeStock(product) {
    this.loading = true;
    if (product.unit_available != null) {
      if (this.isEditable) {
        const obj = {
          msdId: product.detailId,
          newValue: product.stock,
          evaluatorId: this.evaluatorId,
          title: product.product_title,
          categoryTitle: this.data.sectionTitle,
          type: 11,
        };
        this.httpService.updateData(obj).subscribe((data: any) => {
          if (data.success) {
            this.loading = false;
            this.toastr.success("Data Updated Successfully");
            this.childModal.hide();
            const key = data.detailId;
            this.products.forEach((e) => {
              if (key === e.detailId) {
                const i = this.products.findIndex((p) => p.detailId === key);
                const obj = {
                  id: e.detailId,
                  stock: e.stock,
                  unit_available: e.unit_available,
                  product_title: e.product_title,
                  face_unit: e.face_unit,
                  color: "red",
                };

                this.products.splice(i, 1, obj);
              }

              this.stock = this.getStockCount(this.products);
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
    } else {
      this.toastr.error("Availability Value is Incorrect");
      this.loading = false;
    }
  }

  changeFacing(product) {
    this.loading = true;
    if (product.face_unit != null) {
      if (this.isEditable) {
        this.changeColor = true;
        this.colorUpdateList.push(product.id);
        const obj = {
          msdId: product.detailId,
          newValue: product.face_unit,
          evaluatorId: this.evaluatorId,
          title: product.product_title,
          categoryTitle: this.data.sectionTitle,
          type: 6,
          systemError: product.systemError ? product.systemError : "N",
        };
        this.httpService.updateData(obj).subscribe((data: any) => {
          if (data.success) {
            this.loading = false;
            this.toastr.success("Data Updated Successfully");
            this.childModal.hide();
            const key = data.detailId;
            this.products.forEach((e) => {
              if (key === e.detailId) {
                const i = this.products.findIndex((p) => p.detailId === key);
                const obj = {
                  id: e.detailId,
                  stock: e.stock,
                  unit_available: e.unit_available,
                  product_title: e.product_title,
                  face_unit: e.face_unit,
                };

                this.products.splice(i, 1, obj);
              }

              this.facing = this.getFacingCount(this.products);
              this.total = this.getTotalCount(
                this.availableDepth,
                this.desiredDepth
              );
              console.log("total: ", this.facing);
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
    } else {
      this.toastr.error("Facing Value is Incorrect");
      this.loading = false;
    }
  }

  navigateWithArray() {
    window.open(
      `${environment.hash}dashboard/evaluation/list/planogram-images?imageList=${this.planogramList}`,
      "_blank"
    );
  }

  updateTextData(tag) {
    this.loading = true;
    if (tag.value != null && tag.value >= 0) {
      if (this.isEditable) {
        const obj = {
          msdId: tag.questionId,
          newValue: tag.value,
          newValueId: -1,
          title: tag.heading,
          categoryTitle: this.data.sectionTitle,
          type: tag?.chillerRemarkId,
          evaluatorId: this.evaluatorId,
        };

        this.httpService.updateData(obj).subscribe((data: any) => {
          if (data.success) {
            console.log("update response: ", data);
            this.loading = false;
            this.toastr.success("Data Updated Successfully");

            const key = data.msdId;
            this.tags.forEach((e) => {
              if (key === e.questionId) {
                const i = this.tags.findIndex((p) => p.questionId === key);
                const obj = {
                  questionId: e.questionId,
                  Value: e.Value,
                  heading: e.heading,
                  isEditable: e.isEditable,
                  isSosTag: e.isSosTag,
                  chillerRemarkId: e.chillerRemarkId,

                  color: "red",
                };

                this.tags.splice(i, 1, obj);
              }

              this.scores = this.getscores(this.tags);
              // this.total = this.getTotalCount(
              //   this.availableDepth,
              //   this.desiredDepth
              // );
              console.log("total: ", this.facing);
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
      console.log("updatetextData: ", tag.value);
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
          msdId: data.questionId,
          title: data.heading,
          categoryTitle: this.data.sectionTitle,
          oldValue: data.value,
          newValue: selectedOption.title,
          newValueId: selectedOption.id,
          type: data?.chillerRemarkId,
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
  checkUncheckSingle(event, product) {
    const i = this.products.findIndex((p) => p.id == product.id);
    this.products[i].systemError = event.checked == true ? "Y" : "N";
    product.systemError = event.checked == true ? "Y" : "N";
    this.changeFacing(product);
  }
}
