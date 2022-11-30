import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';
import { TeacherProfileComponent } from '../pages/teacher-profile/teacher-profile.component';
import { IndexComponent } from './index/index.component';
import { ScheduleComponent } from './schedule/schedule.component';

const routes: Routes = [
	{ path: '', redirectTo: 'schedules', pathMatch: 'full'},
	{
		path: '', component: IndexComponent, canActivate: [],
		canActivateChild: [AuthGuard, RoleGuard],  data: { expectedRole: ["Teacher", "Department Head"] },
		children: [
			// { path: 'dashboard', component: DashboardComponent },
			{ path: 'schedules', component: ScheduleComponent },
			{ path: 'profile/:id/edit', component: TeacherProfileComponent }
			// { path: 'search', component: SearchComponent },
			// { path: ':role/profile/:token', component: ViewPublicProfileComponent },
		]
	}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
