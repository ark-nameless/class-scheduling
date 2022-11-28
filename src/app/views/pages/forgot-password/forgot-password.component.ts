import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthApiService } from 'src/app/apis/auth-api.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  emailFormControl = new FormControl(null, [Validators.required, Validators.email]);

  sending = false;

  constructor(
    private router: Router,
    private authApi: AuthApiService,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {
  }

  onSubmit(): void { 
    this.sending = true;
    let sentToEmail = this.emailFormControl.value ?? '';

    this.authApi.sendPasswordResetViaEmail({email: sentToEmail}).subscribe(
      (data:any) => {
        this.sending = false;
        let dialog = this.snackbar.open(data.detail, 'Login', {duration: 3 * 1000})

        dialog.onAction().subscribe(() => {
          this.router.navigate(['/login']);
        });
        dialog.afterDismissed().subscribe(() => {
          this.router.navigate(['/login']);
        })
      }, (err: any) => {
        let errorSnackbar = this.snackbar.open(err.detail, 'Login', {duration: 5 * 1000})
        this.sending = false;
        
        errorSnackbar.onAction().subscribe(() => {
          this.router.navigate(['/login']);
        });
      }
    )

  }

}
