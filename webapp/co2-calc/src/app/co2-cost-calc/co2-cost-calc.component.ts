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
	show_bt_results_table=false;
	show_commuting_results_table=false;
	show_orga_results_table=false;


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

	commuting_results_table=[{"name":"", "cost": 0, "co2":0}];
	
	calc_communting(): void{	

		// distances
		this.bike_km = this.state.n_employees * this.data.commuting_shares["bike"]["share"] * this.data.commuting_shares["bike"]["avg_dist"] * this.data.n_workdays_year
		this.private_car_km = this.state.n_employees * this.data.commuting_shares["car"]["share"] * this.data.commuting_shares["car"]["avg_dist"] * this.data.n_workdays_year
		this.company_car_km = this.state.n_employees * this.data.commuting_shares["company_car"]["share"] * this.data.commuting_shares["company_car"]["avg_dist"] * this.data.n_workdays_year
		this.public_transport_km = this.state.n_employees * this.data.commuting_shares["public_transport"]["share"] * this.data.commuting_shares["public_transport"]["avg_dist"] * this.data.n_workdays_year
		

		// emissions
		var epk_bike =this.data.emissions_per_km.get("bike");
		var epk_gas = this.data.emissions_per_km.get("gasoline");
		var epk_pt = this.data.emissions_per_km.get("public_transport");

		if (epk_bike != undefined && epk_gas!= undefined && epk_pt!= undefined){

			this.bike_co2 = this.bike_km * epk_bike;
			this.private_car_co2 = this.private_car_km * epk_gas;
			this.company_car_co2 = this.company_car_km * epk_gas;
			this.public_transport_co2 = this.public_transport_km * epk_pt;
		}

		// cost
		var tpk_bike = this.data.transport_price_per_km.get("bike");
		var tpk_car = this.data.transport_price_per_km.get("car");
		var tpk_pt = this.data.transport_price_per_km.get("public_transport");

		if (tpk_bike != undefined && tpk_car!= undefined && tpk_pt!= undefined){
			this.bike_cost = this.bike_km * tpk_bike;
			this.private_car_cost = this.private_car_km * tpk_car
			this.company_car_cost = this.company_car_km * tpk_car
			this.public_transport_cost = this.public_transport_km * tpk_pt

		}


		this.commuting_results_table=[
		{"name":"Bike", "cost": this.bike_cost, "co2":this.bike_co2},
		{"name":"Private Car", "cost": this.private_car_cost, "co2":this.private_car_co2},
		{"name":"Company Car", "cost": this.company_car_cost, "co2":this.company_car_co2},
		{"name":"Public_transport", "cost": this.public_transport_cost, "co2":this.public_transport_co2},
		];


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
	bt_pt_co2 = 0;
	bt_train_co2 = 0;
	bt_plane_co2  = 0;

	bt_pt_cost = 0;
	bt_train_cost = 0;
	bt_plane_cost  = 0;

	bt_results_table=[{"name":"", "cost": 0, "co2":0}];

	calc_bt(): void{
		console.log("bts: ", this.state.bt_value_set_user);

		// co2
		var epk_train =this.data.emissions_per_km.get("train");
		var epk_plane = this.data.emissions_per_km.get("plane");
		var epk_pt = this.data.emissions_per_km.get("public_transport");

		if (epk_train != undefined && epk_plane!= undefined && epk_pt!= undefined){
			this.bt_pt_co2 = this.state.bt_value_set_user.bt_dist_pt * epk_pt;
			this.bt_train_co2 = this.state.bt_value_set_user.bt_dist_train * epk_train;
			this.bt_plane_co2 = this.state.bt_value_set_user.bt_dist_plane * epk_plane;
		}


		// Cost
		var tpk_train =this.data.transport_price_per_km.get("train");
		var tpk_plane = this.data.transport_price_per_km.get("plane");
		var tpk_pt = this.data.transport_price_per_km.get("public_transport");

		if (tpk_train != undefined && tpk_plane!= undefined && tpk_pt!= undefined){
			this.bt_pt_cost = this.state.bt_value_set_user.bt_dist_pt * tpk_pt;
			this.bt_train_cost = this.state.bt_value_set_user.bt_dist_train * tpk_train;
			this.bt_plane_cost = this.state.bt_value_set_user.bt_dist_plane * tpk_plane;
		}

		this.bt_results_table=[
		{"name": "Public Transport", "co2": this.bt_pt_co2, "cost": this.bt_pt_cost},
		{"name": "Train", "co2": this.bt_train_co2, "cost": this.bt_train_cost},
		{"name": "Plane", "co2": this.bt_plane_co2, "cost": this.bt_plane_cost},
		]
	}








	// --------- Put all together to the organisation ----------------------------------------
	orga_results = {
		"cost": 0,
		"co2": 0
	}
	calc_organisation(){



		// sum up the co2 ------------------------------------------------------
		for (var i=0; i<this.commuting_results_table.length;i++){
			this.orga_results["co2"] += this.commuting_results_table[i]["co2"]
		}
		for (var i=0; i<this.bt_results_table.length;i++){
			this.orga_results["co2"] += this.bt_results_table[i]["co2"]
		}
		for (var i=0; i<this.state.vehicle_groups_user.length;i++){
			this.orga_results["co2"] += this.state.vehicle_groups_user[i].calculate_vg_co2()
		}




		// sum up the cost -----------------------------------------------------
		var n_veh_private_use = 0;
		for (var i=0; i<this.state.vehicle_groups_user.length;i++){
			this.orga_results["cost"] += this.state.vehicle_groups_user[i].calculate_vg_cost()
			if (this.state.vehicle_groups_user[i].is_private_use == 1){
				n_veh_private_use += this.state.vehicle_groups_user[i].count
			}
		}

		// if more vehicles with private use than employees, set this count to n employees
		if (n_veh_private_use > this.state.n_employees){
			n_veh_private_use =  this.state.n_employees;
		}

		// commuting with business company_car_cost		// cost
		var tpk_car = this.data.transport_price_per_km.get("car");

		if (tpk_car != undefined){
			this.orga_results["cost"] += n_veh_private_use * this.data.commuting_shares["company_car"]["avg_dist"] * this.data.n_workdays_year * tpk_car
		}


			
		for (var i=0; i<this.bt_results_table.length;i++){
			this.orga_results["cost"] += this.bt_results_table[i]["cost"]
		}



	}


	calc_all(): void{
		this.show_vehicle_results_table=true;
		this.show_bt_results_table=true;
		this.show_commuting_results_table=true;
		this.show_orga_results_table=true;
		this.calc_communting()
		this.calc_vehicles()
		this.calc_bt()
		this.calc_organisation()
	}



	getState(): void {
		this.stateService.getState().subscribe(st => this.state = st);
	}

	getData(): void {
		this.dataService.getData().subscribe(dat => this.data = dat);
	}

}