import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeptHeadRoutingModule } from './dept-head-routing.module';
import { IndexComponent } from './index/index.component';
import { StudentsComponent } from './students/students.component';
import { DepartmentComponent } from './department/department.component';
import { ClassSchedulesComponent } from './class-schedules/class-schedules.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CdkMenuModule } from '@angular/cdk/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { CreateNewClassScheduleComponent } from './forms/create-new-class-schedule/create-new-class-schedule.component';
import { NewStudentComponent } from './forms/new-student/new-student.component';
import { ViewClassInfoComponent } from './pages/view-class-info/view-class-info.component';

@NgModule({
  declarations: [
    IndexComponent,
    StudentsComponent,
    DepartmentComponent,
    ClassSchedulesComponent,
    DashboardComponent,
    CreateNewClassScheduleComponent,
    NewStudentComponent,
    ViewClassInfoComponent
  ],
  imports: [
    CommonModule,
    DeptHeadRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    ComponentsModule,

    CdkMenuModule,

    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatStepperModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,
    MatCardModule,
    MatDividerModule,
    MatProgressBarModule,
    MatSidenavModule,
    NgSelectModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatExpansionModule,
    MatButtonToggleModule,
    NgxMaterialTimepickerModule,
  ]
})
export class DeptHeadModule { }
