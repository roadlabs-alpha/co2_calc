import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyVehiclesComponent } from './company-vehicles.component';

describe('CompanyVehiclesComponent', () => {
  let component: CompanyVehiclesComponent;
  let fixture: ComponentFixture<CompanyVehiclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyVehiclesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
