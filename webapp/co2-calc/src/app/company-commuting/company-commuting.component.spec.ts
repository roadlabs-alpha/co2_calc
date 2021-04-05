import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyCommutingComponent } from './company-commuting.component';

describe('CompanyCommutingComponent', () => {
  let component: CompanyCommutingComponent;
  let fixture: ComponentFixture<CompanyCommutingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyCommutingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyCommutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
