import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { IndexComponent } from './index/index.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs'
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { UsersComponent } from './users/users.component';
import { NewStudentComponent } from './forms/new-student/new-student.component';
import { NewTeacherComponent } from './forms/new-teacher/new-teacher.component';
import { TableStudentsComponent } from './tables/table-students/table-students.component';
import { TableTeachersComponent } from './tables/table-teachers/table-teachers.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {CdkMenuModule} from '@angular/cdk/menu';
import {MatDialogModule} from '@angular/material/dialog';
import { TableDepartmentsComponent } from './tables/table-departments/table-departments.component';
import { DepartmentsComponent } from './departments/departments.component';
import { NewDepartmentComponent } from './forms/new-department/new-department.component';
import { PagesModule } from '../pages/pages.module';
import { ViewDepartmentComponent } from './view-department/view-department.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    IndexComponent,
    DashboardComponent,
    UsersComponent,
    NewStudentComponent,
    NewTeacherComponent,
    TableStudentsComponent,
    TableTeachersComponent,
    TableDepartmentsComponent,
    DepartmentsComponent,
    NewDepartmentComponent,
    ViewDepartmentComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,

    ComponentsModule,
    PagesModule,

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
    MatTooltipModule
  ]
})
export class AdminModule { }
