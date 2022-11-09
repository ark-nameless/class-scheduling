import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './views/pages/login/login.component';

const routes: Routes = [
  // { path: '', pathMatch: "full", component: LoginComponent },
  { path: 'login', pathMatch: "full", component: LoginComponent, canActivate:[]},
  // { path: 'admin', loadChildren: () => import(`./views/admin/admin.module`).then(m => m.AdminModule)},
  // { path: 'verify/:token', pathMatch: "prefix", component: VerifyAccountComponent },
  // { path: '**', component: Page404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
