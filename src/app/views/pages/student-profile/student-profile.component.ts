import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentApiService } from 'src/app/apis/student-api.service';




export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control?.invalid && control?.parent?.dirty);
    const invalidParent = !!(control?.parent?.invalid && control?.parent?.dirty);

    return invalidCtrl || invalidParent;
  }
}

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent implements OnInit {

  tokenId = '';


  userProfile = <any>{};

  credentialsForm: FormGroup;
  willUpdateCredentials = false;
  updatingCredentials = false;


  studentYear = '';


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private studentApi: StudentApiService,
    private snackbar: MatSnackBar,
  ) {
    this.credentialsForm = this.fb.group({
      username: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      currentPassword: [null, [Validators.required]],
      password: [null, []],
      confirmPassword: [null, []],
    }, { validators: this.checkPasswords });

    this.route.params.subscribe(
      (tokens) => {
        this.tokenId = tokens['id'];
      }
    )
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.listenToCredentialChanges();
  }

  loadUserProfile(){
    this.studentApi.getProfile(this.tokenId).subscribe(
      (data) => {
        this.userProfile = data.data;
        this.populateCrendentialInfo();
      }
    )
  }

  listenToCredentialChanges(){
		this.credentialsForm.controls['username'].valueChanges.subscribe(() => this.willUpdateCredentials = true);
		this.credentialsForm.controls['email'].valueChanges.subscribe(() => this.willUpdateCredentials = true);
	}

  populateCrendentialInfo(){
    let info = this.userProfile.credentials;
    this.credentialsForm.patchValue({
      username: info.username,
      email: info.email,
    })
    this.willUpdateCredentials = false;
  }



  updateCredentials(){
    let data = {
      username: this.credentialsForm.controls['username'].value,
      email: this.credentialsForm.controls['email'].value,
      currentPassword: this.credentialsForm.controls['currentPassword'].value,
      password: this.credentialsForm.controls['password'].value,
    }

    this.updatingCredentials = true;
    this.studentApi.updateCredentials(this.tokenId, data).subscribe(
      (data: any) => {
        this.snackbar.open(data.detail, 'Close', { duration: 3 * 1000 })
        this.updatingCredentials = this.willUpdateCredentials = false;
      }, err => {
        this.snackbar.open(err.error.detail, 'Close', { duration: 3 * 1000 })
        this.updatingCredentials = this.willUpdateCredentials = false;
      }
    )
  }

  updateProfile(){
    let data = {
      year: this.studentYear,
    }
    this.studentApi.updateProfileInfo(this.tokenId, data).subscribe(
      (data: any) => {
        this.snackbar.open(data.detail, 'Close', { duration: 3 * 1000 })
      }, err => {
        this.snackbar.open((err.error.detail), 'Close', { duration: 3 * 1000 });
      }
    )
  }






  checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
    let pass = group.get('password')!.value;
    let confirmPass = group.get('confirmPassword')!.value
    return pass === confirmPass ? null : { notSame: true }
  }

}
