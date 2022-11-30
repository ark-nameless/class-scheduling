import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { tap } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable()
export class UnAuthorizedInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private authService: AuthService,
  ) { 
    
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(tap(() => { },
      (err: any) => {

        console.log(err);
        if (err instanceof HttpErrorResponse) {
          if ((err.status === 422) && (err.message.search('authorization') != -1 || err.error.detail.search('expired') != -1)) {
            this.authService.signOut();
            this.router.navigate(['/login']);
          } else {
            return;
          }
        }
      }));
  }
}