import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

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

	constructor() { }
	
}