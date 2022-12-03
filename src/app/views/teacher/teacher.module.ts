import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherRoutingModule } from './teacher-routing.module';
import { IndexComponent } from './index/index.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MAT_DATE_LOCALE } from '@angular/material/core';


@NgModule({
  declarations: [
    IndexComponent,
    ScheduleComponent
  ],
  imports: [
    CommonModule,
    TeacherRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    ComponentsModule,

    MaterialModule,
  ],
  providers:[
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ]
})
export class TeacherModule { }
