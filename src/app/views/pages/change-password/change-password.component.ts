import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthApiService } from 'src/app/apis/auth-api.service';




@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  token: string = '';
  sending = false;

  form: FormGroup;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authApi: AuthApiService,
    private snackbar: MatSnackBar,
  ) { 
    this.route.params.subscribe( params => 
      this.token = params['token']
    );

    this.form = this.fb.group({
      password: [null, [Validators.required, Validators.minLength(8)]],
      confirmPassword: [null, [Validators.required, Validators.minLength(8)]],
    }, { validators: this.checkPasswords })

  }

  ngOnInit(): void {
  }


  checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
    let pass = group.get('password')!.value;
    let confirmPass = group.get('confirmPassword')!.value
    return pass === confirmPass ? null : { notSame: true }
  }

  onSubmit(){
    const newPassword  = this.form.get('password')!.value;
    this.sending = true;

    this.authApi.resetNewPassword(this.token, { password: newPassword } ).subscribe(
      (data: any) => {
        let dialog = this.snackbar.open(data.detail, 'Login', {duration: 5 * 1000})

        dialog.onAction().subscribe(() => {
          this.router.navigate(['/login']);
        });
        dialog.afterDismissed().subscribe(() => {
          this.router.navigate(['/login']);
        })
      },
      (err: any) => {
        let errorSnackbar = this.snackbar.open(err.error.detail, 'Login', {duration: 5 * 1000})
        this.sending = false;
        
        errorSnackbar.onAction().subscribe(() => {
          this.router.navigate(['/login']);
        });
      }
    )
  }

}


