import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './guards/login.guard';
import { RoleGuard } from './guards/role.guard';
import { ForgotPasswordComponent } from './views/pages/forgot-password/forgot-password.component';
import { LoginComponent } from './views/pages/login/login.component';
import { Page404Component } from './views/pages/page404/page404.component';
import { VerifyAccountComponent } from './views/pages/verify-account/verify-account.component';
import { VerifyStudentAccountComponent } from './views/pages/verify-student-account/verify-student-account.component';
import { VerifyTeacherAccountComponent } from './views/pages/verify-teacher-account/verify-teacher-account.component';

const routes: Routes = [
	{ path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', pathMatch: "full", component: LoginComponent, canActivate:[LoginGuard] },
  { path: 'forgot-password', pathMatch: 'full', component: ForgotPasswordComponent, canActivate:[LoginGuard] },
  { path: 'admin', loadChildren: () => import(`./views/admin/admin.module`).then(m => m.AdminModule)},
  { path: 'verify-account/:token', pathMatch: "prefix", component: VerifyAccountComponent, canActivate:[LoginGuard] },
  { path: 'verify-student-account/:token', pathMatch: "prefix", component: VerifyStudentAccountComponent, canActivate:[LoginGuard] },
  { path: 'verify-teacher-account/:token', pathMatch: "prefix", component: VerifyTeacherAccountComponent, canActivate:[LoginGuard] },
  { path: '**', component: Page404Component, canActivate:[LoginGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
