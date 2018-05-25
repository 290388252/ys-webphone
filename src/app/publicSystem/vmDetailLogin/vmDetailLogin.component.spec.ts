import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VmDetailLoginComponent } from './vmDetailLogin.component';

describe('VmDetailLoginComponent', () => {
  let component: VmDetailLoginComponent;
  let fixture: ComponentFixture<VmDetailLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VmDetailLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VmDetailLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
