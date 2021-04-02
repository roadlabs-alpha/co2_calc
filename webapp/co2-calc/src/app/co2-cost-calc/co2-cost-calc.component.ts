import { Component, OnInit } from '@angular/core';
import { StateService, State} from '../state.service';
import { DataService, Data} from '../data.service';

@Component({
	selector: 'app-co2-cost-calc',
	templateUrl: './co2-cost-calc.component.html',
	styleUrls: ['./co2-cost-calc.component.css', "../app.component.css"],
})
export class Co2CostCalcComponent implements OnInit {

	constructor(private stateService: StateService, private dataService: DataService) { }

	state = new State();
	data = new Data();

	show_vehicle_results_table = false;


	ngOnInit(): void {

		this.getState();
		this.getData();
	}



	// Commuting -------------------------------------------------------
	bike_km = 0;
	private_car_km = 0;
	company_car_km  = 0;
	public_transport_km  = 0;

	bike_co2 =0;
	private_car_co2 = 0;
	company_car_co2 = 0;
	public_transport_co2 = 0;

	bike_cost = 0;
	private_car_cost = 0;
	company_car_cost = 0;
	public_transport_cost = 0;
	
	calc_communting_distances(): void{

		this.bike_km = this.state.n_employees * this.data.commuting_shares["bike"]["share"] * this.data.commuting_shares["bike"]["avg_dist"] * this.data.n_workdays_year
		this.private_car_km = this.state.n_employees * this.data.commuting_shares["car"]["share"] * this.data.commuting_shares["car"]["avg_dist"] * this.data.n_workdays_year
		this.company_car_km = this.state.n_employees * this.data.commuting_shares["company_car"]["share"] * this.data.commuting_shares["company_car"]["avg_dist"] * this.data.n_workdays_year
		this.public_transport_km = this.state.n_employees * this.data.commuting_shares["public_transport"]["share"] * this.data.commuting_shares["public_transport"]["avg_dist"] * this.data.n_workdays_year
		
		console.log("km: ", this.public_transport_km)
	}

	calc_communting_co2(): void{

		var epk_bike =this.data.emissions_per_km.get("bike");
		var epk_gas = this.data.emissions_per_km.get("gasoline");
		var epk_pt = this.data.emissions_per_km.get("public_transport");

		if (epk_bike != undefined && epk_gas!= undefined && epk_pt!= undefined){

			this.bike_co2 = this.bike_km * epk_bike;
			this.private_car_co2 = this.private_car_km * epk_gas;
			this.company_car_co2 = this.company_car_km * epk_gas;
			this.public_transport_co2 = this.public_transport_km * epk_pt;
		}
	}

	calc_communting_cost(): void{
		this.bike_cost = this.bike_km * this.data.transport_price_per_km["bike"];
		this.private_car_cost = this.private_car_km *this.data.transport_price_per_km["car"];
		this.company_car_cost = this.company_car_km * this.data.transport_price_per_km["car"];
		this.public_transport_cost = this.public_transport_km * this.data.transport_price_per_km["public_transport"];
	}



	// Vehicles ----------------------------------------------------------
	calc_vehicles(): void{
		
		// Loop over all saved vehicle groups
		for(var i=0; i < this.state.vehicle_groups_user.length; i++){
			console.log("Doing vehicle group", i)

			//var vehicle = new Vehicle(String(this.state.vehicle_groups_user[i].vehicleprop), String(this.state.vehicle_groups_user[i].vehicleclass))
			
			//var mean_mileage = (this.state.vehicle_groups_user[i].mileage[0] + this.state.vehicle_groups_user[i].mileage[1])/2

			//vehicle.do_tco(mean_mileage)
			//console.log(vehicle.total_yearly_co2)
			//console.log("Co2 per km: ", vehicle.total_co2_per_km, " kg/km.")
			//console.log("Cost per km: ", vehicle.total_cost_per_km, " €/km.")

			console.log("Co2/year of group in kg ", i, ": ",this.state.vehicle_groups_user[i].calculate_vg_co2())
			console.log("Cost/year of group in € ", i, ": ",this.state.vehicle_groups_user[i].calculate_vg_cost())

		}
	}


	calc_all(): void{
		this.show_vehicle_results_table=true;
		this.calc_vehicles()
	}



	getState(): void {
		this.stateService.getState().subscribe(st => this.state = st);
	}

	getData(): void {
		this.dataService.getData().subscribe(dat => this.data = dat);
	}

}




// export class Vehicle{

// 	writeoff_period=0;
// 	workshop_cost=0;
// 	fixcost=0;
// 	consumption=0;
// 	tech: string;
// 	emissions_per_km
// 	new_price: number=0;
// 	residual_value: number=0;
// 	yearly_mileage: number=0;
// 	total_yearly_cost
// 	total_cost_per_km
// 	total_yearly_co2
// 	total_co2_per_km

// 	data = new Data();
// 	dataService


// 	constructor(tech: string, vehicle_class: string){

// 		this.dataService = new DataService()

// 		this.getData()

// 		this.writeoff_period = 3 // years
// 		this.workshop_cost = 720 //€/year
// 		this.fixcost = 1200 //€/year

// 		if (tech=="electric"){
// 			this.tech="bev";
// 		}else{
// 			this.tech = tech;
// 		}

		



// 		this.emissions_per_km = this.data.emissions_per_km.get(this.tech)



// 		var vehicle_class_detail = this.data.vehicle_class.get(vehicle_class)
// 		if (vehicle_class_detail != undefined){
// 			this.new_price = vehicle_class_detail.price_new
// 			this.residual_value  = vehicle_class_detail.residual_value3y

// 			if (this.tech == "bev"){
// 				this.consumption = vehicle_class_detail.e_consumption;
// 			}
// 			else{
// 				this.consumption = vehicle_class_detail.consumption;
// 			}
// 		}

// 		this.total_yearly_cost = -1
// 		this.total_cost_per_km = -1
// 		this.total_yearly_co2 = -1
// 		this.total_co2_per_km = -1


// 	}

// 	do_tco(yearly_mileage: number){

// 		var value_loss = 0
// 		var yearly_loss=0
// 		var energy_cost_yearly=0

// 		this.yearly_mileage = yearly_mileage

// 		value_loss = this.new_price - this.residual_value
// 		yearly_loss = value_loss / this.writeoff_period

		
// 		var ep = this.data.energy_price.get(this.tech)
// 		if (ep != undefined){
// 			energy_cost_yearly = yearly_mileage * this.consumption / 100 * ep
// 		}

// 		this.total_yearly_cost = this.workshop_cost + this.fixcost + yearly_loss + energy_cost_yearly
// 		this.total_cost_per_km = this.total_yearly_cost / yearly_mileage
		
// 		var epk = this.data.emissions_per_energy.get(this.tech)
// 		if (epk != undefined){
// 			this.total_yearly_co2 = yearly_mileage * this.consumption / 100 * epk
// 		}
// 		this.total_co2_per_km = this.total_yearly_co2 / yearly_mileage

// 	}

// 	getData(): void {
// 		this.dataService.getData().subscribe(dat => this.data = dat);
// 	}

// }