import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';
import { ViewClassInfoComponent } from '../pages/view-class-info/view-class-info.component';
import { ViewPublicProfileComponent } from '../pages/view-public-profile/view-public-profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DepartmentsComponent } from './departments/departments.component';
import { IndexComponent } from './index/index.component';
import { UsersComponent } from './users/users.component';
import { ViewDepartmentComponent } from './view-department/view-department.component';

const routes: Routes = [
	{ path: '', redirectTo: 'dashboard', pathMatch: 'full'},
	{
		path: '', component: IndexComponent, canActivate: [],
		canActivateChild: [AuthGuard, RoleGuard],  data: { expectedRole: ["Admin"] },
		children: [
			{ path: 'dashboard', component: DashboardComponent },
			{ path: 'users', component: UsersComponent },
			{ path: 'departments', component: DepartmentsComponent },
			{ path: ':role/profile/:token', component: ViewPublicProfileComponent },
			{ path: 'view-department/:id', component: ViewDepartmentComponent },
			{ path: 'view-class-schedule/:token', component: ViewClassInfoComponent },
		]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
