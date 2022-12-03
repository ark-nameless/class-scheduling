import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';
import { TeacherProfileComponent } from '../pages/teacher-profile/teacher-profile.component';
import { ViewPublicProfileComponent } from '../pages/view-public-profile/view-public-profile.component';
import { ClassSchedulesComponent } from './class-schedules/class-schedules.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DepartmentComponent } from './department/department.component';
import { CreateNewClassScheduleComponent } from './forms/create-new-class-schedule/create-new-class-schedule.component';
import { CreateRequestSubjectsComponent } from './forms/create-request-subjects/create-request-subjects.component';
import { IndexComponent } from './index/index.component';
import { NewScheduleComponent } from './pages/new-schedule/new-schedule.component';
import { RequestClassScheduleComponent } from './pages/request-class-schedule/request-class-schedule.component';
import { ViewClassInfoComponent } from '../pages/view-class-info/view-class-info.component';
import { ViewRequestingDepartmentsComponent } from './pages/view-requesting-departments/view-requesting-departments.component';
import { StudentsComponent } from './students/students.component';
import { EditClassScheduleComponent } from './edit-class-schedule/edit-class-schedule.component';

const routes: Routes = [
	{ path: '', redirectTo: 'dashboard', pathMatch: 'full'},
	{
		path: '', component: IndexComponent, canActivate: [],
		canActivateChild: [AuthGuard, RoleGuard],  data: { expectedRole: ["Department Head"] },
		children: [
			{ path: 'dashboard', component: DashboardComponent },
			{ path: 'students', component: StudentsComponent },
			{ path: 'classes', component: DepartmentComponent },
			{ path: 'class-schedules', component: ClassSchedulesComponent },
			{ path: 'view-class-schedule/:token', component: ViewClassInfoComponent },
			{ path: 'create-new-schedule', component: NewScheduleComponent },
			{ path: 'create-request-subjects', component: CreateRequestSubjectsComponent },
			{ path: 'subject-requests', component: ViewRequestingDepartmentsComponent },
			{ path: ':role/profile/:token', component: ViewPublicProfileComponent },
			{ path: 'request-class-schedule', component: RequestClassScheduleComponent },
			{ path: 'profile/:id/edit', component: TeacherProfileComponent },
			{ path: 'class/:id/edit', component: EditClassScheduleComponent },
		]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeptHeadRoutingModule { }
