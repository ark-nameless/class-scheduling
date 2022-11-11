import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IndexComponent } from './index/index.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
	{ path: '', redirectTo: 'dashboard', pathMatch: 'full'},
	{
		path: '', component: IndexComponent, canActivate: [],
		canActivateChild: [AuthGuard, RoleGuard],  data: { expectedRole: "Admin" },
		children: [
      	{ path: 'dashboard', component: DashboardComponent },
		{ path: 'users', component: UsersComponent },
			// { path: 'departments', component: DepartmentsComponent },
		]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
