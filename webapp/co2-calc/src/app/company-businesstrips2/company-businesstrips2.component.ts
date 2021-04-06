import { Component, OnInit } from '@angular/core';
import { StateService, State} from '../state.service';
import { DataService, Data} from '../data.service';
import { FormControl, FormGroup } from '@angular/forms'


@Component({
	selector: 'app-company-businesstrips2',
	templateUrl: './company-businesstrips2.component.html',
	styleUrls: ['./company-businesstrips2.component.css', "../app.component.css"],
})
export class CompanyBusinesstrips2Component implements OnInit {

	change_detected=true;


	fg_bt_group = new FormGroup({
		fc_transportmode: new FormControl("2"),
		fc_dist_per_trip: new FormControl("2"),
		fc_count: new FormControl(1),
		fc_add: new FormControl(false),
	});

	bt_groups: Array<Bt_Group>=[]

	state = new State();
	data = new Data();


	mode_classes=[
	{"id":0, "name":"Walking", "value": "walking"},
	{"id":1, "name":"Bike", "value": "bike"},
	{"id":2, "name":"Public Transport", "value": "pt"},
	{"id":3, "name":"Train", "value": "train"},
	{"id":4, "name":"Plane", "value": "plane"},]

	dist_classes=[
	{"id":0, "name": "0-5 km", "value":[0,5]},
	{"id":1, "name": "5-10 km", "value":[5,10]},
	{"id":2, "name": "10-20 km", "value":[10,20]},
	{"id":3, "name": "20-50 km", "value":[20,50]},
	{"id":4, "name": "50-200 km", "value":[50,200]},
	{"id":5, "name": "200-500 km", "value":[200,500]},
	{"id":6, "name": "500-1000 km", "value":[500,1000]},
	{"id":7, "name": "1000-10000 km", "value":[1000,10000]},
	]

	constructor(private stateService: StateService, private dataService: DataService) { }

	ngOnInit(): void {
		this.getData()
		this.getState()
	}


	add_bt_group(){

		this.bt_groups.push(new Bt_Group(
			this.mode_classes[this.fg_bt_group.value.fc_transportmode].name,
			this.mode_classes[this.fg_bt_group.value.fc_transportmode].value,
			this.mode_classes[this.fg_bt_group.value.fc_transportmode].name,
			this.fg_bt_group.value.fc_count,
			this.dist_classes[this.fg_bt_group.value.fc_dist_per_trip].value,
			this.dist_classes[this.fg_bt_group.value.fc_dist_per_trip].name))
		this.change_detected =true;
	}

	estimate_groups(){

		var total_bt = this.data.n_workdays_year * this.state.n_employees * this.data.bt_pP_pY
		var fc_number_pt = (total_bt * this.data.business_trip_shares.pt.share)
		var fc_number_train = (total_bt * this.data.business_trip_shares.train.share)
		var fc_number_plane = (total_bt * this.data.business_trip_shares.plane.share)
		var fc_number_bike = (total_bt * this.data.business_trip_shares.bike.share)
		var fc_dist_pt = (total_bt * this.data.business_trip_shares.pt.share * this.data.business_trip_shares.pt.avg_dist)
		var fc_dist_train = (total_bt * this.data.business_trip_shares.train.share * this.data.business_trip_shares.train.avg_dist)
		var fc_dist_plane = (total_bt * this.data.business_trip_shares.plane.share * this.data.business_trip_shares.plane.avg_dist)
		var fc_dist_bike = (total_bt * this.data.business_trip_shares.bike.share * this.data.business_trip_shares.bike.avg_dist)

		this.bt_groups=[
		new Bt_Group("Estimate PT", "pt", "Public Transport", fc_number_pt, [fc_dist_pt/fc_number_pt, fc_dist_pt/fc_number_pt], String(fc_dist_pt/fc_number_pt)+ " km"),
		new Bt_Group("Estimate Train", "train", "Train", fc_number_train, [fc_dist_train/fc_number_train, fc_dist_train/fc_number_train], String(fc_dist_train/fc_number_train)+ " km"),
		new Bt_Group("Estimate Plane","plane", "Plane", fc_number_plane, [fc_dist_plane/fc_number_plane, fc_dist_plane/fc_number_plane], String(fc_dist_plane/fc_number_plane) + " km"),
		new Bt_Group("Estimate Bike","bike", "Bike", fc_number_bike, [fc_dist_bike/fc_number_bike, fc_dist_bike/fc_number_bike], String(fc_dist_bike/fc_number_bike) + " km")
		]

	}

	delete_bt_group(vgi: number): void{

		console.log("del element", vgi)
		this.bt_groups.splice(vgi,1);
		this.change_detected = true;
	}

	save_bt_groups(){
		this.stateService.state.bt_groups_user = this.bt_groups
		console.log("Saved bt groups: ", this.bt_groups)
		this.change_detected = false

	}



	getState(): void {
		this.stateService.getState().subscribe(st => this.state = st);
	}

	getData(): void {
		this.dataService.getData().subscribe(dat => this.data = dat);
	}
}



export class Bt_Group{

	btg_name="";
	btg_mode="";
	btg_mode_name="";
	btg_trip_count=0;
	btg_avg_distance: Array<number>=[]
	btg_avg_distance_name=""

	btg_co2=0;
	btg_cost=0;

	data = new Data();
	dataService

	constructor(name: string, mode: string, mode_name: string, count: number, dist: Array<number>, dist_name: string){

		this.btg_name = name; // groupname
		this.btg_mode = mode; // mode (pt, train, car ...)
		this.btg_mode_name = mode_name; // (well written name Public Transport, etc)
		this.btg_trip_count = count;
		this.btg_avg_distance = dist;
		this.btg_avg_distance_name = dist_name;

		this.dataService = new DataService()
		this.getData()

	}


	calculate_btg_co2(): number{

		var mean_dist = (this.btg_avg_distance[0] + this.btg_avg_distance[1])/2
		var epk = this.data.emissions_per_km.get(this.btg_mode)
		console.log("epk: ", epk, "mode: ", this.btg_mode)
		if (epk != undefined){
			this.btg_co2 = this.btg_trip_count * mean_dist * epk
		}

		return this.btg_co2
	}

	calculate_btg_cost(): number{
		var mean_dist = (this.btg_avg_distance[0] + this.btg_avg_distance[1])/2
		var tpk = this.data.transport_price_per_km.get(this.btg_mode)

		if (tpk != undefined){
			this.btg_cost= this.btg_trip_count * mean_dist * tpk
		}
		return this.btg_cost
	}

	getData(): void {
		this.dataService.getData().subscribe(dat => this.data = dat);
	}

}