import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectDepartmentsComponent } from './select-departments/select-departments.component';
import { DialogDeleteAccountComponent } from './dialog-delete-account/dialog-delete-account.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    SelectDepartmentsComponent,
    DialogDeleteAccountComponent,
  ],
  imports: [
    CommonModule,

    MatDialogModule,
    MatButtonModule,
  ],
  exports: [
    SelectDepartmentsComponent,
    DialogDeleteAccountComponent,
  ]
})
export class ComponentsModule { }
