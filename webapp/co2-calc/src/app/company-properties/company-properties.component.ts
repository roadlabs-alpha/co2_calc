import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-company-properties',
  templateUrl: './company-properties.component.html',
  styleUrls: ['./company-properties.component.css', "../app.component.css"]
})
export class CompanyPropertiesComponent implements OnInit {

	n_employees = '';
	company_address="";

  constructor() { }

  ngOnInit(): void {
  }

}
