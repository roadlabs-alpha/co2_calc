import { Component, OnInit } from '@angular/core';
import {MatFormFieldControl} from "@angular/material/form-field"
import { FormControl, FormGroup } from '@angular/forms'
import { StateService } from '../state.service';
import { DataService, Data} from '../data.service';



@Component({
	selector: 'app-company-vehicles',
	templateUrl: './company-vehicles.component.html',
	styleUrls: ['./company-vehicles.component.css', "../app.component.css"],
})



export class CompanyVehiclesComponent implements OnInit{

	change_detected=true;

	vt_form_changer=1;

	is_private_use = false;
	is_pool_car = false;
	n_total_vehicles=0;

	vehicle_types=[
	{"id":0, "name": "Bike", value:"bike"},
	{"id":1, "name": "Car", value: "car"}
	]

	vehicle_classes=[
	{"id":0, "name": "Compact", value:"compact"},
	{"id":1, "name": "Executive", value:"executive"},
	{"id":2, "name": "Transporter", value:"transporter"},
	]

	mileage_classes = [
	{"id":0, "name": "<5000 km", "value":[0,5000]},
	{"id":1,"name": "5000-10000 km", "value":[5000, 10000]},
	{"id":2,"name": "10000-20000 km", "value":[10000,20000]},
	{"id":3,"name": "20000-30000 km", "value":[20000,30000]}
	];
	
	vehicle_propulsions=[
	{"id":0, "name": "Electric", "value":"electric"},
	{"id":1, "name": "Gasoline", "value":"gasoline"},
	{"id":2, "name": "Diesel", "value":"diesel"}]

	vehicle_groups: Array<VehicleGroup>=[];
	vgn=this.generate_vehicle_group_name(0);


	fg_vehicleclass = new FormGroup({
		fc_vehicletype: new FormControl('1'),
		fc_vehicleclass: new FormControl('compact'),
		fc_vehicleprop: new FormControl('electric'),
		fc_mileage: new FormControl("0"),
		fc_poolcar: new FormControl(false),
		fc_privateuse: new FormControl(false),
		fc_count: new FormControl(1),
		fc_add: new FormControl(false),
	});

	constructor(private stateService: StateService) { }

	ngOnInit(): void {

		var vt = this.fg_vehicleclass.get("fc_vehicletype")
		if (vt!= null){
			vt.valueChanges.subscribe(val => {
				this.change_forms_on_vehicle_type(val)
			});
		}
	}

	change_forms_on_vehicle_type(val: string): void{

		console.log("VAL: ", val)

		if (val == "0"){ // is BIke
			this.vehicle_classes=[]

			this.vehicle_propulsions=[
			{"id":0, "name": "Human", "value":"human"},
			{"id":1, "name": "Electric", "value":"electric"}]

			this.fg_vehicleclass.value.fc_vehicleclass=""
		}

		if (val == "1"){ // is Car
			this.vehicle_classes=[
			{"id":0, "name": "Compact", value:"compact"},
			{"id":1, "name": "Executive", value:"executive"},
			{"id":2, "name": "Transporter", value:"transporter"}]

			this.vehicle_propulsions=[
			{"id":0, "name": "Electric", "value":"electric"},
			{"id":1, "name": "Gasoline", "value":"gasoline"},
			{"id":2, "name": "Diesel", "value":"diesel"}]
		}

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
		var milage = this.mileage_classes[Number(this.fg_vehicleclass.value.fc_mileage)].value;
		var vg = new VehicleGroup(vgn, milage, this.vehicle_types[this.fg_vehicleclass.value.fc_vehicletype].value, this.fg_vehicleclass.value.fc_vehicleprop, this.fg_vehicleclass.value.fc_vehicleclass);
		

		//vg.mileage = this.mileage_classes[Number(this.fg_vehicleclass.value.fc_mileage)].value
		vg.mileage_name = this.mileage_classes[Number(this.fg_vehicleclass.value.fc_mileage)].name
		
		vg.count = this.fg_vehicleclass.value.fc_count;
		vg.is_poolcar = this.fg_vehicleclass.value.fc_poolcar;
		vg.is_private_use = this.fg_vehicleclass.value.fc_privateuse;
		//var vg = "as";
		this.vehicle_groups.push(vg);

		this.calc_total_vehicle_count();
		this.vgn=this.generate_vehicle_group_name(1);
		this.change_detected = true;

	}

	delete_vehicle_group(vgi: number): void{

		console.log("del element", vgi)
		this.vehicle_groups.splice(vgi,1);
		this.vgn=this.generate_vehicle_group_name(0);
		this.calc_total_vehicle_count();
		this.change_detected = true;
	}

	save_vehicle_groups(): void{
		this.stateService.state.vehicle_groups_user = this.vehicle_groups
		console.log("Saved vehicle groups: ", this.vehicle_groups)
		this.change_detected = false

	}

	calc_total_vehicle_count(): void{

		this.n_total_vehicles=0;
		for (var i=0; i<this.vehicle_groups.length; i++){
			this.n_total_vehicles += Number(this.vehicle_groups[i].count);
		}
	}
}

export class VehicleGroup{
	vgn="";
	is_private_use=0;
	is_poolcar=0;
	veh_type=""
	vehicleclass="";
	vehicleprop="";
	mileage: Array<number>=[];
	mileage_name="";
	count=0;
	mean_mileage=0;
	vg_total_co2=0;
	vg_total_cost=0;

	vehicle: Vehicle;

	// group cost and co2 values, to be estimated

	constructor(vgn: string, milage: Array<number>, veh_type: string, tech: string, veh_class: string) { //vgn = vehicle group name 
		this.vgn=vgn
		this.vehicleprop = tech;
		this.vehicleclass = veh_class;
		this.veh_type = veh_type
		this.vehicle = new Vehicle(String(this.veh_type), String(this.vehicleprop), String(this.vehicleclass))



		this.mileage = milage;
		this.mean_mileage = (this.mileage[0] + this.mileage[1])/2
		this.vehicle.do_tco(this.mean_mileage)
	}


	calculate_vg_co2(): number{
		//console.log("total_yearly_co2: ", this.vehicle.total_yearly_co2)
		//console.log(this.vehicle.total_co2_per_km, this.mean_mileage, this.count)
		this.vg_total_co2 = this.vehicle.total_co2_per_km * this.mean_mileage * this.count
		return this.vg_total_co2

	}

	calculate_vg_cost(): number{
		this.vg_total_cost =  this.vehicle.total_cost_per_km * this.mean_mileage * this.count
		return this.vg_total_cost
	}



}




export class Vehicle{

	writeoff_period=0;
	workshop_cost=0;
	fixcost=0;
	consumption=0;
	tech: string;
	emissions_per_km=-1;
	new_price: number=0;
	residual_value: number=0;
	yearly_mileage: number=0;
	total_yearly_cost
	total_cost_per_km=-1;
	total_yearly_co2
	total_co2_per_km=-1;

	data = new Data();
	dataService


	constructor(veh_type: string, tech: string, vehicle_class: string){

		this.dataService = new DataService()

		this.getData()

		this.writeoff_period = 3 // years
		this.workshop_cost = 720 //€/year
		this.fixcost = 1200 //€/year



		if (tech=="electric"){
			this.tech="bev";
		}else{
			this.tech = tech;
		}

		if (veh_type == "bike"){
			this.tech = "bike"
			this.workshop_cost = 500 //€/year
			this.fixcost = 100 //€/year
			vehicle_class="bike"
		}

		



		var epk =  this.data.emissions_per_km.get(this.tech)
		if (epk != undefined){
			this.emissions_per_km = epk;
		}



		var vehicle_class_detail = this.data.vehicle_class.get(vehicle_class)
		if (vehicle_class_detail != undefined){
			this.new_price = vehicle_class_detail.price_new
			this.residual_value  = vehicle_class_detail.residual_value3y

			if (this.tech == "bev"){
				this.consumption = vehicle_class_detail.e_consumption;
			}
			else{
				this.consumption = vehicle_class_detail.consumption;
			}
		}

		this.total_yearly_cost = -1
		this.total_cost_per_km = -1
		this.total_yearly_co2 = -1
		this.total_co2_per_km = -1


	}

	do_tco(yearly_mileage: number){

		var value_loss = 0
		var yearly_loss=0
		var energy_cost_yearly=0

		this.yearly_mileage = yearly_mileage

		value_loss = this.new_price - this.residual_value
		yearly_loss = value_loss / this.writeoff_period

		
		var ep = this.data.energy_price.get(this.tech)
		if (ep != undefined){
			energy_cost_yearly = yearly_mileage * this.consumption / 100 * ep
		}

		this.total_yearly_cost = this.workshop_cost + this.fixcost + yearly_loss + energy_cost_yearly
		this.total_cost_per_km = this.total_yearly_cost / yearly_mileage
		
		var epe = this.data.emissions_per_energy.get(this.tech)
		if (epe != undefined){
			this.total_yearly_co2 = yearly_mileage * this.consumption / 100 * epe
		}
		this.total_co2_per_km = this.total_yearly_co2 / yearly_mileage

	}

	getData(): void {
		this.dataService.getData().subscribe(dat => this.data = dat);
	}

}