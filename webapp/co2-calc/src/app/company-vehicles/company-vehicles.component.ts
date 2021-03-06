import { Component, OnInit } from '@angular/core';
import {MatFormFieldControl} from "@angular/material/form-field"
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { StateService } from '../state.service';
import { DataService, Data, Vehicle_Price} from '../data.service';



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

	show_custom_milage_input=false;
	show_custom_buy_vehicle_input=false;
	show_custom_lease_vehicle_input=false;

	temporal_vg_co2pkm=0;
	temporal_vg_costpkm=0;

	vehicle_class_data = new Vehicle_Price;

	data = new Data();


	// vehicle_types=[
	// {"id":0, "name": "Bike", value:"bike"},
	// {"id":1, "name": "Car", value: "car"}
	// ]

	vehicle_types=[]
	
	vehicle_classes=[{
		name: "Car Classes",
		vehicles:[
		{"id":0, "name": "Kleinstwagen",		 	value:"mini"},
		{"id":1, "name": "Kleinwagen", 				value:"small"},
		{"id":2, "name": "Untere Mittelklasse", 	value:"medium_small"},
		{"id":3, "name": "Mittelklasse", 			value:"medium"},
		{"id":4, "name": "Obere Mittelklasse", 		value:"medium_big"},
		{"id":5, "name": "Oberklasse", 				value:"big"}]
	},{
		name: "User defined",
		vehicles:[
		{"id":0, "name": "Custom Own Vehicle", value:"custom_buy"},
		{"id":1, "name": "Custom Leased Vehicle", value:"custom_lease"}]
	},{
		name: "Active",
		vehicles:[
		{"id":0, "name": "Bike", value:"bike"},
		{"id":1, "name": "e-Bike", value:"e-bike"},
		{"id":2, "name": "Cargo bike", value:"cargo_bike"}]
	}]


		mileage_classes = [
		{"id":0, "name": "<5000 km", "value":[0,5000]},
		{"id":1,"name": "5000-10000 km", "value":[5000, 10000]},
		{"id":2,"name": "10000-20000 km", "value":[10000,20000]},
		{"id":3,"name": "20000-30000 km", "value":[20000,30000]},
		{"id":4,"name": "custom", "value": [-1, -1]}
		];

		vehicle_propulsions=[
		{"id":0, "name": "Electric", "value":"electric"},
		{"id":1, "name": "Hybrid", "value":"hybrid"},
		{"id":2, "name": "Gasoline", "value":"gasoline"},
		{"id":3, "name": "Diesel", "value":"diesel"},
		{"id":4, "name": "Human", "value":"human"}]

		vehicle_groups: Array<VehicleGroup>=[];
		vgn=this.generate_vehicle_group_name(0);


		fg_vehicleclass = new FormGroup({
			fc_vgn: new FormControl(this.vgn),
			fc_vehicleclass: new FormControl('medium'),
			fc_vehicleprop: new FormControl('electric'),
			fc_mileage: new FormControl("0"),
			fc_custom_mileage: new FormControl(0),
			fc_count: new FormControl(1),
			fc_add: new FormControl(false),

			fc_leasing_rate_year: new FormControl(0),
			fc_price_new: new FormControl({value: 0, disabled: false}),
			fc_insurance: new FormControl(0),
			fc_maintenance: new FormControl(0),
			fc_consumption: new FormControl(0),

			fc_poolcar: new FormControl(false),
			fc_privateuse_allowed: new FormControl(false),
			fc_share_private_use: new FormControl(0.36, Validators.compose([Validators.min(0), Validators.max(1)])),
			fc_share_commute_use: new FormControl(0.11, Validators.compose([Validators.min(0), Validators.max(1)])),
			fc_share_business_use: new FormControl(0.53, Validators.compose([Validators.min(0), Validators.max(1)])),
			fc_company_pays_private_use: new FormControl(true),
		});

		constructor(private stateService: StateService, private dataService: DataService) { }

		ngOnInit(): void {

			var fc_mileage = this.fg_vehicleclass.get("fc_mileage")
			if (fc_mileage!= null){
				fc_mileage.valueChanges.subscribe(val => {
					this.toggle_custom_distance(val)
				});
			}

			var fc_vehicleclass = this.fg_vehicleclass.get("fc_vehicleclass")
			if (fc_vehicleclass!= null){
				fc_vehicleclass.valueChanges.subscribe(val => {
					this.toggle_custom_vehicle_input(val);
					this.vehicle_class_data = this.get_current_veh_data(val);
				});
			}

			this.fg_vehicleclass.valueChanges.subscribe(val => {
				this.temporal_tco()
			});

			this.getData()

			this.vehicle_class_data = this.get_current_veh_data(this.fg_vehicleclass.value.fc_vehicleclass)
		}


		toggle_custom_distance(fc_mileage: number){
			if (fc_mileage == 4){
				this.show_custom_milage_input=true;
			}else{
				this.show_custom_milage_input=false;
			}
		}

		toggle_custom_vehicle_input(fc_vehicleclass: string){
			if (fc_vehicleclass == "custom_buy"){
				this.show_custom_buy_vehicle_input=true;
			}else{
				this.show_custom_buy_vehicle_input=false;
			}

			if (fc_vehicleclass == "custom_lease"){
				this.show_custom_lease_vehicle_input=true;
			}else{
				this.show_custom_lease_vehicle_input=false;
			}
		}

		
		get_current_veh_data(val : string): any{
			// Load vehicle data from the data service, base on  the form field	
			var veh_data =this.data.vehicle_class.get(val)			
			return veh_data
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

		compile_vehicle_group(): VehicleGroup{

			var vgn = this.fg_vehicleclass.value.fc_vgn

			var mileage = [];
			var mileage_name="";
			if (this.show_custom_milage_input==false){
				mileage = this.mileage_classes[Number(this.fg_vehicleclass.value.fc_mileage)].value;
				mileage_name=this.mileage_classes[Number(this.fg_vehicleclass.value.fc_mileage)].name
			}else{
				mileage = [Number(this.fg_vehicleclass.value.fc_custom_mileage),Number(this.fg_vehicleclass.value.fc_custom_mileage)];
				mileage_name = String(this.fg_vehicleclass.value.fc_custom_mileage) + " km"
			}
			
			var vg = new VehicleGroup(vgn, mileage, this.fg_vehicleclass.value.fc_vehicleprop, this.fg_vehicleclass.value.fc_vehicleclass);


			//vg.mileage = this.mileage_classes[Number(this.fg_vehicleclass.value.fc_mileage)].value
			vg.mileage_name = mileage_name

			vg.count = this.fg_vehicleclass.value.fc_count;
			vg.is_poolcar = this.fg_vehicleclass.value.fc_poolcar;
			vg.private_use_allowed = this.fg_vehicleclass.value.fc_privateuse_allowed;

			return vg
		}

		
		temporal_tco(){
			var vg = this.compile_vehicle_group()

			vg.vehicle.workshop_cost = this.fg_vehicleclass.value.fc_insurance + this.fg_vehicleclass.value.fc_maintenance
			vg.vehicle.new_price = this.fg_vehicleclass.value.fc_price_new
			vg.vehicle.residual_value = this.fg_vehicleclass.value.fc_price_new/2
			vg.vehicle.consumption = this.fg_vehicleclass.value.fc_consumption
			
			if (this.show_custom_buy_vehicle_input){
				vg.vehicle.do_tco(vg.mean_mileage)
			}
			else if(this.show_custom_lease_vehicle_input){
				vg.vehicle.leasing_rate = this.fg_vehicleclass.value.fc_leasing_rate_year
				vg.vehicle.do_tco_leasing(vg.mean_mileage)
			}else{
				var vg = this.compile_vehicle_group()
				vg.vehicle.do_tco(vg.mean_mileage)
			}
			

			console.log(vg.vehicle)
			this.temporal_vg_co2pkm = vg.vehicle.total_co2_per_km
			this.temporal_vg_costpkm = vg.vehicle.total_cost_per_km

		}

		add_vehicle_group(): void{

			var vg = this.compile_vehicle_group()
			this.vehicle_groups.push(vg);

			// if custom vehicle data is available, use it and iverwrite the vehicle data!
			if (this.show_custom_buy_vehicle_input == true || this.show_custom_lease_vehicle_input==true){
				vg.vehicle.workshop_cost = this.fg_vehicleclass.value.fc_insurance + this.fg_vehicleclass.value.fc_maintenance
				vg.vehicle.new_price = this.fg_vehicleclass.value.fc_price_new
				vg.vehicle.residual_value = this.fg_vehicleclass.value.fc_price_new/2
				vg.vehicle.leasing_rate = this.fg_vehicleclass.value.fc_leasing_rate_year
				vg.vehicle.consumption = this.fg_vehicleclass.value.fc_consumption
				if (this.show_custom_buy_vehicle_input == true)	vg.vehicle.do_tco(vg.mean_mileage);
				if (this.show_custom_lease_vehicle_input == true)	vg.vehicle.do_tco_leasing(vg.mean_mileage);
			}

			// check private use and set parameters
			if(this.fg_vehicleclass.value.fc_privateuse_allowed==true){
				vg.vehicle.share_private_use = this.fg_vehicleclass.value.fc_share_private_use
				vg.vehicle.share_commute_use = this.fg_vehicleclass.value.fc_share_commute_use
				vg.vehicle.share_business_use = this.fg_vehicleclass.value.fc_share_business_use
				vg.company_pays_private_use = this.fg_vehicleclass.value.fc_company_pays_private_use

			}else{ // No private use allowed
				vg.vehicle.share_private_use = 0
				vg.vehicle.share_commute_use = 0
				vg.vehicle.share_business_use = 1
				vg.company_pays_private_use = false
			}

			this.calc_total_vehicle_count();
			this.vgn=this.generate_vehicle_group_name(1);
			this.fg_vehicleclass.controls.fc_vgn.setValue(this.vgn)
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


		getData(): void {
			this.dataService.getData().subscribe(dat => this.data = dat);
		}
	}



	export class VehicleGroup{
		vgn="";
		private_use_allowed=false;
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
		company_pays_private_use=true;

		vehicle: Vehicle;

		// group cost and co2 values, to be estimated

		constructor(vgn: string, milage: Array<number>, vehicle_prop: string, veh_class: string) { //vgn = vehicle group name 
			this.vgn=vgn
			this.vehicleprop = vehicle_prop;
			this.vehicleclass = veh_class;
			this.vehicle = new Vehicle(String(this.vehicleprop), String(this.vehicleclass))



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
		new_price: number=-1;
		residual_value: number=0;
		leasing_rate: number=0;
		yearly_mileage: number=0;
		total_yearly_cost
		total_cost_per_km=-1;
		total_yearly_co2
		total_co2_per_km=-1;
		share_private_use=0;
		share_commute_use=0;
		share_business_use=0;

		data = new Data();
		dataService


		constructor(tech: string, vehicle_class: string){

			this.dataService = new DataService()

			this.getData()

			this.writeoff_period = 3 // years



			if (tech=="electric"){
				this.tech="bev";
			}else{
				this.tech = tech;
			}



			var epk =  this.data.emissions_per_km.get(this.tech)
			if (epk != undefined){
				this.emissions_per_km = epk;
			}



			var vehicle_class_detail = this.data.vehicle_class.get(vehicle_class)
			if (vehicle_class_detail != undefined){
				console.log("GET DATA")
				this.new_price = vehicle_class_detail.price_new
				this.residual_value  = vehicle_class_detail.residual_value3y
				this.workshop_cost  = vehicle_class_detail.workshop_cost
				this.fixcost =  vehicle_class_detail.fixcost

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

			console.log("total_cost_per_km", this.total_cost_per_km)
			console.log("this.new_price", this.new_price)

			var epe = this.data.emissions_per_energy.get(this.tech)
			if (epe != undefined){
				this.total_yearly_co2 = yearly_mileage * this.consumption / 100 * epe
			}
			this.total_co2_per_km = this.total_yearly_co2 / yearly_mileage

		}

		do_tco_leasing(yearly_mileage: number){

			var value_loss = 0
			var yearly_loss=0
			var energy_cost_yearly=0

			this.yearly_mileage = yearly_mileage

			yearly_loss = this.leasing_rate*12


			var ep = this.data.energy_price.get(this.tech)
			if (ep != undefined){
				energy_cost_yearly = yearly_mileage * this.consumption / 100 * ep
			}

			this.total_yearly_cost = this.workshop_cost + this.fixcost + yearly_loss + energy_cost_yearly
			this.total_cost_per_km = this.total_yearly_cost / yearly_mileage

			console.log("total_cost_per_km", this.total_cost_per_km)
			console.log("this.new_price", this.new_price)

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