import { Component, OnInit } from '@angular/core';
import { StateService, State} from '../state.service';
import { DataService, Data} from '../data.service';
import { FormControl, FormGroup, Validators } from '@angular/forms'

@Component({
	selector: 'app-company-commuting',
	templateUrl: './company-commuting.component.html',
	styleUrls: ['./company-commuting.component.css', "../app.component.css"],
})
export class CompanyCommutingComponent implements OnInit {


	state = new State();
	data = new Data();

	change_detected=true;

	mode_classes=[
	{"id":0, "name":"Walking", "value": "walking"},
	{"id":1, "name":"Bike", "value": "bike"},
	{"id":2, "name":"Car", "value": "car"},
	{"id":3, "name":"Company Car", "value": "car"},
	{"id":4, "name":"Public Transport", "value": "pt"},
	{"id":5, "name":"Train", "value": "train"},
	{"id":6, "name":"Plane", "value": "plane"},]

	dist_classes=[
	{"id":0, "name": "0-5 km", "value":[0,5]},
	{"id":1, "name": "5-10 km", "value":[5,10]},
	{"id":2, "name": "10-20 km", "value":[10,20]},
	{"id":3, "name": "20-50 km", "value":[20,50]},
	{"id":4, "name": "50-200 km", "value":[50,200]},
	{"id":5, "name": "200-500 km", "value":[200,500]},
	{"id":6, "name": "500-1000 km", "value":[500,1000]},
	{"id":7, "name": "1000-10000 km", "value":[1000,10000]},
	{"id":8, "name": "custom", "value":[-1,-1]},
	]

	commuting_groups: Array<Commute_Group>=[]

	fg_commuting = new FormGroup({
		fc_company_car_commuting: new FormControl(false),
		fc_pool_car_commuting: new FormControl(false),
		fc_transportmode: new FormControl("2"),
		fc_dist_per_daycommute: new FormControl("2"),
		fc_custom_dist: new FormControl(0),
		fc_share: new FormControl(0.5, Validators.compose([Validators.min(0), Validators.max(1)])),
		fc_home_office_share: new FormControl(0, Validators.compose([Validators.min(0), Validators.max(1)])),
	});

	value_fc_dist_per_daycommute=0

	constructor(private stateService: StateService, private dataService: DataService) { }




	ngOnInit(): void {
		this.getData()
		this.getState()

		var test = this.fg_commuting.get("fc_dist_per_daycommute")
		if (test!= null){
			test.valueChanges.subscribe(val => {
				this.value_fc_dist_per_daycommute = val
				console.log(val)
			});
		}
	}

	add_comm_group(): void{

		var n_total_commutes = this.data.n_workdays_year * this.state.n_employees -  (this.data.n_workdays_year * this.state.n_employees * this.fg_commuting.value.fc_home_office_share)

		var count = n_total_commutes * this.fg_commuting.value.fc_share

		var dist: Array<number>=[];
		var dist_name=""
		if (this.fg_commuting.value.fc_dist_per_daycommute < 8){
			dist = this.dist_classes[this.fg_commuting.value.fc_dist_per_daycommute].value
			dist_name = this.dist_classes[this.fg_commuting.value.fc_dist_per_daycommute].name
		}else if(this.fg_commuting.value.fc_dist_per_daycommute == 8){
			dist = [this.fg_commuting.value.fc_custom_dist, this.fg_commuting.value.fc_custom_dist]
			dist_name = String(this.fg_commuting.value.fc_custom_dist)+" km"
		}

		console.log("CUSTOM DIST: ", dist)


		this.commuting_groups.push(
			new Commute_Group(
				this.mode_classes[this.fg_commuting.value.fc_transportmode].value,
				this.mode_classes[this.fg_commuting.value.fc_transportmode].value,
				this.mode_classes[this.fg_commuting.value.fc_transportmode].name,
				count,
				dist,
				dist_name,
				this.fg_commuting.value.fc_share))

	}

	save_comm_groups():void{
		this.stateService.state.commuting_groups_user = this.commuting_groups;
		console.log("Saved commuting groups: ", this.commuting_groups)
		this.change_detected = false
	}

	delete_comm_group(gi: number): void{
		console.log("del element", gi)
		this.commuting_groups.splice(gi,1);
		this.change_detected = true;
	}

	estimate_groups(): void{
		var n_total_commutes = this.data.n_workdays_year * this.state.n_employees -  (this.data.n_workdays_year * this.state.n_employees * this.fg_commuting.value.fc_home_office_share)

		if (this.fg_commuting.value.fc_company_car_commuting == 1){



			var number_pt = (n_total_commutes * this.data.commuting_shares.pt.share)
			var number_car = (n_total_commutes * this.data.commuting_shares.car.share)
			var number_company_car = (n_total_commutes * this.data.commuting_shares.company_car.share)
			var number_bike = (n_total_commutes * this.data.commuting_shares.bike.share)

			var dist_pt = (n_total_commutes * this.data.commuting_shares.pt.share * this.data.commuting_shares.pt.avg_dist)
			var dist_car = (n_total_commutes * this.data.commuting_shares.car.share * this.data.commuting_shares.car.avg_dist)
			var dist_company_car = (n_total_commutes * this.data.commuting_shares.company_car.share * this.data.commuting_shares.company_car.avg_dist)
			var dist_bike = (n_total_commutes * this.data.commuting_shares.bike.share * this.data.commuting_shares.bike.avg_dist)

			this.commuting_groups=[
			new Commute_Group("Estimated PT", "pt", "Public Transport", number_pt, [dist_pt/number_pt, dist_pt/number_pt], String(dist_pt/number_pt)+ " km", this.data.commuting_shares.pt.share),
			new Commute_Group("Estiamted Car", "train", "Car", number_car, [dist_car/number_car, dist_car/number_car], String(dist_car/number_car)+ " km", this.data.commuting_shares.car.share),
			new Commute_Group("Estimated Company Car","car", "Company Car", number_company_car, [dist_company_car/number_company_car, dist_company_car/number_company_car], String(dist_company_car/number_company_car) + " km", this.data.commuting_shares.company_car.share),
			new Commute_Group("Estimated Bike","bike", "Bike", number_bike, [dist_bike/number_bike, dist_bike/number_bike], String(dist_bike/number_bike) + " km", this.data.commuting_shares.bike.share)
			]
		}else{

			var number_pt = (n_total_commutes * this.data.commuting_shares.pt.share)
			var number_car = (n_total_commutes * this.data.commuting_shares.car.share) + (n_total_commutes * this.data.commuting_shares.company_car.share)
			var number_bike = (n_total_commutes * this.data.commuting_shares.bike.share)

			var dist_pt = (n_total_commutes * this.data.commuting_shares.pt.share * this.data.commuting_shares.pt.avg_dist)
			var dist_car = (n_total_commutes * this.data.commuting_shares.car.share * this.data.commuting_shares.car.avg_dist) + (n_total_commutes * this.data.commuting_shares.company_car.share * this.data.commuting_shares.company_car.avg_dist)
			var dist_bike = (n_total_commutes * this.data.commuting_shares.bike.share * this.data.commuting_shares.bike.avg_dist)

			this.commuting_groups=[
			new Commute_Group("Estimated PT", "pt", "Public Transport", number_pt, [dist_pt/number_pt, dist_pt/number_pt], String(dist_pt/number_pt)+ " km", this.data.commuting_shares.pt.share),
			new Commute_Group("Estimated Car", "train", "Car", number_car, [dist_car/number_car, dist_car/number_car], String(dist_car/number_car)+ " km", this.data.commuting_shares.company_car.share + this.data.commuting_shares.car.share),
			new Commute_Group("Estimated Bike","bike", "Bike", number_bike, [dist_bike/number_bike, dist_bike/number_bike], String(dist_bike/number_bike) + " km", this.data.commuting_shares.bike.share)
			]
		}

		


	}


	getState(): void {
		this.stateService.getState().subscribe(st => this.state = st);
	}

	getData(): void {
		this.dataService.getData().subscribe(dat => this.data = dat);
	}
}



export class Commute_Group{

	name="";
	mode="";
	mode_name="";
	trip_count=0;
	share=0;
	avg_distance: Array<number>=[]
	avg_distance_name=""

	co2=0;
	cost=0;

	data = new Data();
	dataService

	constructor(name: string, mode: string, mode_name: string, count: number, dist: Array<number>, dist_name: string, share: number){

		this.name = name; // groupname
		this.mode = mode; // mode (pt, train, car ...)
		this.mode_name = mode_name; // (well written name Public Transport, etc)
		this.trip_count = count;
		this.avg_distance = dist;
		this.avg_distance_name = dist_name;
		this.share = share;

		this.dataService = new DataService()
		this.getData()

	}


	calculate_co2(): number{

		var mean_dist = (this.avg_distance[0] + this.avg_distance[1])/2
		var epk = this.data.emissions_per_km.get(this.mode)
		console.log("epk: ", epk, "mode: ", this.mode)
		if (epk != undefined){
			this.co2 = this.trip_count * mean_dist * epk
		}

		return this.co2
	}

	calculate_cost(): number{
		var mean_dist = (this.avg_distance[0] + this.avg_distance[1])/2
		var tpk = this.data.transport_price_per_km.get(this.mode)

		if (tpk != undefined){
			this.cost= this.trip_count * mean_dist * tpk
		}
		return this.cost
	}

	getData(): void {
		this.dataService.getData().subscribe(dat => this.data = dat);
	}

}