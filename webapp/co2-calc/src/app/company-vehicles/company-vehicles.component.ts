import { Component, OnInit } from '@angular/core';
import {MatFormFieldControl} from "@angular/material/form-field"
import { FormControl, FormGroup } from '@angular/forms'



@Component({
	selector: 'app-company-vehicles',
	templateUrl: './company-vehicles.component.html',
	styleUrls: ['./company-vehicles.component.css', "../app.component.css"],
})


export class CompanyVehiclesComponent implements OnInit{



	is_private_use = false;
	is_pool_car = false;
	n_vehicles=0;
	vgn=0;



	fg_vehicleclass = new FormGroup({
		fc_vehicleclass: new FormControl(''),
		fc_vehicleprop: new FormControl(''),
		fc_mileage: new FormControl("")
	});

	fg_checks = new FormGroup({
		fc_poolcar: new FormControl(false),
		fc_privateuse: new FormControl(false),
	});

	fg_add = new FormGroup({
		fc_add: new FormControl(false),
	});

	constructor() { }

	ngOnInit(): void {
	}

}
