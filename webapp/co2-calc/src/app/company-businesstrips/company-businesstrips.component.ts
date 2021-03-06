import { Component, OnInit, SimpleChanges } from '@angular/core';
import {MatFormFieldControl} from "@angular/material/form-field"
import { FormControl, FormGroup } from '@angular/forms'
import { StateService, State} from '../state.service';
import { DataService, Data} from '../data.service';

@Component({
	selector: 'app-company-businesstrips',
	templateUrl: './company-businesstrips.component.html',
	styleUrls: ['./company-businesstrips.component.css', "../app.component.css"],
})
export class CompanyBusinesstripsComponent implements OnInit {


	fg_bt = new FormGroup({
		fc_number_pt: new FormControl(0),
		fc_number_train: new FormControl(0),
		fc_number_plane: new FormControl(0),

		fc_dist_pt: new FormControl(0),
		fc_dist_train: new FormControl(0),
		fc_dist_plane: new FormControl(0),
	});

	total_bt = 0;

	constructor(private stateService: StateService, private dataService: DataService) { }

	state = new State();
	data = new Data();

	ngOnInit(): void {
		this.getState();
		this.getData();
		this.estimate_missing()

		this.stateService.getState().subscribe(st=> console.log("subs"));

		//this.fg_bt.valueChanges.subscribe(val =>{this.estimate_missing()});
	}



	estimate_missing(): void{
		this.total_bt = this.data.n_workdays_year * this.state.n_employees * this.data.bt_pP_pY;
		this.fg_bt.setValue({
			"fc_number_pt": (this.total_bt * this.data.business_trip_shares.pt.share).toFixed(2), 
			"fc_number_train": (this.total_bt * this.data.business_trip_shares.train.share).toFixed(2), 
			"fc_number_plane": (this.total_bt * this.data.business_trip_shares.plane.share).toFixed(2), 
			"fc_dist_pt": (this.total_bt * this.data.business_trip_shares.pt.share * this.data.business_trip_shares.pt.avg_dist).toFixed(2), 
			"fc_dist_train": (this.total_bt * this.data.business_trip_shares.train.share * this.data.business_trip_shares.train.avg_dist).toFixed(2), 
			"fc_dist_plane": (this.total_bt * this.data.business_trip_shares.plane.share * this.data.business_trip_shares.plane.avg_dist).toFixed(2)})


		//console.log("We estitmate a total of ", this.total_bt, "business trips per year.")

	}

	save_value_set(): void{
		this.stateService.state.bt_value_set_user.bt_dist_pt = this.fg_bt.value.fc_dist_pt;
		this.stateService.state.bt_value_set_user.bt_dist_train = this.fg_bt.value.fc_dist_train;
		this.stateService.state.bt_value_set_user.bt_dist_plane = this.fg_bt.value.fc_dist_plane;
		//console.log(this.fg_bt.value)

	}


	getState(): void {
		this.stateService.getState().subscribe(st => this.state = st);
	}

	getData(): void {
		this.dataService.getData().subscribe(dat => this.data = dat);
	}

}
