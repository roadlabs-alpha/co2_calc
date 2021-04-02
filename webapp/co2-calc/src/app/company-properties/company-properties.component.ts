import { Component, OnInit } from '@angular/core';
import { StateService } from '../state.service';

@Component({
  selector: 'app-company-properties',
  templateUrl: './company-properties.component.html',
  styleUrls: ['./company-properties.component.css', "../app.component.css"]
})
export class CompanyPropertiesComponent implements OnInit {

	n_employees = '300';
	company_address="";
	company_address_street="";
	company_address_zip="";
	company_address_city="";

  constructor(private stateService: StateService) { }



  save_data_to_state(): void{
  	this.stateService.state.n_employees = Number(this.n_employees);
  }

  ngOnInit(): void {
  	this.save_data_to_state()
  }




}
