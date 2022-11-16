import { Component, Input, OnInit } from '@angular/core';
import { 
  FormGroup, 
  FormControl, 
  FormArray, 
  Validators, 
  FormBuilder, 
  FormGroupDirective, 
  NgForm
} from "@angular/forms"
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionService } from 'src/app/services/session.service';
import { AuthService } from 'src/app/services/auth.service';
import { AuthApiService } from 'src/app/apis/auth-api.service';



export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  initialValue: FormGroup;

  sending = false

  emailErrorMatcher = new MyErrorStateMatcher

  constructor(private fb: FormBuilder, 
              private authApi: AuthApiService,
              private authService: AuthService,
              private tokenStorage: SessionService,
              private router: Router,
              private _snackBar: MatSnackBar) {
    this.initialValue = this.loginForm = this.fb.group({
      username: [null, [Validators.required, Validators.minLength(3)]],
      password: [null, [Validators.required, Validators.minLength(3)]],
    })

    
  }

  ngOnInit(): void {
    
  }

  loginUser() {
    const { username, password } = this.loginForm.value
    this.sending = true;

    this.authService.login(username, password).subscribe(
      data => {
        this.tokenStorage.saveToken(data.access_token);
        this.tokenStorage.saveRefreshToken(data.refresh_token);
        this.tokenStorage.saveUser(data.data);
        this.sending = false;

        const user = this.tokenStorage.getUser();

        if (user.role == 'Admin') this.router.navigate(['/admin/dashboard']);
        else if (user.role == 'Department Head'){
          
          this.router.navigate(['/dept-head/dashboard']);
        } 
        else if (user.role == 'Teacher') this.router.navigate(['/teacher/dashboard']);
        else if (user.role == 'Student') this.router.navigate(['/student/dashboard']);

      },
      err => {
        let errorSnackbar = this._snackBar.open(err.error.detail, 'Clear', {duration: 5 * 1000})
        this.sending = false;
        
        errorSnackbar.onAction().subscribe(() => {
          this.loginForm.reset(this.initialValue);
        });
      }
    )
  }

  reloadPage(): void {
    window.location.reload();
  }
}

