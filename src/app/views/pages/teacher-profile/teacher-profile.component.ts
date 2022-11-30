import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthApiService } from 'src/app/apis/auth-api.service';
import { TeacherApiService } from 'src/app/apis/teacher-api.service';
import { AuthService } from 'src/app/services/auth.service';
import { DocumentGeneratorService } from 'src/app/services/document-generator.service';

var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;  




export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control?.invalid && control?.parent?.dirty);
    const invalidParent = !!(control?.parent?.invalid && control?.parent?.dirty);

    return invalidCtrl || invalidParent;
  }
}



@Component({
  selector: 'app-teacher-profile',
  templateUrl: './teacher-profile.component.html',
  styleUrls: ['./teacher-profile.component.css']
})
export class TeacherProfileComponent implements OnInit {

  tokenId = '';

  teacherInfo = <any>{};
  teachingAssignment = <any>[];
  loadingTeachingAssignment = true;

  credentialsForm!: FormGroup;
  willUpdateCredentials = false;
  updatingCredentials = false;


  profileForm!: FormGroup;


  verifyForm!: FormGroup;
  confirmPass: string = '';
  matcher = new MyErrorStateMatcher();
  token: string = '';
  verified_token = false;

  sending = false;


  checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
    let pass = group.get('password')!.value;
    let confirmPass = group.get('confirmPassword')!.value
    return pass === confirmPass ? null : { notSame: true }
  }


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private teacherApi: TeacherApiService,
    private authService: AuthService,
    private docgenerator: DocumentGeneratorService,
  ) { 

    this.credentialsForm = this.fb.group({
      username: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      currentPassword: [null, [Validators.required]],
      password: [null, []],
      confirmPassword: [null, []],
    }, { validators: this.checkPasswords });
    
    this.initializeForm();
    this.route.params.subscribe(
      (tokens) => {
        this.tokenId = tokens['id'];
      }
    )
  }

  ngOnInit(): void {
    this.loadingTeachingAssignment = true;

    this.loadTeacherInfo();
    this.listenToCredentialChanges();
    this.loadTeachingAssignment();
  }

  populateCrendentialInfo(){
    let info = this.teacherInfo.credentials;
    this.credentialsForm.patchValue({
      username: info.username,
      email: info.email,
    })
    this.willUpdateCredentials = false;
  }

  listenToCredentialChanges(){
		this.credentialsForm.controls['username'].valueChanges.subscribe(() => this.willUpdateCredentials = true);
		this.credentialsForm.controls['email'].valueChanges.subscribe(() => this.willUpdateCredentials = true);
	}

  initializeForm() {
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

      // Teaching Info
      academic_rank: [null],
      teaching_status: [null,],
      nature_of_appointment: [null,],
      teaching_record: [null, ],
      other_educational_qualification: [null, ],
      
      // Highest School
      degree: [null],
      school_location: [null,],

      non_teaching_duty: [null],

      // Consultation
      time: [null,],
      consultation_location: [null,],

      profile_img: [null,]

    }, { validators: this.checkPasswords })
  }

  loadTeacherInfo(){
    this.teacherApi.getTeacherProfile(this.tokenId).subscribe(
      (data) => {
        this.teacherInfo = data.data;
        this.populateCrendentialInfo();
      }
    )
  }

  loadTeachingAssignment(){
    this.teacherApi.getTeachingAssigment(this.tokenId).subscribe(
      (data) => {
        this.loadingTeachingAssignment = false;
        this.teachingAssignment = data.data;
      }
    )
  }


  updateCredentials(){
    let data = {
      username: this.credentialsForm.controls['username'].value,
      email: this.credentialsForm.controls['email'].value,
      currentPassword: this.credentialsForm.controls['currentPassword'].value,
      password: this.credentialsForm.controls['password'].value,
    }

    this.updatingCredentials = true;
    this.teacherApi.updateCredentials(this.tokenId, data).subscribe(
      (data: any) => {
        this.snackbar.open(data.detail, 'Close', { duration: 3 * 1000 })
        this.updatingCredentials = this.willUpdateCredentials = false;
      }, err => {
        this.snackbar.open(err.error.detail, 'Close', { duration: 3 * 1000 })
        this.updatingCredentials = this.willUpdateCredentials = false;
      }
    )
  }

  updateProfile() {
    console.log('updating profile');
  }

  generateTeachingAssignment() {
		pdfMake.createPdf(this.docgenerator.generateTeachingAssignment(this.teachingAssignment)).open();
	}


  onSubmit() {
    this.sending = true;

    let data = {
      user: {
        username: this.verifyForm.value.username,
        password: this.verifyForm.value.password
      },
      teacher: {
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
        teaching_info: {
          academic_rank: this.verifyForm.value.academic_rank == null ? '' : this.verifyForm.value.academic_rank,
          teaching_status: this.verifyForm.value.teaching_status == null ? '' : this.verifyForm.value.teaching_status,
          nature_of_appointment: this.verifyForm.value.nature_of_appointment == null ? '' : this.verifyForm.value.nature_of_appointment,
          teaching_record: this.verifyForm.value.teaching_record == null ? -1 : this.verifyForm.value.teaching_record,
          other_educational_qualification: this.verifyForm.value.other_educational_qualification == null ? '' : this.verifyForm.value.other_educational_qualification
        },
        highest_school: {
          degree: this.verifyForm.value.degree == null ? '' : this.verifyForm.value.degree,
          location: this.verifyForm.value.school_location == null ? '' : this.verifyForm.value.school_location
        },
        non_teaching_duty: this.verifyForm.value.non_teaching_duty == null ? '' : this.verifyForm.value.non_teaching_duty,
        consultation: {
          time: this.verifyForm.value.time == null ? '' : this.verifyForm.value.time,
          location: this.verifyForm.value.consultation_location == null ? '' : this.verifyForm.value.consultation_location
        }
      }
    }

    this.teacherApi.verifyTeacherInformation(this.token, data).subscribe((data: any) => {
      console.log(data)
      let dialog = this.snackbar.open(JSON.stringify(data.data.detail), 'Clear', {duration: 5 * 1000});

      dialog.onAction().subscribe(() => {
        this.router.navigate(['/login'])
      });

      dialog.afterDismissed().subscribe(() => {
        this.router.navigate(['/login'])
      });

      this.sending = false;
    }, (err: any) => {
      let errorSnackbar = this.snackbar.open(err.error.detail, 'Close', {duration: 5 * 1000})
      this.sending = false;
    })
  }

 
}
