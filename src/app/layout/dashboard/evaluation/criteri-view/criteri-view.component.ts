import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { EvaluationService } from "../evaluation.service";
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalDirective } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { ResizeEvent } from "angular-resizable-element";
import { Config } from "src/assets/config";

@Component({
  selector: "app-criteri-view",
  templateUrl: "./criteri-view.component.html",
  styleUrls: ["./criteri-view.component.scss"],
})
export class CriteriViewComponent implements OnInit {
  @Input("criteria") criteria;
  @Input("isEditable") isEditable;
  @Input("existingRemarks") existingRemarks;
  @Input("evaluationRemarks") evaluationRemarks;
  @Input("exceptionList") exceptionList;
  @Input("evaluationArray") evaluationArray;
  @Input("cloneArray") cloneArray;
  // ip = environment.ip;

  ip: any = Config.BASE_URI;
  loading = false;
  loadingDownload = false;
  selectedShop: any = {};

  @ViewChild("remarksModal") remarksModal: ModalDirective;
  @ViewChild("evaluationRemarksModal") evaluationRemarksModal: ModalDirective;
  @ViewChild("exceptionDescriptionModal")
  exceptionDescriptionModal: ModalDirective;

  score: any = 0;
  isChecked = 0;

  projectType: any;
  indexList: any = [];
  surveyId: any = 0;
  remarksList: any = [];
  selectedRemarks: any = true;
  selectedRemarksList: any = [];
  selectedCriteria: any = {};
  msl: any;
  availabilityCount: number;
  selectedEvaluationRemark = -1;
  j = -1;
  i = 0;
  p: any = {};
  isFromShop = true;
  rotationDegree = 0;
  userType: any;
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
  showCriteria: boolean;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private evaluationService: EvaluationService
  ) {
    this.userType = localStorage.getItem("user_type");
    this.projectType = localStorage.getItem("projectType");
    this.reevaluatorRole = localStorage.getItem("Reevaluator");
    this.evaluatorRole = localStorage.getItem("Evaluator");
  }
  value = 5;
  options: any = {
    showTicksValues: true,
    stepsArray: [{ value: 1 }],
  };

  createTickForSlider(maxTicks) {
    const result: any = [];

    for (let index = 0; index < maxTicks.score; index++) {
      result.push({ value: index });
    }
    this.options.stepsArray = result;
  }

  ngOnInit() {
    this.setData();
  }

  showEvaluationRemarksModal() {
    this.evaluationRemarksModal.show();
  }

  onResizeEnd(event: ResizeEvent): void {
    // console.log('Element was resized', event);
  }

  rotateImage() {
    if (this.rotationDegree === 360) {
      this.rotationDegree = 90;
    } else {
      this.rotationDegree += 90;
    }
  }

  setData() {
    if (this.criteria) {
      this.totalAchieveScore = this.getTotalAchieveScore();
      this.calculateScore();
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
      }
    }
    // } else {
    //   this.checkEvaluatedRemarks();
    //   this.setRemarksForReEvaluation();
    // }
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
    if (this.surveyDetails.evaluationStatus != -1) {
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
              this.cloneArray[this.i].remarkId.push(element1.id);
              this.i++;
            } else {
              this.cloneArray[this.i].remarkId = [];
              this.cloneArray[this.i].remarkId.push(element1.id);
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

  checkboxChange(event, id) {
    console.log("checkbox event", !event.checked, id);

    if (!event.checked) {
      this.selectedRemarksList.push(id);
    } else {
      for (let i = 0; i < this.selectedRemarksList.length; i++) {
        if (this.selectedRemarksList[i] === id) {
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
      if (element.totalAchievedScore) {
        score = element.totalAchievedScore;
        delete element.totalAchievedScore;
        return score;
      } else {
        if (element.achievedScore >= 0) {
          score = score + element.achievedScore;
        }
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
    this.selectedIndex = index;
    // console.dir(event.checked)
    if (event.checked) {
      if (criteria.type === "CRITICAL_CASE") {
        this.isCritical = false;
      } else {
        this.isNoNCritical = true;
        this.isCritical = true;
      }
      this.indexList.push(index);
      this.updateAchieveScore(criteria.id);

      this.selectedCriteria = criteria;
      if (!criteria.isEditable) {
        this.subtractScore(this.selectedCriteria);
      }
      this.showRemarksModal();
    } else {
      this.totalAchieveScore =
        this.totalAchieveScore + Math.abs(criteria.score);

      const i = this.indexList.indexOf(index);
      this.indexList.splice(i, 1);

      if (this.evaluationArray.length > 0) {
        const obj = {
          remarkId: [],
          id: criteria.id,
          title: criteria.title,
          score: criteria.score,
          type: criteria.type,
          parentId: criteria.parentId,
          hasChild: criteria.hasChild,
          criteriaMapId: criteria.criteriaMapId,
          achievedScore:
            criteria.score > criteria.achievedScore || criteria.score < 0
              ? criteria.score
              : criteria.achievedScore,
          isEditable: criteria.isEditable,
          isChecked: 0,
        };
        const e = this.evaluationArray.findIndex((i) => i.id === criteria.id);
        this.cloneArray.splice(e, 1, obj);
        console.log("unchecked evaluation array", this.cloneArray);
        this.selectedRemarksList = [];
        this.updateAchieveScore(criteria.id);
        this.checkForCritical(criteria);
      }
    }
  }

  cancelCriteriaSelection() {
    const inputs: any = document.querySelectorAll(".checkbox");
    for (let j = 0; j < inputs.length; j++) {
      if (this.selectedCriteria.id === inputs[j].id) {
        inputs[j].checked = false;
      }
    }
    const criteria = this.selectedCriteria;
    this.totalAchieveScore = this.totalAchieveScore + Math.abs(criteria.score);
    const i = this.indexList.indexOf(this.selectedIndex);
    this.indexList.splice(i, 1);

    if (this.evaluationArray.length > 0) {
      const obj = {
        remarkId: [],
        id: criteria.id,
        title: criteria.title,
        score: criteria.score,
        type: criteria.type,
        parentId: criteria.parentId,
        hasChild: criteria.hasChild,
        criteriaMapId: criteria.criteriaMapId,
        achievedScore:
          criteria.score > criteria.achievedScore
            ? criteria.score
            : criteria.achievedScore,
        isEditable: criteria.isEditable,
        isChecked: 0,
      };
      const e = this.evaluationArray.findIndex((i) => i.id === criteria.id);
      this.cloneArray.splice(e, 1, obj);
      console.log(
        "unchecked evaluation array,using cancel button",
        this.cloneArray
      );
    }

    this.checkForCritical(criteria);

    this.hideRemarkModalForCancelOption();
  }
  checkForCritical(criteria) {
    if (criteria.type == "CRITICAL_CASE") {
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
    this.criteria.map((c) => {
      if (c.score > 0) {
        this.score += c.score;
      }
    });
    // this.score=this.score-(this.msl);

    console.log("total score is", this.score);
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
      const req = true;

      if (req) {
        // tslint:disable-next-line:triple-equals
        if (this.userType == this.reevaluatorRole) {
          const obj = {
            criteria: this.cloneArray,
            surveyId: this.surveyId,
            evaluatorId: user_id,
            surveyorId: this.surveyDetails.surveyorId,
            visitDate: this.surveyDetails.visitDate,
            channelId: this.surveyDetails.channelId,
            evaluationRemark: this.selectedEvaluationRemark,
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
          const obj = {
            criteria: this.cloneArray,
            surveyId: this.surveyId,
            surveyorId: this.surveyDetails.surveyorId,
            visitDate: this.surveyDetails.visitDate,
            channelId: this.surveyDetails.channelId,
            evaluatorId: user_id,
            status: this.checkForSlectedRemarks(this.cloneArray),
          };

          this.evaluationService.evaluateShop(obj).subscribe(
            (data: any) => {
              // console.log('evaluated shop data',data);
              this.loading = false;
              // tslint:disable-next-line:triple-equals
              if (data.success == "true") {
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
        }
      }
    } else {
      this.toastr.error(
        "You are not Allowed to evaluate this shop with this user",
        "Error"
      );
      localStorage.removeItem("isLoggedin");
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

  showExceptionDetailModal() {
    this.exceptionDescriptionModal.show();
  }

  hideExceptionDetailModal() {
    this.exceptionDescriptionModal.hide();
  }

  showRemarksModal() {
    this.criteriaDesireScore = 0;

    if (this.existingRemarks.length > 0) {
      this.existingRemarks.forEach((element) => {
        if (element.id > 0 && element.criteriaId === this.selectedCriteria.id) {
          this.selectedRemarksList.push(element.id);
        }
      });
    }

    this.remarksModal.show();
  }

  hideRemarkModalForCancelOption() {
    if (this.selectedCriteria.isEditable) {
      this.subtractScore(this.selectedCriteria);
    }

    // this.updateAchieveScore(this.selectedCriteria.id)
    this.remarksModal.hide();
  }
  hideRemarksModal() {
    if (this.selectedCriteria.isEditable) {
      this.subtractScore(this.selectedCriteria);
    }

    // this.updateAchieveScore(this.selectedCriteria.id)
    // if(this.selectedRemarksList.length>0)
    this.remarksModal.hide();
    // else{
    //   this.toastr.info(`please select remarks for "${this.selectedCriteria.title}"`)
    // }
  }
  singleCheckboxChange(id) {
    this.selectedEvaluationRemark = id;
  }

  hideRemarksModalWithNoChange() {
    this.evaluationRemarksModal.hide();
  }

  checkUser() {
    return this.surveyDetails.evaluatorId == localStorage.getItem("user_id")
      ? true
      : false;
  }
}
