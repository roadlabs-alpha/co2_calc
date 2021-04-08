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
		"pt": {"share": 0.15, "avg_dist": 50}
	}

	business_trip_shares={
		"bike": {"share": 0.1, "avg_dist": 4},
		"private_car": {"share": 0.1, "avg_dist": 75},
		"company_car": {"share": 0.2, "avg_dist": 75},
		"pool_car": {"share": 0.5, "avg_dist": 38},
		"pt": {"share": 0.055, "avg_dist": 31},
		"plane": {"share": 0.015, "avg_dist": 4280},
		"train": {"share": 0.03, "avg_dist": 554.8}
	}

	// Prices in €
	energy_price = new Map<string, number>();

	// transport_price_per_km={
		// 	"pt": 0.13,
		// 	"train": 0.15,
		// 	"car": 0.3,
		// 	"plane": 0.2,
		// 	"bike": 0.3
		// }
		transport_price_per_km = new Map<string, number>();

		transport_price_monthly={
			"jobrad": 15,
			"pt": 60
		}

		// Eminssions in kg per km
		// emissions_per_km={
			// 	"pt": 0.1,
			// 	"plane": 0.2113,
			// 	"gasoline": 0.2,
			// 	"pedelec": 0.004,
			// 	"train": 0.0356,
			// 	"bike": 0
			// }

			emissions_per_km = new Map<string, number>();

			emissions_per_energy = new Map<string, number>();


			// Vehicle Tech
			vehicle_tech = {
				GAS: "gasoline",
				DIESEL: "diesel",
				BEV: "bev",
				PHEV: "phev"
			}

			vehicle_class= new Map<string, Vehicle_Price>();




			constructor() {
				this.emissions_per_km.set('pt', 0.1);
				this.emissions_per_km.set('plane', 0.2113); 
				this.emissions_per_km.set('gasoline', 0.2); 
				this.emissions_per_km.set('car', 0.2); 
				this.emissions_per_km.set('pedelec', 0.004); 
				this.emissions_per_km.set('train', 0.0356); 
				this.emissions_per_km.set('bike', 0); 


				this.emissions_per_energy.set("gasoline", 2.33) //per l
				this.emissions_per_energy.set("diesel",2.6) //per l
				this.emissions_per_energy.set("bev",0.5) //german mix, per kWh)
				this.emissions_per_energy.set("bike",0) //german mix, per kWh)
				this.emissions_per_energy.set("human",0) //german mix, per kWh)

				this.energy_price.set("gasoline", 1.46) 	//€ per l
				this.energy_price.set("diesel", 1.26) 		//€ per l
				this.energy_price.set("bev", 0.3) 			// € per kWh
				this.energy_price.set("human", 0) 			// € per kWh


				// {"id":2, "name": "Transporter", value:"transporter"},
				// this.vehicle_class.set("compact", {"price_new": 20000, "residual_value3y": 10000, "consumption": 6, "e_consumption": 12, "workshop_cost": 720 , "fixcost": 1200})
				// this.vehicle_class.set("executive", {"price_new": 55000, "residual_value3y": 30000, "consumption": 7, "e_consumption": 16, "workshop_cost": 720 , "fixcost": 1200})
				// this.vehicle_class.set("transporter", {"price_new": 40000, "residual_value3y": 15000, "consumption": 8, "e_consumption": 20, "workshop_cost": 720 , "fixcost": 1200})

				this.vehicle_class.set("mini", {"price_new": 16000, "residual_value3y": 8000, "consumption": 6, "e_consumption": 12, "workshop_cost": 600 , "fixcost": 1000})
				this.vehicle_class.set("small", {"price_new": 25000, "residual_value3y": 12500, "consumption": 6, "e_consumption": 12, "workshop_cost": 600 , "fixcost": 1000})
				this.vehicle_class.set("medium_small", {"price_new": 30000, "residual_value3y": 15000, "consumption": 7, "e_consumption": 14, "workshop_cost": 720 , "fixcost": 1200})
				this.vehicle_class.set("medium", {"price_new": 45000, "residual_value3y": 22500, "consumption": 7, "e_consumption": 14, "workshop_cost": 720 , "fixcost": 1200})
				this.vehicle_class.set("medium_big", {"price_new": 55000, "residual_value3y": 27500, "consumption": 7, "e_consumption": 16, "workshop_cost": 1200 , "fixcost": 1600})
				this.vehicle_class.set("big", {"price_new": 110000, "residual_value3y": 50000, "consumption": 7, "e_consumption": 20, "workshop_cost": 1600 , "fixcost": 2400})
				
				this.vehicle_class.set("bike", {"price_new": 1200, "residual_value3y": 500, "consumption": 0, "e_consumption": 1, "workshop_cost": 500 , "fixcost": 150})
				this.vehicle_class.set("e-bike", {"price_new": 2500, "residual_value3y": 500, "consumption": 0, "e_consumption": 1, "workshop_cost": 500 , "fixcost": 150})
				this.vehicle_class.set("cargo_bike", {"price_new": 2500, "residual_value3y": 500, "consumption": 0, "e_consumption": 1, "workshop_cost": 500 , "fixcost": 150})

			
				this.transport_price_per_km.set("pt", 0.13)
				this.transport_price_per_km.set("train", 0.15)
				this.transport_price_per_km.set("car", 0.3)
				this.transport_price_per_km.set("plane", 0.2)
				this.transport_price_per_km.set("bike", 0.3)
				
			}

		}

export class Vehicle_Price{

	price_new=0;
	residual_value3y=0;
	consumption=-1;
	e_consumption=-1;
	workshop_cost= 720;
	fixcost= 1200
}