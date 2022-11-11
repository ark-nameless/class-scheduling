import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectDepartmentsComponent } from './select-departments/select-departments.component';



@NgModule({
  declarations: [
    SelectDepartmentsComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SelectDepartmentsComponent,
  ]
})
export class ComponentsModule { }
