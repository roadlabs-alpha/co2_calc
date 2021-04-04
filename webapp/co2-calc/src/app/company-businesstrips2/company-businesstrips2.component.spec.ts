import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyBusinesstrips2Component } from './company-businesstrips2.component';

describe('CompanyBusinesstrips2Component', () => {
  let component: CompanyBusinesstrips2Component;
  let fixture: ComponentFixture<CompanyBusinesstrips2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyBusinesstrips2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyBusinesstrips2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
