import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class DataService {



	data = new Data();

	constructor() { }




	getData(): Observable<Data> {
		const d = of(this.data);
		return d;
	}

}

export class Data{

	n_workdays_year=250;
	bt_pP_pY=0.3;

	// Modal shares
	commuting_shares={
		"bike": {"share": 0.22, "avg_dist": 8},
		"car": {"share": 0.52, "avg_dist": 42},
		"company_car": {"share": 0.11, "avg_dist": 42},
		"public_transport": {"share": 0.15, "avg_dist": 50}
	}

	business_trip_shares={
		"bike": {"share": 0.1, "avg_dist": 4},
		"private_car": {"share": 0.1, "avg_dist": 75},
		"company_car": {"share": 0.2, "avg_dist": 75},
		"pool_car": {"share": 0.5, "avg_dist": 38},
		"public_transport": {"share": 0.055, "avg_dist": 31},
		"plane": {"share": 0.015, "avg_dist": 4280},
		"train": {"share": 0.03, "avg_dist": 554.8}
	}

	// Prices in €
	energy_price={
		"gasoline": 1.46, //€ per l
		"diesel": 1.26, //€ per l
		"bev": 0.3 // € per kWh
	}

	transport_price_per_km={
		"public_transport": 0.13,
		"train": 0.15,
		"car": 0.3,
		"plane": 0.2,
		"bike": 0.3
	}

	transport_price_monthly={
		"jobrad": 15,
		"public_transport": 60
	}

	// Eminssions in kg per km
	emissions_per_km={
		"public_transport": 0.1,
		"plane": 0.2113,
		"gasoline": 0.2,
		"pedelec": 0.004,
		"train": 0.0356,
		"bike": 0
	}

	// Emissions per energy
	emissions_per_energy={
		"gasoline": 2.33, //per l
		"diesel": 2.6, //per l
		"bev": 0.5 //german mix, per kWh
	}

	// Vehicle Tech
	vehicle_tech = {
		GAS: "gasoline",
		DIESEL: "diesel",
		BEV: "bev",
		PHEV: "phev"
	}


	constructor() { }


}