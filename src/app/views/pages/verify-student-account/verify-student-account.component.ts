import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentApiService } from 'src/app/apis/student-api.service';
import { TeacherApiService } from 'src/app/apis/teacher-api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-verify-student-account',
  templateUrl: './verify-student-account.component.html',
  styleUrls: ['./verify-student-account.component.css']
})
export class VerifyStudentAccountComponent implements OnInit {

  verifyForm: FormGroup;
  confirmPass: string = '';
  token: string = '';
  verified_token = false;

  sending = false;
  transferee: boolean = false;


  checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
    let pass = group.get('password')!.value;
    let confirmPass = group.get('confirmPassword')!.value
    return pass === confirmPass ? null : { notSame: true }
  }

  constructor(
    private router: ActivatedRoute,
    private fb: FormBuilder,
    private studentApi: StudentApiService,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private nav_route: Router,
  ) {
    this.verifyForm = this.fb.group({
      username: [null, [Validators.required, Validators.minLength(3)]],
      password: [null, [Validators.required, Validators.minLength(8)]],
      confirmPassword: [null, [Validators.required, Validators.minLength(8)]],

      // Name 
      firstname: [null, [Validators.required]],
      lastname: [null, ],
      middlename: [null, ],

      // Address
      house_no: [null,],
      street: [null,],
      barangay: [null,],
      town: [null,],
      province: [null,],

      // Contact Info
      tel_no: [null,],
      phone_no: [null,],

      // Personal Info
      birth_place: [null,],
      date_of_birth: [null,],
      nationality: [null,],
      sex: [null,],


      father_firstname: [null, ],
      father_lastname: [null, ],
      father_middlename: [null, ],
      mother_firstname: [null, ],
      mother_lastname: [null, ],
      mother_middlename: [null, ],
      guardian_firstname: [null, ],
      guardian_lastname: [null, ],
      guardian_middlename: [null, ],
      address: [null, ],

      elem_name: [null, ],
      elem_location: [null, ],
      elem_year: [null, ],
      junior_high_name: [null, ],
      junior_high_location: [null, ],
      junior_high_year: [null, ],
      senior_high_name: [null, ],
      senior_high_location: [null, ],
      senior_high_year: [null, ],

      is_transfer: [false, ],
      college_name: [null,],
      lrn: [null, ],


      profile_img: [null,]

    }, { validators: this.checkPasswords })

    this.router.params.subscribe( params => 
      this.token = params['token']
    );

  }

  validator(controlName: string, errorName: string) {
    return this.verifyForm.controls[controlName].hasError(errorName);
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

  onSubmit() {
    this.sending = true;

    let data = {
      user: {
        username: this.verifyForm.value.username,
        password: this.verifyForm.value.password
      },
      student: {
        profile_img: this.verifyForm.value.profile_img == null ? '' : this.verifyForm.value.profile_img == null,
        name: {
          firstname: this.verifyForm.value.firstname == null ? '': this.verifyForm.value.firstname,
          lastname: this.verifyForm.value.lastname == null ? '': this.verifyForm.value.lastname,
          middlename: this.verifyForm.value.middlename == null ? '': this.verifyForm.value.middlename
        },
        address: {
          house_no: this.verifyForm.value.house_no == null ? '' : this.verifyForm.value.house_no,
          street: this.verifyForm.value.street == null ? '' : this.verifyForm.value.street,
          barangay: this.verifyForm.value.barangay == null ? '' : this.verifyForm.value.barangay,
          town: this.verifyForm.value.town == null ? '' : this.verifyForm.value.town,
          province: this.verifyForm.value.province == null ? '' : this.verifyForm.value.province
        },
        contact_info: {
          tel_no: this.verifyForm.value.tel_no == null ? '' : this.verifyForm.value.tel_no,
          phone_no: this.verifyForm.value.phone_no == null ? '' : this.verifyForm.value.phone_no,
        },
        personal_info: {
          birth_place: this.verifyForm.value.birth_place == null ? '' : this.verifyForm.value.birth_place,
          date_of_birth: this.verifyForm.value.date_of_birth == null ? '' : this.verifyForm.value.date_of_birth.toString(),
          nationality: this.verifyForm.value.nationality == null ? '' : this.verifyForm.value.nationality,
          sex: this.verifyForm.value.sex == null ? '' : this.verifyForm.value.sex
        },
        parent_info: {
          father: {
            firstname: this.verifyForm.value.father_firstname,
            lastname: this.verifyForm.value.father_lastname,
            middlename: this.verifyForm.value.father_middlename,
          },
          mother: {
            firstname: this.verifyForm.value.mother_firstname,
            lastname: this.verifyForm.value.mother_lastname,
            middlename: this.verifyForm.value.mother_middlename,
          },
          guardian: {
            firstname: this.verifyForm.value.guardian_firstname,
            lastname: this.verifyForm.value.guardian_lastname,
            middlename: this.verifyForm.value.guardian_middlename,
          },
          address: this.verifyForm.value.address
        },
        schooling_info: {
          elem: {
            name: this.verifyForm.value.elem_name,
            location: this.verifyForm.value.elem_location,
            year: this.verifyForm.value.elem_year,
          },
          junior_high: {
            name: this.verifyForm.value.junior_high_name,
            location: this.verifyForm.value.junior_high_location,
            year: this.verifyForm.value.junior_high_year,
          },
          senior_high: {
            name: this.verifyForm.value.senior_high_name,
            location: this.verifyForm.value.senior_high_location,
            year: this.verifyForm.value.senior_high_year,
          },
        },
        learner_info: {
          is_transfer: this.verifyForm.value.is_transfer,
          college_name: this.verifyForm.value.college_name,
          lrn: this.verifyForm.value.lrn
        }
      }
    }

    this.studentApi.verifyStudentAccount(this.token, data).subscribe((data: any) => {
      let dialog = this._snackBar.open(JSON.stringify(data.data.detail), 'Clear', {duration: 5 * 1000});

      dialog.onAction().subscribe(() => {
        this.nav_route.navigate(['/login'])
      });

      dialog.afterDismissed().subscribe(() => {
        this.nav_route.navigate(['/login'])
      });

      this.sending = false;
    }, (err: any) => {
      let errorSnackbar = this._snackBar.open(err.error.detail, 'Close', {duration: 5 * 1000})
      this.sending = false;
    })
  }
}
