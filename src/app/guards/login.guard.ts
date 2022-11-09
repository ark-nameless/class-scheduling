import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { SessionService } from '../services/session.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private tokenStorage: SessionService,
    private router: Router,
    private authService: AuthService,
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      let user = this.tokenStorage.getUser();

      if (this.authService.isLoggedIn()){
        if (user.role == 'Admin') this.router.navigate(['/admin']);
        else if (user.role == 'Teacher') this.router.navigate(['/teacher']);
        else if (user.role == 'Head') this.router.navigate(['/head']);
        else if (user.role == 'Student') this.router.navigate(['/student']);

        return false;
      }
      
      return true;
  }
  
}
