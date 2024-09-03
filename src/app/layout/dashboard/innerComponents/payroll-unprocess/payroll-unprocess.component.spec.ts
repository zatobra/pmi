import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollUnprocessComponent } from './payroll-unprocess.component';

describe('PayrollUnprocessComponent', () => {
  let component: PayrollUnprocessComponent;
  let fixture: ComponentFixture<PayrollUnprocessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollUnprocessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollUnprocessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
