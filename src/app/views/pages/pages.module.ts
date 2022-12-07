import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';



import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { Page404Component } from './page404/page404.component';
import { VerifyAccountComponent } from './verify-account/verify-account.component';
import { VerifyStudentAccountComponent } from './verify-student-account/verify-student-account.component';
import { VerifyTeacherAccountComponent } from './verify-teacher-account/verify-teacher-account.component';
import { MatNativeDateModule } from '@angular/material/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ViewPublicProfileComponent } from './view-public-profile/view-public-profile.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { ViewClassInfoComponent } from './view-class-info/view-class-info.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { TeacherProfileComponent } from './teacher-profile/teacher-profile.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { RouterModule } from '@angular/router';
import { MissionVissionComponent } from './mission-vission/mission-vission.component';




@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    Page404Component,
    VerifyAccountComponent,
    VerifyStudentAccountComponent,
    VerifyTeacherAccountComponent,
    ChangePasswordComponent,
    ViewPublicProfileComponent,
    ViewClassInfoComponent,
    TeacherProfileComponent,
    StudentProfileComponent,
    MissionVissionComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,

    ComponentsModule,

    MatButtonModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatDividerModule,
    MatListModule,
    MatExpansionModule,
  ],
  exports: [
    LoginComponent,
    ChangePasswordComponent,
    ViewPublicProfileComponent,
    MissionVissionComponent,
  ]
})
export class PagesModule { }
