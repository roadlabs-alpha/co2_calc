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

	vehicle_groupsaaa=[{
		"vehicleclass": "none",
		"vehicleprop": "none",
		"mileage": "none",
		"count": "none",
		"is_poolcar": "none",
		"is_private_use": "none",
	}]

	vehicle_groups: Array<VehicleGroup>=[];



	fg_vehicleclass = new FormGroup({
		fc_vehicleclass: new FormControl(''),
		fc_vehicleprop: new FormControl(''),
		fc_mileage: new FormControl(""),
		fc_poolcar: new FormControl(false),
		fc_privateuse: new FormControl(false),
		fc_count: new FormControl(0),
		fc_add: new FormControl(false),
	});

	constructor() { }

	ngOnInit(): void {
	}


	add_vehicle_group(): void{

		console.log("add vehicle group")
		console.log(this.fg_vehicleclass.value.fc_vehicleclass);
		console.log(this.fg_vehicleclass.value.fc_vehicleprop);
		console.log(this.fg_vehicleclass.value.fc_mileage);
		console.log(this.fg_vehicleclass.value.fc_count);
		console.log(this.fg_vehicleclass.value.fc_poolcar);
		console.log(this.fg_vehicleclass.value.fc_privateuse);

		var vg = new VehicleGroup();
		vg.is_private_use = this.fg_vehicleclass.value.fc_vehicleclass;
		vg.is_poolcar = this.fg_vehicleclass.value.fc_vehicleprop;
		vg.vehicleclass = this.fg_vehicleclass.value.fc_mileage;
		vg.vehicleprop = this.fg_vehicleclass.value.fc_count;
		vg.mileage = this.fg_vehicleclass.value.fc_poolcar;
		vg.count = this.fg_vehicleclass.value.fc_privateuse;
		//var vg = "as";
		this.vehicle_groups.push(vg);

		


		console.log(this.vehicle_groups);

	}

}

class VehicleGroup{
	is_private_use=0;
	is_poolcar=0;
	vehicleclass=0;
	vehicleprop=0;
	mileage=0;
	count=0;
	
	constructor() { }
}