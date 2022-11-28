import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { IndexComponent } from './index/index.component';
import { MaterialModule } from 'src/app/material/material.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ComponentsModule } from 'src/app/components/components.module';
import { SchedulesComponent } from './schedules/schedules.component';
import { SearchComponent } from './search/search.component';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    IndexComponent,
    DashboardComponent,
    SchedulesComponent,
    SearchComponent
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    ComponentsModule,

    NgSelectModule,

    MaterialModule,
  ]
})
export class StudentModule { }
