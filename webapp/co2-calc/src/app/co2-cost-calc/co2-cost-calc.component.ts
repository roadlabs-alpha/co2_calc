import { Component, OnInit } from '@angular/core';
import { StateService, State} from '../state.service';
import { DataService, Data} from '../data.service';
import { EChartsOption } from 'echarts';
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

	chart_commuting: EChartsOption={
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
			},
		},
		xAxis: {
			type: 'category',
			data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
		},
		yAxis: [{
			type: 'value',
			name: "co2",
			id: "0"
		},
		{
			type: 'value',
			name: "cost",
			id: "1"
		}],
		series: [
		{
			data: [820, 932, 901, 934, 1290, 1330, 1320],
			type: 'bar',
			yAxisId: "1"
		},
		],
	};

	chart_vehicles: EChartsOption={
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
			},
		},
		xAxis: {
			type: 'category',
			data: [],
		},
		yAxis: [{
			type: 'value',
			name: "co2",
			id: "0"
		},
		{
			type: 'value',
			name: "cost",
			id: "1"
		}],
		series: [
		{
			data: [],
			type: 'bar',
			yAxisId: "1"
		},
		],
	};

	chart_bt: EChartsOption={
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
			},
		},
		xAxis: {
			type: 'category',
			data: [],
		},
		yAxis: [{
			type: 'value',
			name: "co2",
			id: "0"
		},
		{
			type: 'value',
			name: "cost",
			id: "1"
		}],
		series: [
		{
			data: [],
			type: 'bar',
			yAxisId: "1"
		},
		],
	};


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

	
	calc_communting(): void{	

		this.reset_charts()

		var chart_cat = [];
		var chart_data_co2 = [];
		var chart_data_cost = [];
		// Loop over all saved vehicle groups
		for(var i=0; i < this.state.commuting_groups_user.length; i++){
			console.log("Doing vehicle group", i)

			chart_cat.push(this.state.commuting_groups_user[i].mode_name)
			chart_data_co2.push(this.state.commuting_groups_user[i].calculate_co2())
			chart_data_cost.push(this.state.commuting_groups_user[i].calculate_cost())

			console.log("Co2/year of group in kg ", i, ": ",this.state.commuting_groups_user[i].calculate_co2())
			console.log("Cost/year of group in € ", i, ": ",this.state.commuting_groups_user[i].calculate_cost())

		}


		this.chart_commuting.xAxis={
			"type": "category",
			"data": chart_cat
		}
		this.chart_commuting.series=[{
			"type": "bar",
			name: "CO2",
			"data": chart_data_co2,
			yAxisId: "0"
		},
		{
			"type": "bar",
			name: "Cost",
			"data": chart_data_cost,
			yAxisId: "1"
		}]


		console.log(this.chart_commuting)

	}





	// Vehicles ----------------------------------------------------------
	calc_vehicles(): void{

		var chart_veh_cat = [];
		var chart_veh_data_co2 = [];
		var chart_veh_data_cost = [];

		// Loop over all saved vehicle groups
		for(var i=0; i < this.state.vehicle_groups_user.length; i++){
			console.log("Doing vehicle group", i)

			chart_veh_cat.push(this.state.vehicle_groups_user[i].vgn)
			chart_veh_data_co2.push(this.state.vehicle_groups_user[i].calculate_vg_co2())
			chart_veh_data_cost.push(this.state.vehicle_groups_user[i].calculate_vg_cost())

			console.log("Co2/year of group in kg ", i, ": ",this.state.vehicle_groups_user[i].calculate_vg_co2())
			console.log("Cost/year of group in € ", i, ": ",this.state.vehicle_groups_user[i].calculate_vg_cost())

		}

		this.chart_vehicles.xAxis={
			"type": "category",
			"data": chart_veh_cat
		}
		this.chart_vehicles.series=[{
			"type": "bar",
			name: "CO2",
			"data": chart_veh_data_co2,
			yAxisId: "0"
		},
		{
			"type": "bar",
			name: "Cost",
			"data": chart_veh_data_cost,
			yAxisId: "1"
		}]

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

		var chart_bt_cat = [];
		var chart_bt_data_co2 = [];
		var chart_bt_data_cost = [];


		for(var i=0; i < this.state.bt_groups_user.length; i++){
			console.log("Doing bt group", i)

			chart_bt_cat.push(this.state.bt_groups_user[i].btg_mode_name)
			chart_bt_data_co2.push(this.state.bt_groups_user[i].calculate_btg_co2())
			chart_bt_data_cost.push(this.state.bt_groups_user[i].calculate_btg_cost())


			console.log("Co2/year of bt group in kg ", i, ": ",this.state.bt_groups_user[i].calculate_btg_co2())
			console.log("Cost/year of bt group in € ", i, ": ",this.state.bt_groups_user[i].calculate_btg_cost())
		}

		this.chart_bt.xAxis={
			"type": "category",
			"data": chart_bt_cat
		}
		this.chart_bt.series=[{
			"type": "bar",
			name: "CO2",
			"data": chart_bt_data_co2,
			yAxisId: "0"
		},
		{
			"type": "bar",
			name: "Cost",
			"data": chart_bt_data_cost,
			yAxisId: "1"
		}]
	}








	// --------- Put all together to the organisation ----------------------------------------
	orga_results = {
		"cost": 0,
		"co2": 0
	}
	calc_organisation(){



		// sum up the co2 ------------------------------------------------------
		for (var i=0; i<this.state.commuting_groups_user.length;i++){
			//this.orga_results["co2"] += this.commuting_results_table[i]["co2"]
			this.orga_results["co2"] += this.state.commuting_groups_user[i].calculate_co2()
		}
		for (var i=0; i<this.state.bt_groups_user.length;i++){
			this.orga_results["co2"] += this.state.bt_groups_user[i].calculate_btg_co2()
		}
		for (var i=0; i<this.state.vehicle_groups_user.length;i++){
			this.orga_results["co2"] += this.state.vehicle_groups_user[i].calculate_vg_co2()
		}




		// sum up the cost -----------------------------------------------------


		// all cost of company cars in commuting
		this.orga_results["cost"] += this.company_car_cost


		// Business trip cost
		for (var i=0; i<this.state.bt_groups_user.length;i++){
			this.orga_results["cost"] += this.state.bt_groups_user[i].calculate_btg_cost()
		}

		// Vehicle cost
		for (var i=0; i<this.state.vehicle_groups_user.length;i++){
			this.orga_results["cost"] += this.state.vehicle_groups_user[i].calculate_vg_cost()
		}



	}


	calc_all(): void{
		this.orga_results = {
			"cost": 0,
			"co2": 0
		}
		this.show_vehicle_results_table=true;
		this.show_bt_results_table=true;
		this.show_commuting_results_table=true;
		this.show_orga_results_table=true;
		this.calc_communting()
		this.calc_vehicles()
		this.calc_bt()
		this.calc_organisation()
	}


	reset_charts(): void{
		this.chart_commuting={
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
			},
		},
		xAxis: {
			type: 'category',
			data: [],
		},
		yAxis: [{
			type: 'value',
			name: "co2",
			id: "0"
		},
		{
			type: 'value',
			name: "cost",
			id: "1"
		}],
		series: [
		{
			data: [],
			type: 'bar',
			yAxisId: "1"
		},
		],
	};

	this.chart_vehicles={
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
			},
		},
		xAxis: {
			type: 'category',
			data: [],
		},
		yAxis: [{
			type: 'value',
			name: "co2",
			id: "0"
		},
		{
			type: 'value',
			name: "cost",
			id: "1"
		}],
		series: [
		{
			data: [],
			type: 'bar',
			yAxisId: "1"
		},
		],
	};

	this.chart_bt={
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
			},
		},
		xAxis: {
			type: 'category',
			data: [],
		},
		yAxis: [{
			type: 'value',
			name: "co2",
			id: "0"
		},
		{
			type: 'value',
			name: "cost",
			id: "1"
		}],
		series: [
		{
			data: [],
			type: 'bar',
			yAxisId: "1"
		},
		],
	};
	}

	getState(): void {
		this.stateService.getState().subscribe(st => this.state = st);
	}

	getData(): void {
		this.dataService.getData().subscribe(dat => this.data = dat);
	}

}