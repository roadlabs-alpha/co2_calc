import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CompanyPropertiesComponent } from './company-properties/company-properties.component';

import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';


import {MatInputModule} from '@angular/material/input'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import {DemoMaterialModule} from './material-module';
import { CompanyVehiclesComponent } from './company-vehicles/company-vehicles.component';
import { CompanyBusinesstripsComponent } from './company-businesstrips/company-businesstrips.component';
import { Co2CostCalcComponent } from './co2-cost-calc/co2-cost-calc.component';
import { CompanyBusinesstrips2Component } from './company-businesstrips2/company-businesstrips2.component';
import { CompanyCommutingComponent } from './company-commuting/company-commuting.component';

// import * as PlotlyJS from 'plotly.js/dist/plotly.js';
// //import * as PlotlyJS from 'plotly.js';
// import { PlotlyModule } from 'angular-plotly.js';
// PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    AppComponent,
    CompanyPropertiesComponent,
    CompanyVehiclesComponent,
    CompanyBusinesstripsComponent,
    Co2CostCalcComponent,
    CompanyBusinesstrips2Component,
    CompanyCommutingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatButtonModule,
    DemoMaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    DemoMaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
