import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyBusinesstripsComponent } from './company-businesstrips.component';

describe('CompanyBusinesstripsComponent', () => {
  let component: CompanyBusinesstripsComponent;
  let fixture: ComponentFixture<CompanyBusinesstripsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyBusinesstripsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyBusinesstripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
