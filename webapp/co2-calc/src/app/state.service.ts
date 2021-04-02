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

	bt_value_set_user={}

	vehicle_groups_user: Array<VehicleGroup>=[];

	constructor() { }
	
}