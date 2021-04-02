import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Co2CostCalcComponent } from './co2-cost-calc.component';

describe('Co2CostCalcComponent', () => {
  let component: Co2CostCalcComponent;
  let fixture: ComponentFixture<Co2CostCalcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Co2CostCalcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Co2CostCalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
