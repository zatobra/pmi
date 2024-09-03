import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import domtoimage from "dom-to-image";
import html2canvas from "html2canvas";
import jspdf from "jspdf";
import * as moment from "moment";
import { ModalDirective } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { Config } from "src/assets/config";
import { environment } from "src/environments/environment";

import { EvaluationService } from "../evaluation.service";
import { PdfConversionService } from "../../innerComponents/home/PdfConversionService";

// import * as jsPDF from "jspdf";

declare var require: any;
const htmlToPdfmake = require("html-to-pdfmake");
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  pdfUrl: string | null = null;
  data: any = [];
  // ip = environment.ip;

  ip: any = Config.BASE_URI;
  loading = false;
  loadingDownload = false;
  selectedShop: any = {};

  @ViewChild("pdfTable1")
  pdfTable1!: ElementRef;
  show_unit_available: any;

  public downloadAsPDF() {
    const pdfTable1 = this.pdfTable1.nativeElement;
    var html = htmlToPdfmake(pdfTable1.innerHTML);
    const documentDefinition = { content: html };
    pdfMake.createPdf(documentDefinition).download();
  }

  htmltoPDF() {
    // parentdiv is the html element which has to be converted to PDF
    html2canvas(document.getElementById("pdfTable1"), {
      useCORS: true,
      allowTaint: true,
      logging: true,
    }).then((canvas) => {
      var pdf = new jspdf("p", "pt", [canvas.width, canvas.height]);
      console.log("canvas.width", canvas.width);
      console.log("canvas.height", canvas.height);

      var imgData = canvas.toDataURL("image/jpeg", 1.0);
      console.log("imgData", imgData);
      pdf.addImage(imgData, 0, 0, canvas.width, canvas.height);
      pdf.save("converteddoc.pdf");
    });
  }

  htmltoPDF2() {
        // const chromeOptions = '--user-data-dir="C://Chrome dev session" --disable-web-security';
    // const newWindow = window.open('', '', chromeOptions);

    
    // const chromeOptions = '--user-data-dir="C://Chrome dev session" --disable-web-security';
    // // Save the current window's location to a variable
    // const currentWindowLocation = window.location.href;
    // // Open a new window with the desired options
    // window.open(currentWindowLocation, '', chromeOptions);


    this.loadingDownload = true;
    const that = this;
    var img;
    var filename;
    var newImage;
    // pdfTable1 is the html element which has to be converted to PDF
    html2canvas(document.getElementById("pdfTable1"), {
      useCORS: true,
      allowTaint: true,
      logging: true,
    }).then((canvas) => {
      console.log("canvas.width", canvas.width);
      console.log("canvas.height", canvas.height);
      img = new Image();
      img.src = canvas.toDataURL("image/jpeg", 1.0);
      newImage = img.src;
      console.log("newImage", newImage);
      var doc;

      if (canvas.width > canvas.height) {
        doc = new jspdf("l", "px", [800, canvas.height]);
      } else {
        doc = new jspdf("p", "px", [800, canvas.height]);
      }

      var width = doc.internal.pageSize.getWidth();
      var height = doc.internal.pageSize.getHeight();
      console.log("width", width);
      console.log("height", height);
      doc.addImage(newImage, "JPEG", 10, 10, width, height);
      filename = that.surveyDetails.shopTitle + ".pdf";
      doc.save(filename);
      that.loadingDownload = false;
    });
  }

  @ViewChild("childModal", { static: true }) childModal: ModalDirective;
  @ViewChild("remarksModal", { static: true }) remarksModal: ModalDirective;
  @ViewChild("sosModal", { static: true }) sosModal: ModalDirective;
  @ViewChild("evaluationRemarksModal", { static: true })
  evaluationRemarksModal: ModalDirective;
  @ViewChild("exceptionDescriptionModal", { static: true })
  exceptionDescriptionModal: ModalDirective;
  @ViewChildren("checkStatus") private myCheckbox: any;
  @ViewChild("startEvaluationModal", { static: true })
  startEvaluationModal: ModalDirective;

  score: any = 0;
  isChecked = 0;

  projectType: any;
  indexList: any = [];
  surveyId: any = 0;
  remarksList: any = [];
  existingRemarks: any = [];
  selectedRemarks: any = true;
  selectedRemarksList: any = [];
  evaluationRemarks: any = [];
  selectedCriteria: any = {};
  evaluationArray: any = [];
  productList: any = [];
  msl: any;
  availabilityCount: number;
  selectedEvaluationRemark = -1;
  j = -1;
  i = 0;
  cloneArray: any = [];
  isFromShop = true;
  rotationDegree = 0;
  userType: any;
  isEditable: any = false;
  selectedIndex = -1;
  criteriaDesireScore: any = 0;
  totalAchieveScore = 0;
  MSLCount: number;
  isCritical = true;
  isNoNCritical = false;
  isDragging = false;
  selectedSoS: any = {};
  productivityCount: any;
  reevaluatorRole: any;
  evaluatorRole: any;
  surveyorId: any;
  visitDay: any;
  surveyDetails: any;
  exceptionList: any = [];
  showCriteria: boolean;
  layoutRatio: any;
  leftRatio: any;
  rightRatio: any;
  sectionList: any = [];
  errorMessage = "";
  obj = {
    surveyId: "-1",
    userTypeId: "-1",
    shopId: -1,
    surveyorId: -1,
    visitDate: null,
    imageView: "N",
    surveyorType: 1,
  };
  zsmRole: any;
  selectedZsmStatus = -1;
  evaluationStartDateTime: string;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private activatedRoutes: ActivatedRoute,
    private httpService: EvaluationService,
    private evaluationService: EvaluationService,
    private pdfConversionService: PdfConversionService,
    private renderer: Renderer2, private el: ElementRef
  ) {
    debugger;
    this.userType = localStorage.getItem("user_type");
    this.projectType = localStorage.getItem("projectType");
    this.reevaluatorRole = localStorage.getItem("Reevaluator");
    this.evaluatorRole = localStorage.getItem("Evaluator");
    this.zsmRole = localStorage.getItem("Zsm");
    this.layoutRatio = localStorage.getItem("shopPageProperties")
      ? JSON.parse(localStorage.getItem("shopPageProperties"))
      : null;
    this.leftRatio = this.layoutRatio ? this.layoutRatio.left_frame_ratio : 9;
    this.rightRatio = this.layoutRatio ? this.layoutRatio.right_frame_ratio : 3;

    this.activatedRoutes.params.subscribe((params) => {
      this.surveyId = params.id;
      this.obj.surveyId = this.surveyId;
      this.obj.userTypeId = localStorage.getItem("user_type");
      // dependent params
      if (params.shopId && params.surveyorId && params.visitDate) {
        this.obj.shopId = params.shopId;
        this.obj.surveyorId = params.surveyorId;
        this.obj.visitDate = params.visitDate;
      }
      if (params.imageView) {
        this.obj.imageView = params.imageView || "N";
      }
    });

    this.activatedRoutes.queryParams.subscribe((params) => {
      if (params.shopId && params.surveyorId && params.visitDate) {
        this.obj.surveyorId = params.surveyorId;
        this.obj.shopId = params.shopId;
        this.obj.visitDate = params.visitDate;
      }
      if (params.imageView) {
        this.obj.imageView = params.imageView;
      }
      this.obj.surveyorType = params.surveyorType || 1;
    });
    if (this.obj.shopId && this.obj.surveyorId && this.obj.visitDate) {
      this.getSurveyData(this.obj);
    } else {
      this.getData(this.obj);
    }
  }
  value = 5;
  options: any = {
    showTicksValues: true,
    floor: 0,
    ceil: 0,
    step: 1,
  };

  createTickForSlider(maxTicks) {
    const ceil = maxTicks.score - 1;
    this.options = {
      showTicksValues: true,
      floor: 0,
      ceil: ceil,
      step: 1,
    };
  }

  ngOnInit() {
    // if (this.projectType != "Coke_Audit") {
    //   this.location.replaceState(
    //     "dashboard/evaluation/list/details/" + this.surveyId
    //   );
    // }
  }
  formatLabel(value: number | null) {
    if (!value) {
      return 0;
    }

    if (value >= 1000) {
      return Math.round(value / 1000);
    }

    return value;
  }

  showEvaluationRemarksModal() {
    this.evaluationRemarksModal.show();
  }

  rotateImage() {
    if (this.rotationDegree === 360) {
      this.rotationDegree = 90;
    } else {
      this.rotationDegree += 90;
    }
  }

  getSurveyData(obj) {
    debugger;
    if (this.projectType != "Tapal" && this.projectType != "NFL_SRO") {
      this.getShopLocations(obj);
    }
    if (this.projectType != "Tapal") {
      this.getShopFascia(obj);
    }
    this.getVisitDetails(obj);
  }

  getVisitDetails(obj) {
    debugger;
    this.loading = true;
    this.httpService.getShopDetails(obj).subscribe(
      (data) => {
        if (data) {
          this.data = data;
          for (const section of this.data.section) {
            this.setImageUrl(section, obj.imageView);
          }
          this.surveyDetails = this.data.shopDetails;
          document.title =
            this.surveyDetails.surveyorName +
            " - " +
            this.surveyDetails.shopTitle;


            // localStorage.setItem("mapBoxToken", localStorage.getItem("mapBoxToken") || this.surveyDetails?.mapKey);
            localStorage.setItem("mapBoxToken", this.surveyDetails?.mapKey);
            console.log("this.surveyDetails?.mapKey: ",this.surveyDetails?.mapKey);
            console.log(" home localStorage.getItem(mapBoxToken): ",localStorage.getItem("mapBoxToken"));


          this.show_unit_available =
            this.surveyDetails.show_unit_available || "Y";
          if (this.projectType == "NFL") {
            this.exceptionList = this.data.exceptionDetails;
          }
          if (this.data.criteria) {
            this.evaluationArray = this.data.criteria;
            this.cloneArray = this.evaluationArray.slice();
            this.existingRemarks = this.data.ExistingRemarks || [];
            this.evaluationRemarks = this.data.EvaluationRemarks || [];
            this.calculateScore();
            this.remarksList = this.data.remarks;
          }
          this.setView();
          // console.log(this.data)
        }
        this.loading = false;
      },
      (error) => {
        this.toastr.error(
          "Error",
          "Something Went Wrong. Please check your internet " + error
        );
        this.loading = false;
      }
    );
    console.log("sectionlist in home: ", this.sectionList);
  }

  getData(obj) {
    debugger;
    this.httpService.getShopDetails(obj).subscribe(
      (data) => {
        if (data) {
          this.data = data;
          this.surveyDetails = this.data.shopDetails;
          document.title =
            this.surveyDetails.surveyorName +
            " - " +
            this.surveyDetails.shopTitle;
          this.show_unit_available =
            this.surveyDetails.show_unit_available || "Y";

          localStorage.setItem("mapBoxToken", localStorage.getItem("mapBoxToken") || this.surveyDetails?.mapKey);


          for (const section of this.data.section) {
            this.setImageUrl(section, obj.imageView);
          }
          if (this.projectType == "NFL") {
            this.exceptionList = this.data.exceptionDetails;
          }
          if (this.data.criteria) {
            this.evaluationArray = this.data.criteria;
            this.cloneArray = this.evaluationArray.slice();
            this.existingRemarks = this.data.ExistingRemarks || [];
            this.evaluationRemarks = this.data.EvaluationRemarks || [];
            this.calculateScore();
            this.remarksList = this.data.remarks;
          }

          // console.log(this.data)

          if (this.userType) {
            if (this.userType == this.evaluatorRole) {
              this.setViewForEvaluation();
            } else if (this.userType == this.reevaluatorRole) {
              this.setViewForReeevaluation();
            } else {
              this.setDefaultView();
            }
          } else {
            this.setDefaultView();
          }
          this.totalAchieveScore = this.getTotalAchieveScore();
        }
      },
      (error) => {
        this.toastr.error(
          "Error",
          "Something Went Wrong. Please check your internet " + error
        );
        this.loading = false;
      }
    );
  }

  getShopFascia(obj) {
    this.loading = true;
    this.httpService.getShopFascia(obj).subscribe(
      (data) => {
        if (data) {
          this.setImageUrl(data, obj.imageView);
        }
        this.loading = false;
      },
      (error) => {
        this.toastr.error(
          "Error",
          "Something Went Wrong. Please check your internet " + error
        );
        this.loading = false;
      }
    );
  }

  getShopLocations(obj) {
    debugger;
    this.loading = true;
    this.httpService.getShopCoordinates(obj).subscribe(
      (data) => {
        if (data) {
          this.setImageUrl(data, obj.imageView);
        }
        this.loading = false;
      },
      (error) => {
        this.toastr.error(
          "Error",
          "Something Went Wrong. Please check your internet " + error
        );
        this.loading = false;
      }
    );
  }

  setView() {
    if (this.userType) {
      if (this.userType == this.evaluatorRole) {
        this.setViewForEvaluation();
      } else if (this.userType == this.zsmRole) {
        this.setViewForZSM();
      } else if (this.userType == this.reevaluatorRole) {
        this.setViewForReeevaluation();
      } else {
        this.setDefaultView();
      }
    } else {
      this.setDefaultView();
    }
    this.totalAchieveScore = this.getTotalAchieveScore();
  }

  addSection(sectionList) {
    for (const section of sectionList) {
      this.sectionList.push(section);
    }
  }
  setViewForEvaluation() {
    if (this.surveyDetails.evaluationStatus == -1) {
      if (!this.checkUser()) {
        this.toastr.error(
          "You are not allowed to View this shop this this login. Please login with the relevent id"
        );
        localStorage.removeItem("isLoggedin");
        this.router.navigate(["/login"]);
      } else {
        this.isEditable = true;
        this.showCriteria = true;
        this.setAutoCalculations();
        this.startEvaluationModal.show();
      }
    }
    this.errorMessage =
      "Visit Link: " +
      encodeURIComponent(this.ip + environment.hash + this.router.url);
  }
  setAutoCalculations() {
    for (const criteria of this.cloneArray) {
      if (criteria.autoCalculation == "Y") {
        if (criteria.assetTypeId > -1) {
          this.setEvaluationCriteria(criteria);
        } else {
          this.setPSKUCriteria(criteria);
        }
      }
    }
  }

  autoCalculateCriteria(criteria) {
    if (criteria.assetTypeId > -1) {
      this.setEvaluationCriteria(criteria);
    } else {
      this.setPSKUCriteria(criteria);
    }
    const i = this.cloneArray.findIndex((e) => e.id == criteria.id);
    this.totalAchieveScore =
      this.totalAchieveScore + Math.abs(this.cloneArray[i].achievedScore);
  }

  setViewForReeevaluation() {
    if (this.surveyDetails.evaluationStatus != -1) {
      this.showCriteria = true;
      this.isEditable = true;
      this.checkEvaluatedRemarks();
      this.setRemarksForReEvaluation();
    }
  }

  setDefaultView() {
    if (
      this.surveyDetails.evaluationStatus != -1 &&
      this.projectType != "Coke_Audit"
    ) {
      this.checkEvaluatedRemarks();
      this.setRemarksForReEvaluation();
      this.showCriteria = true;
    }
  }

  setRemarksForReEvaluation() {
    if (this.existingRemarks.length > 0) {
      for (const element1 of this.existingRemarks) {
        for (const element of this.cloneArray) {
          if (element1.criteriaId === element.id) {
            if (this.cloneArray[this.i].remarkId) {
              this.cloneArray[this.i].remarkId.push(element1);
              this.i++;
            } else {
              this.cloneArray[this.i].remarkId = [];
              this.cloneArray[this.i].remarkId.push(element1);
              this.i++;
            }
          } else {
            this.i++;
          }
        }
        this.i = 0;
      }
    }
  }

  checkEvaluatedRemarks() {
    if (this.existingRemarks.length > 0) {
      this.existingRemarks.forEach((element1) => {
        if (element1.id > 0) {
          const obj = {
            id: element1.id,
            description: element1.description,
            criteriaId: element1.criteriaId,
            remarkType: element1.remarkType,
            isChecked: element1.isChecked,
          };
          this.remarksList.forEach((element) => {
            const i = this.remarksList.findIndex((e) => e.id === element1.id);
            if (i !== -1) {
              this.remarksList.splice(i, 1, obj);
            }
          });
        }
      });
    }
  }

  calculateMSLAgain(products) {
    this.msl = this.data.msl;
    localStorage.setItem("productList", JSON.stringify(products));
    this.productList = localStorage.getItem("productList");

    this.availabilityCount = Math.round(this.getMSLNAvailbilityCount(products)); // Math.round(this.getAvailabilityCount(products));
  }

  getMSLNAvailbilityCount(products) {
    const pro = [];
    const msl = [];
    products.forEach((p) => {
      let obj = {};
      if (p.MSL === "Yes" && p.available_sku === 1) {
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

    const MSLScore = (pro.length / this.MSLCount) * 10;
    return MSLScore;
  }
  getAvailabilityCount(products) {
    if (!products) {
      products = localStorage.getItem("productList");
    }
    const pro = products.map((p) => p.available_sku);
    const sum = pro.reduce((a, v) => a + v);
    return (sum / pro.length) * this.msl;
  }

  getCriteriaWithRemarks(remarks, criteria) {
    const obj = {
      remarkId: remarks,
      id: criteria.id,
      title: criteria.title,
      score: criteria.score,
      type: criteria.type,
      parentId: criteria.parentId,
      criteriaMapId: criteria.criteriaMapId,
      hasChild: criteria.hasChild,
      assetTypeId: criteria.assetTypeId,
      autoCalculation: criteria.autoCalculation,
      // achievedScore: (criteria.isEditable)? (this.criteriaDesireScore==criteria.score)?0:this.criteriaDesireScore : 0,

      achievedScore: criteria.isEditable ? this.criteriaDesireScore : 0,
      isEditable: criteria.isEditable,
      isChecked: 1,
    };
    this.cloneArray.forEach((element) => {
      const i = this.cloneArray.findIndex((e) => e.id === criteria.id);
      this.cloneArray.splice(i, 1, obj);
    });
    // this.subtractScore(this.selectedCriteria);
    // this.evaluationArray.push(obj);
    console.log("evaluation array clone", this.cloneArray);
    // this.updateAchieveScore(criteria.id);
    this.hideRemarksModal();
    this.selectedRemarks = "";
    this.selectedRemarksList = [];
    this.criteriaDesireScore = 0;
  }

  checkboxChange(event, remark) {
    console.log("checkbox event", !event.checked, remark.id);

    if (!event.checked) {
      this.selectedRemarksList.push(remark);
    } else {
      for (let i = 0; i < this.selectedRemarksList.length; i++) {
        if (this.selectedRemarksList[i].id === remark.id) {
          this.selectedRemarksList.splice(i, 1);
        }
      }
    }
    // this.selectedRemarksList.pop(id)

    console.log("remarks list", this.selectedRemarksList);
  }

  updateAchieveScore(id) {
    for (let index = 0; index < this.cloneArray.length; index++) {
      const element = this.cloneArray[index];
      const aScore = element.achievedScore;

      if (element.id === id) {
        this.cloneArray[index].achievedScore =
          this.criteriaDesireScore > 0 ? this.criteriaDesireScore : aScore;
      }
    }
    this.totalAchieveScore = this.getTotalAchieveScore();
  }

  getTotalAchieveScore() {
    let score = 0;
    this.cloneArray.forEach((element) => {
      if (element.score < 0 && element.achievedScore == 0) {
        score = score + element.score;
      } else if (element.achievedScore >= 0) {
        score = score + element.achievedScore;
      }
    });
    return score;
  }

  subtractScore(criteria) {
    this.totalAchieveScore =
      this.criteriaDesireScore > 0
        ? this.totalAchieveScore -
          Math.abs(criteria.score - this.criteriaDesireScore)
        : this.totalAchieveScore - Math.abs(criteria.achievedScore);
  }

  isAnyCriteriaCheck() {
    let result = false;
    this.cloneArray.forEach((element) => {
      if (element.isChecked) {
        result = true;
      }
    });

    return result;
  }

  counter(event, criteria, index) {
    this.createTickForSlider(criteria);
    this.selectedIndex = index;
    // console.dir(event.checked)
    if (event.checked) {
      if (criteria.type == "CRITICAL_CASE") {
        this.isCritical = false;
      } else {
        this.isNoNCritical = true;
        this.isCritical = true;
      }

      this.indexList.push(index);
      // this.updateAchieveScore(criteria.id);

      this.selectedCriteria = criteria;
      if (!criteria.isEditable) {
        this.subtractScore(this.selectedCriteria); // Editable criteria score will be deducted after selecting the remarks
      }
      this.showRemarksModal();
    } else {
      this.unCheckCriteriaRemarks(criteria);
      const i = this.indexList.indexOf(index);
      this.indexList.splice(i, 1);
      if (criteria.autoCalculation == "Y") {
        this.autoCalculateCriteria(criteria);
      } else {
        this.addScore(criteria);
        if (this.evaluationArray.length > 0) {
          const obj = {
            remarkId: [],
            id: criteria.id,
            title: criteria.title,
            score: criteria.score,
            criteriaMapId: criteria.criteriaMapId,
            assetTypeId: criteria.assetTypeId,
            achievedScore:
              criteria.score > criteria.achievedScore || criteria.score < 0
                ? criteria.score
                : criteria.achievedScore,
            isEditable: criteria.isEditable,
            isChecked: 0,
            hasChild: criteria.hasChild,
            parentId: criteria.parentId,
            autoCalculation: criteria.autoCalculation,
          };
          const e = this.evaluationArray.findIndex((i) => i.id === criteria.id);
          this.cloneArray.splice(e, 1, obj);
        }
        this.selectedRemarksList = [];
        this.checkForCritical(criteria);
      }
    }
  }

  unCheckCriteriaRemarks(criteria) {
    for (let index = 0; index < this.myCheckbox._results.length; index++) {
      if (this.myCheckbox._results[index].name == criteria.id) {
        this.myCheckbox._results[index]._checked = false;
      }
    }
  }

  addScore(criteria) {
    this.totalAchieveScore = criteria.isEditable
      ? this.totalAchieveScore +
        Math.abs(criteria.score - criteria.achievedScore)
      : this.totalAchieveScore + Math.abs(criteria.score);
  }

  cancelCriteriaSelection() {
    this.unCheckCriteriaRemarks(this.selectedCriteria);
    const criteria = this.selectedCriteria;
    const i = this.indexList.indexOf(this.selectedIndex);
    this.indexList.splice(i, 1);
    // handling auto calculations
    if (criteria.autoCalculation == "Y") {
      this.autoCalculateCriteria(criteria);
    } else {
      if (this.evaluationArray.length > 0) {
        if (!criteria.isEditable) {
          this.addScore(criteria);
        }
        const obj = {
          remarkId: [],
          id: criteria.id,
          title: criteria.title,
          score: criteria.score,
          criteriaMapId: criteria.criteriaMapId,
          achievedScore:
            criteria.score > criteria.achievedScore
              ? criteria.score
              : criteria.achievedScore,
          assetTypeId: criteria.assetTypeId,
          isEditable: criteria.isEditable,
          isChecked: 0,
          hasChild: criteria.hasChild,
          parentId: criteria.parentId,
          autoCalculation: criteria.autoCalculation,
        };
        const e = this.evaluationArray.findIndex((i) => i.id === criteria.id);
        this.cloneArray.splice(e, 1, obj);
      }
    }
    this.selectedRemarksList = [];
    this.checkForCritical(criteria);
    this.hideRemarkModalForCancelOption();
  }
  checkForCritical(criteria) {
    if (criteria.type === "CRITICAL_CASE") {
      this.isCritical = true;
      this.isNoNCritical = false;
    } else {
      const result = this.isAnyCriteriaCheck();
      if (!result) {
        this.isNoNCritical = false;
      }
      this.isCritical = true;
    }
  }
  calculateScore() {
    this.score;
    this.data.criteria.map((c) => {
      if (c.score > 0) {
        this.score += c.score;
      }
    });
  }
  // makeScoreZero(){
  //   let result=[];
  //   this.cloneArray.forEach(element => {

  //     if()

  //   });
  // }
  evaluateShop() {
    const user_id = localStorage.getItem("user_id");
    if (
      user_id == this.surveyDetails.evaluatorId ||
      this.userType == this.reevaluatorRole
    ) {
      this.loading = true;
      const obj = {
        criteria: this.cloneArray,
        surveyId: this.surveyId,
        evaluatorId: user_id,
        surveyorId: this.surveyDetails.surveyorId,
        visitDate: this.surveyDetails.visitDate,
        channelId: this.surveyDetails.channelId,
        evaluationRemark:
          this.userType == this.reevaluatorRole
            ? this.selectedEvaluationRemark
            : -1,
        evaluationStartDateTime: this.evaluationStartDateTime,
        evaluationEndDateTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        status: this.checkForSlectedRemarks(this.cloneArray),
      };

      this.evaluationService.evaluateShop(obj).subscribe(
        (data: any) => {
          // console.log('evaluated shop data',data);
          this.loading = false;

          // tslint:disable-next-line:triple-equals
          if (data.success == "true") {
            this.hideRemarksModalWithNoChange();
            this.toastr.success("shop evaluated successfully ");
            this.evaluationArray = [];
            this.cloneArray = [];
            this.indexList = [];
            setTimeout(() => {
              window.close();
            }, 2000);
          } else {
            this.toastr.error(data.errorMessage, "Error");
          }
        },
        (error) => {
          // console.log('evaluated shop error',error)
          // window.close()
          this.loading = false;
          this.toastr.error(error.message, "Error");
        }
      );
    } else {
      this.toastr.error(
        "You are not Allowed to evaluate this shop with this user",
        "Error"
      );
      localStorage.removeItem("isLogdomgedin");
      this.router.navigate(["/login"]);
    }
  }

  checkForSlectedRemarks(list) {
    let result = 1;
    list.forEach((element) => {
      if (element.remarkId && element.remarkId.length > 0) {
        result = 2;
      }
    });

    return result;
  }
  updateSoS() {
    if (this.selectedSoS.total_com_height <= 0) {
      this.toastr.warning("Height must be greater than zero.");
    } else {
      this.hideSoSModal();
    }

    const obj = {
      userId: parseInt(localStorage.getItem("user_id")),
      width: parseInt(this.selectedSoS.total_width),
      com_width: parseInt(this.selectedSoS.total_com_width),
      merchandiserId: parseInt(this.selectedSoS.merchandiser_survey_id),
    };

    console.log("final SoS object", obj);
    this.httpService.updateSOS(obj).subscribe(
      (data: any) => {
        if (data.success) {
          this.toastr.info("SOS width is updated");
        }
        // alert(data)
      },
      (error) => {
        this.toastr.error(
          "Error",
          "Something Went Wrong. Please check your internet " + error
        );
        this.loading = false;
      }
    );
  }

  showChildModal(shop): void {
    this.selectedShop = shop;
    this.rotationDegree = 0;
    this.childModal.show();
  }

  hideChildModal(): void {
    this.childModal.hide();
  }

  showSoSModal(item): void {
    console.log("output item", item);
    this.selectedSoS = item;
    this.sosModal.show();
  }

  hideSoSModal(): void {
    this.sosModal.hide();
  }

  showExceptionDetailModal() {
    this.exceptionDescriptionModal.show();
  }

  hideExceptionDetailModal() {
    this.exceptionDescriptionModal.hide();
  }
  showRemarksModal() {
    this.criteriaDesireScore = 0; // this.selectedCriteria.achievedScore;
    if (this.existingRemarks.length > 0) {
      this.existingRemarks.forEach((element) => {
        if (element.criteriaId === this.selectedCriteria.id) {
          this.selectedRemarksList.push(element);
        }
      });
    }

    this.remarksModal.show();
  }

  hideRemarkModalForCancelOption() {
    this.remarksModal.hide();
  }
  hideRemarksModal() {
    if (this.selectedCriteria.isEditable) {
      this.subtractScore(this.selectedCriteria);
    }
    this.remarksModal.hide();
  }
  singleCheckboxChange(id) {
    this.selectedEvaluationRemark = id;
  }

  hideRemarksModalWithNoChange() {
    this.evaluationRemarksModal.hide();
  }

  isValidImage(url) {
    var http = new XMLHttpRequest();

    http.open("HEAD", url, false);
    http.send();

    return http.status != 404 && http.status != 403;
  }

  setImageUrl(data, imageView) {
    if(data?.imageList){
    for (const image of data?.imageList) {
      // if (image?.url != null) {
      //   if (image?.url?.indexOf("http") >= 0) {
      //     const i = data?.imageList?.findIndex((e) => e.url == image.url);
      //     data.imageList[i].isExternalUrl = true;
      //   }
      // }
      if (image?.url != null && image.url.indexOf("http") >= 0) {
        image.isExternalUrl = true; // Set the flag directly on the image object
      }
    }
  }
    if (imageView == "Y") {
      this.rightRatio = 0;
      this.leftRatio = 12;
      if (data?.imageList?.length > 0) {
        const obj = {
          sectionTitle: data.sectionTitle,
          imageViewType: data.imageViewType,
          sectionAlignment: data.sectionAlignment,
          assetTypeId: data.assetTypeId,
          imageList: data.imageList,
          planogramImageList: data.planogramImageList,
          // tagsList: data.tagsList,
          categoryHurdleRate: data.categoryHurdleRate,
          categoryDesiredSos: data.categoryDesiredSos,
          imageView: "Y",
        };
        this.sectionList.push(obj);
      }
    } else {
      this.sectionList.push(data);
    }
  }

  checkUser() {
    return this.surveyDetails.evaluatorId == localStorage.getItem("user_id")
      ? true
      : false;
  }

  setViewForZSM() {
    if (
      this.surveyDetails.zsmVerified == "-1" &&
      this.surveyDetails.workStatus != "ww" &&
      this.surveyDetails.workStatus != "wr"
    ) {
      this.isEditable = true;
      this.showCriteria = true;
    }
  }

  downloadPDF2() {
    //var node = document.getElementById("left-pane");
    // domtoimage.toJpeg(document.getElementById('left-pane'), { quality: 0.95 })
    // .then(function (dataUrl) {
    //     var link = document.createElement('a');
    //     link.download = 'my-image-name.jpeg';
    //     link.href = dataUrl;
    //     link.click();
    // });

    domtoimage
      .toPng(document.getElementById("left-pane"), { quality: 0.95 })
      .then(function (dataUrl) {
        var link = document.createElement("a");
        link.download = "area-chart.png";
        link.href = dataUrl;
        link.click();
      });

    //     debugger;
    //     var node = document.getElementById('left-pane');

    // domtoimage.toPng(node)
    //     .then(function (dataUrl) {
    //       debugger;
    //         var img = new Image();
    //         img.src = dataUrl;
    //         document.body.appendChild(img);
    //     })
    //     .catch(function (error) {
    //       debugger;
    //         console.error('oops, something went wrong!', error);
    //     });
  }

  downloadPDF() {
    debugger;
    this.loadingDownload = true;
    const that = this;
    var node = document.getElementById("left-pane");
    var img;
    var filename;
    var newImage;
    domtoimage
      .toPng(
        node
        //   , {
        //   width: node.scrollWidth,
        //   height: node.scrollHeight,
        //   bgcolor: "#fff",
        // }
      )
      .then(function (dataUrl) {
        img = new Image();
        img.src = dataUrl;
        newImage = img.src;
        img.onload = function () {
          var pdfWidth = img.width;
          var pdfHeight = img.height;
          var doc;

          if (pdfWidth > pdfHeight) {
            doc = new jspdf("l", "px", [pdfWidth, pdfHeight]);
          } else {
            doc = new jspdf("p", "px", [pdfWidth, pdfHeight]);
          }

          var width = doc.internal.pageSize.getWidth();
          var height = doc.internal.pageSize.getHeight();
          doc.addImage(newImage, "PNG", 10, 10, width, height);
          filename = that.surveyDetails.shopTitle + ".pdf";
          doc.save(filename);
          that.loadingDownload = false;
        };
      })
      .catch(function (error) {
        console.log(error);
        that.loadingDownload = false;
      });
  }

  setEvaluationCriteria(criteria) {
    debugger;
    for (const element of this.sectionList) {
      if (element.assetTypeId == criteria.assetTypeId) {
        const obj = {
          id: criteria.id,
          title: criteria.title,
          score: criteria.score,
          criteriaMapId: criteria.criteriaMapId,
          achievedScore: this.getFacingScore(element.skuTable, criteria.score),
          isEditable: criteria.isEditable,
          isChecked: 0,
          hasChild: criteria.hasChild,
          parentId: criteria.parentId,
          assetTypeId: criteria.assetTypeId,
          autoCalculation: criteria.autoCalculation,
        };
        const i = this.cloneArray.findIndex((e) => e.id === criteria.id);
        this.cloneArray.splice(i, 1, obj);
      }
    }
  }

  getFacingScore(list, score) {
    let totalFacing = 0;
    let totalDesiredFacing = 0;
    let total = 0;
    list.forEach((element) => {
      // tslint:disable-next-line:triple-equals
      if (element.MSL == "Yes") {
        totalFacing = totalFacing + element.face_unit;
        totalDesiredFacing = totalDesiredFacing + element.desired_facing;
      }
    });
    if (totalFacing > totalDesiredFacing) {
      totalFacing = totalDesiredFacing;
    }
    total =
      parseFloat(((totalFacing / totalDesiredFacing) * score).toFixed(2)) || 0;
    return total;
  }

  setPSKUCriteria(criteria) {
    let totalSkus = 0;
    let achievedSkus = 0;
    debugger;
    for (const element of this.sectionList) {
      if (element.imageViewType === 7) {
        element.skuTable?.forEach((p) => {
          // tslint:disable-next-line:triple-equals
          if (p.is_competition == 1) {
            totalSkus++;
            if (p.available_sku >= 1) {
              achievedSkus++;
            }
          }
        });
      }
    }
    const score =
      parseFloat(((achievedSkus / totalSkus) * criteria.score).toFixed(2)) || 0;
    const obj = {
      id: criteria.id,
      title: criteria.title,
      score: criteria.score,
      criteriaMapId: criteria.criteriaMapId,
      hasChild: criteria.hasChild,
      parentId: criteria.parentId,
      assetTypeId: criteria.assetTypeId,
      achievedScore: score,
      isEditable: criteria.isEditable,
      autoCalculation: criteria.autoCalculation,
      isChecked: 0,
    };
    const i = this.cloneArray.findIndex((e) => e.id == criteria.id);
    this.cloneArray.splice(i, 1, obj);
  }

  evaluateZsmShop(status) {
    this.selectedZsmStatus = status;
    this.loading = true;
    let surveyId = [];
    surveyId.push(this.surveyDetails.surveyId);
    const obj = {
      userId: localStorage.getItem("u_surveyor_id"),
      surveyIds: surveyId,
      status: status,
    };
    this.httpService.evaluateZsmShops(obj).subscribe(
      (data: any) => {
        if (data.id == 1) {
          this.toastr.success(data.title, data.description);
          setTimeout(() => {
            window.close();
          }, 2000);
        } else {
          this.toastr.error(data.title, data.description);
        }
      },
      (error) => {
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
        this.loading = false;
      }
    );
  }

  getEvaluationStartTime() {
    this.evaluationStartDateTime = moment(new Date()).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    this.startEvaluationModal.hide();
  }

  //pdf from backend
  // styling issue
  convertToPDF() {
    const pdfTableElement = this.el.nativeElement.querySelector('#pdfTable1');
  if (pdfTableElement) {
    const tableAsString = pdfTableElement.outerHTML;
    // const htmlContent = document.getElementById("pdfTable1");
    const htmlContent = pdfTableElement.outerHTML;

    this.pdfConversionService.convertToPDF(htmlContent);
  }
}


}
