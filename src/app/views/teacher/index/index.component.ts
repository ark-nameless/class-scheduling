import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthApiService } from 'src/app/apis/auth-api.service';
import { AuthService } from 'src/app/services/auth.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  userId = '';

  
  constructor(
    private router: Router,
    private authService: AuthService,
    private authApi: AuthApiService,
    private session: SessionService,
  ) { 
    if (window.sessionStorage.getItem('dept-id') == null) {
      this.authApi.getDepartmentId(session.getUser().id).subscribe(data => {
        window.sessionStorage.setItem('dept-id', data.data);
      })
    }
    this.userId = this.session.getUser().id;
  }

  ngOnInit(): void {
  }

  
  viewProfile(){
    console.log(this.userId);
    this.router.navigate([`/teacher/profile/${this.userId}/edit`]);
  }

  logout(): void {
    this.authService.signOut();
    this.router.navigate(['/login']);
  }

}
