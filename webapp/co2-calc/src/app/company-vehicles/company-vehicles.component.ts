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
	n_total_vehicles=0;
	

	vehicle_groups: Array<VehicleGroup>=[];
	vgn=this.generate_vehicle_group_name(0);


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

	generate_vehicle_group_name(idx_add: number): string{

		var fist_guess = "Vehicle group "+String(this.vehicle_groups.length+1)

		var vgns=[];
		for (var i=0; i<this.vehicle_groups.length; i++){
			vgns.push(this.vehicle_groups[i].vgn)
		}

		var idx=0;
		while (vgns.includes(fist_guess)){
			fist_guess = "Vehicle group "+String(this.vehicle_groups.length+1+idx+idx_add)
			idx+=1;
		}

		return fist_guess
	}


	add_vehicle_group(): void{

		// console.log("add vehicle group")
		// console.log(this.fg_vehicleclass.value.fc_vehicleclass);
		// console.log(this.fg_vehicleclass.value.fc_vehicleprop);
		// console.log(this.fg_vehicleclass.value.fc_mileage);
		// console.log(this.fg_vehicleclass.value.fc_count);
		// console.log(this.fg_vehicleclass.value.fc_poolcar);
		// console.log(this.fg_vehicleclass.value.fc_privateuse);

		var vgn = this.generate_vehicle_group_name(0);
		var vg = new VehicleGroup(vgn);
		
		vg.vehicleclass = this.fg_vehicleclass.value.fc_vehicleclass;
		vg.vehicleprop = this.fg_vehicleclass.value.fc_vehicleprop;
		vg.mileage = this.fg_vehicleclass.value.fc_mileage;
		vg.count = this.fg_vehicleclass.value.fc_count;
		vg.is_poolcar = this.fg_vehicleclass.value.fc_poolcar;
		vg.is_private_use = this.fg_vehicleclass.value.fc_privateuse;
		//var vg = "as";
		this.vehicle_groups.push(vg);

		this.calc_total_vehicle_count();
		this.vgn=this.generate_vehicle_group_name(1);

	}

	delete_vehicle_group(vgi: number): void{

		console.log("del element", vgi)
		this.vehicle_groups.splice(vgi,1);
		this.vgn=this.generate_vehicle_group_name(0);
		this.calc_total_vehicle_count();
	}

	calc_total_vehicle_count(): void{

		this.n_total_vehicles=0;
		for (var i=0; i<this.vehicle_groups.length; i++){
			this.n_total_vehicles += Number(this.vehicle_groups[i].count);
		}
	}
}

class VehicleGroup{
	vgn="";
	is_private_use=0;
	is_poolcar=0;
	vehicleclass=0;
	vehicleprop=0;
	mileage=0;
	count=0;

	constructor(vgn: string) { 
		this.vgn=vgn
	}
}