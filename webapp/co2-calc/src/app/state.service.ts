import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { VehicleGroup } from './company-vehicles/company-vehicles.component';

@Injectable({
	providedIn: 'root'
})
export class StateService {

	constructor() { }

	state = new State()


	getState(): Observable<State> {
		const st = of(this.state);
		return st;
	}


}



export class State{

	n_employees=0;

	bt_value_set_user: BT_VALUE_SET_USER;

	vehicle_groups_user: Array<VehicleGroup>=[];

	constructor() { 
		this.bt_value_set_user = new BT_VALUE_SET_USER()
	}
	
}



class BT_VALUE_SET_USER{
	
	bt_dist_pt=0;
	bt_dist_train=0;
	bt_dist_plane =0;

	constructor(){}
}