import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditPaymentComponent } from './creditPayment.component';

describe('DetailComponent', () => {
  let component: CreditPaymentComponent;
  let fixture: ComponentFixture<CreditPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
