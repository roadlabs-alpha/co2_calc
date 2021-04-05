import { Component, OnInit } from '@angular/core';
import { StateService, State} from '../state.service';
import { DataService, Data} from '../data.service';
import { FormControl, FormGroup } from '@angular/forms'

@Component({
	selector: 'app-company-commuting',
	templateUrl: './company-commuting.component.html',
	styleUrls: ['./company-commuting.component.css', "../app.component.css"],
})
export class CompanyCommutingComponent implements OnInit {


	state = new State();
	data = new Data();

	change_detected=true;

	dist_classes=[{"name": "", "id": 0}]

	mode_classes=[{"name": "", "id": 0}]

	commuting_groups=[{"name": "", "mode": "", "avg_dist":"", "share":0.5}]

	fg_commuting = new FormGroup({
		fc_company_car_commuting: new FormControl(false),
		fc_pool_car_commuting: new FormControl(false),
		fc_transportmode: new FormControl("bike"),
		fc_dist_per_daycommute: new FormControl(15),
		fc_share: new FormControl(0.5),
	});

	constructor(private stateService: StateService, private dataService: DataService) { }




	ngOnInit(): void {
		this.getData()
		this.getState()
	}

	add_comm_group(): void{

	}

	save_comm_groups():void{}

	delete_comm_group(gi: number): void{}

	estimate_groups(): void{

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


	calculate_btg_co2(): number{

		var mean_dist = (this.avg_distance[0] + this.avg_distance[1])/2
		var epk = this.data.emissions_per_km.get(this.mode)
		console.log("epk: ", epk, "mode: ", this.mode)
		if (epk != undefined){
			this.co2 = this.trip_count * mean_dist * epk
		}

		return this.co2
	}

	calculate_btg_cost(): number{
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