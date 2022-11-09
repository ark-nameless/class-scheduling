import { Component, OnInit } from '@angular/core';
import { 
  FormGroup, 
  FormControl, 
  FormArray, 
  Validators, 
  FormBuilder, 
  FormGroupDirective, 
  NgForm,
  ValidatorFn,
  AbstractControl,
  ValidationErrors
} from "@angular/forms"
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control?.invalid && control?.parent?.dirty);
    const invalidParent = !!(control?.parent?.invalid && control?.parent?.dirty);

    return invalidCtrl || invalidParent;
  }
}

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.css']
})
export class VerifyAccountComponent implements OnInit {

  verifyForm: FormGroup;
  confirmPass: string = '';
  matcher = new MyErrorStateMatcher();
  token: string = '';
  verified_token = false;

  checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
    let pass = group.get('password')!.value;
    let confirmPass = group.get('confirmPassword')!.value
    return pass === confirmPass ? null : { notSame: true }
  }

  constructor(
    private router: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private nav_route: Router,
  ) {
    this.verifyForm = this.fb.group({
      username: [null, [Validators.required, Validators.minLength(3)]],
      password: [null, [Validators.required, Validators.minLength(8)]],
      confirmPassword: [null, [Validators.required, Validators.minLength(8)]],
      firstname: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      middlename: [null, [Validators.required]],
      address: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      year: [null, [Validators.required, Validators.pattern('[1-4]')]],
      student_img: [null, [Validators.required]]
    }, { validators: this.checkPasswords })

    this.router.params.subscribe( params => 
      this.token = params['token']
    );
  }

  ngOnInit(): void {
    this.authService.checkVerifyToken(this.token).subscribe((data: any) => {
      this.verified_token = data.status;
    },
    err => {
      let prompt = this._snackBar.open('Invalid Link', 'Clear', {duration: 3 * 1000})

      prompt.onAction().subscribe(() => {
        this.nav_route.navigate(['/login']);
      });
      prompt.afterDismissed().subscribe(() => {
        this.nav_route.navigate(['/login']);
      });
    })
  }

}
