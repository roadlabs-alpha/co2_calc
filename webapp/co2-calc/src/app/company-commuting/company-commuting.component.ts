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
