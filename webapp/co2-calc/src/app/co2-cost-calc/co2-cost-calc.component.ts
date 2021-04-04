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

			console.log("Co2/year of group in kg ", i, ": ",this.state.vehicle_groups_user[i].calculate_vg_co2())
			console.log("Cost/year of group in € ", i, ": ",this.state.vehicle_groups_user[i].calculate_vg_cost())

		}
	}







	// - Business trips --------------------------------------------------
	//this.state.bt_value_set_user


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