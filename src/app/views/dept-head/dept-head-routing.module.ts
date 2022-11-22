import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';
import { ClassSchedulesComponent } from './class-schedules/class-schedules.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DepartmentComponent } from './department/department.component';
import { IndexComponent } from './index/index.component';
import { ViewClassInfoComponent } from './pages/view-class-info/view-class-info.component';
import { StudentsComponent } from './students/students.component';

const routes: Routes = [
	{ path: '', redirectTo: 'dashboard', pathMatch: 'full'},
	{
		path: '', component: IndexComponent, canActivate: [],
		canActivateChild: [AuthGuard, RoleGuard],  data: { expectedRole: "Department Head" },
		children: [
			{ path: 'dashboard', component: DashboardComponent },
			{ path: 'students', component: StudentsComponent },
			{ path: 'department', component: DepartmentComponent },
			{ path: 'class-schedules', component: ClassSchedulesComponent },
			{ path: 'view-class-schedule/:token', component: ViewClassInfoComponent },
		]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeptHeadRoutingModule { }
