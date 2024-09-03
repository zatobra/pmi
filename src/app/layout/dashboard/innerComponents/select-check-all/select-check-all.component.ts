import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-select-check-all',
  templateUrl: "./select-check-all.component.html",
  styleUrls: ['./select-check-all.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectCheckAllComponent implements OnInit, OnChanges, DoCheck {
  @Input() model: FormControl;
  @Input() values = [];

  
  @Input() text = 'All'; 
  @Output("showModal") showModal: any = new EventEmitter<any>();

  constructor(public cd: ChangeDetectorRef){

  }

  ngOnInit(){
    debugger;
    
    console.log("model: ", this.model);
    this.values = this.values.filter(e=>e.id!=-1);
    let k=0;
  }

  ngOnChanges(changes: SimpleChanges){
    
    console.log("model: ", this.model);
    console.log(changes)
    this.values = this.values.filter(e=>e.id!=-1);
    let k=0;
  }

  ngDoCheck(){
    
    
    console.log("model: ", this.model);
    // console.log(changes)
    this.values = this.values.filter(e=>e.id!=-1);
    let k=0;
    this.cd.markForCheck();
  }

  isChecked(): boolean {
    console.log("this.model: ", this.model);
    console.log("this.values: ", this.values);
    this.showModal.emit(this.model.value && this.values.length
      && this.model.value.length >= this.values.length);
    return this.model.value && this.values.length
      && this.model.value.length >= this.values.length;

  }

  // isIndeterminate(): boolean {
  //   return this.model.value && this.values.length && this.model.value.length
  //     && this.model.value.length < this.values.length;
  // }

  toggleSelection(change: MatCheckboxChange): void {
    debugger;
    if (change.checked) {
      this.model.setValue(this.values);
    } else {
      this.model.setValue([]);
    }

   // console.log("change", change.checked);
    // this.showModal.emit(change.checked);
  }
}
