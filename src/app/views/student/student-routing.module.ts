import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';
import { ViewPublicProfileComponent } from '../pages/view-public-profile/view-public-profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IndexComponent } from './index/index.component';
import { SchedulesComponent } from './schedules/schedules.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
	{ path: '', redirectTo: 'dashboard', pathMatch: 'full'},
	{
		path: '', component: IndexComponent, canActivate: [],
		canActivateChild: [AuthGuard, RoleGuard],  data: { expectedRole: ["Student"] },
		children: [
			{ path: 'dashboard', component: DashboardComponent },
			{ path: 'schedules', component: SchedulesComponent },
			{ path: 'search', component: SearchComponent },
			{ path: ':role/profile/:token', component: ViewPublicProfileComponent },
		]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
