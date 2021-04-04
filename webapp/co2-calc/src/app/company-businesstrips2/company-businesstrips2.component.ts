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
	{"id":7, "name": "100-10000 km", "value":[1000,10000]},
	]

	constructor(private stateService: StateService, private dataService: DataService) { }

	ngOnInit(): void {
		this.getData()
		this.getState()
	}


	add_bt_group(){

		this.bt_groups.push(new Bt_Group(
			this.mode_classes[this.fg_bt_group.value.fc_transportmode].name,
			this.mode_classes[this.fg_bt_group.value.fc_transportmode].name,
			this.fg_bt_group.value.fc_count,
			this.dist_classes[this.fg_bt_group.value.fc_dist_per_trip].value,
			this.dist_classes[this.fg_bt_group.value.fc_dist_per_trip].name))
	}

	estimate_groups(){

		var total_bt = this.data.n_workdays_year * this.state.n_employees * this.data.bt_pP_pY
		var fc_number_pt = (total_bt * this.data.business_trip_shares.public_transport.share)
		var fc_number_train = (total_bt * this.data.business_trip_shares.train.share)
		var fc_number_plane = (total_bt * this.data.business_trip_shares.plane.share)
		var fc_dist_pt = (total_bt * this.data.business_trip_shares.public_transport.share * this.data.business_trip_shares.public_transport.avg_dist)
		var fc_dist_train = (total_bt * this.data.business_trip_shares.train.share * this.data.business_trip_shares.train.avg_dist)
		var fc_dist_plane = (total_bt * this.data.business_trip_shares.plane.share * this.data.business_trip_shares.plane.avg_dist)

		this.bt_groups=[
		new Bt_Group("bt_est_pt", "pt", fc_number_pt, [fc_dist_pt/fc_number_pt, fc_dist_pt/fc_number_pt], String(fc_dist_pt/fc_number_pt)),
		new Bt_Group("bt_est_train", "train", fc_number_train, [fc_dist_train/fc_number_train, fc_dist_train/fc_number_train], String(fc_dist_train/fc_number_train)),
		new Bt_Group("bt_est_plane", "plane", fc_number_plane, [fc_dist_plane/fc_number_plane, fc_dist_plane/fc_number_plane], String(fc_dist_plane/fc_number_plane))
		]

	}

	delete_bt_group(vgi: number): void{

		console.log("del element", vgi)
		this.bt_groups.splice(vgi,1);
	}

	save_bt_groups(){
		this.stateService.state.bt_groups_user = this.bt_groups
		console.log("Saved bt groups: ", this.bt_groups)

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
	btg_trip_count=0;
	btg_avg_distance: Array<number>=[]
	btg_avg_distance_name=""

	constructor(name: string, mode: string, count: number, dist: Array<number>, dist_name: string){

		this.btg_name=name;
		this.btg_mode=mode;
		this.btg_trip_count=count;
		this.btg_avg_distance=dist;
		this.btg_avg_distance_name=dist_name;

	}
}