import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthApiService } from 'src/app/apis/auth-api.service';
import { TeacherApiService } from 'src/app/apis/teacher-api.service';
import { AuthService } from 'src/app/services/auth.service';
import { DocumentGeneratorService } from 'src/app/services/document-generator.service';
import Swal from 'sweetalert2';



var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;  





@Component({
  selector: 'app-teacher-profile',
  templateUrl: './teacher-profile.component.html',
  styleUrls: ['./teacher-profile.component.css'],
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
    this.profileForm = this.fb.group({
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

    })
  }

  updateProfileValues() {
    let profile = this.teacherInfo.profile;
    this.profileForm.patchValue({
      // Name 
      firstname: profile.name.firstname,
      lastname: profile.name.lastname,
      middlename: profile.name.middlename,

      // Address
      house_no: profile.address.house_no,
      street: profile.address.street,
      barangay: profile.address.barangay,
      town: profile.address.town,
      province: profile.address.province,

      // Contact Info
      tel_no: profile.contact_info.tel_no,
      phone_no: profile.contact_info.phone_no,

      // Personal Info
      birth_place: profile.personal_info.birth_place,
      date_of_birth: new Date(profile.personal_info.date_of_birth),
      nationality: profile.personal_info.nationality,
      sex: profile.personal_info.sex,

      // Teaching Info
      academic_rank: profile.teaching_info.academic_rank,
      teaching_status: profile.teaching_info.teaching_status,
      nature_of_appointment: profile.teaching_info.nature_of_appointment,
      teaching_record: profile.teaching_info.teaching_record,
      other_educational_qualification: profile.teaching_info.other_educational_qualification,

      // Highest School
      degree: profile.highest_school.degree,
      school_location: profile.highest_school.school_location,

      non_teaching_duty: profile.non_teaching_duty,

      // Consultation
      time: profile.consultation.time,
      consultation_location: profile.consultation.location,

      profile_img: profile.profile_img,

    })
  }

  loadTeacherInfo(){
    this.teacherApi.getTeacherProfile(this.tokenId).subscribe(
      (data) => {
        this.teacherInfo = data.data;
        this.updateProfileValues();
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

  async generateTeachingAssignment() {

    const { value: extras } = await Swal.fire({
      title: 'Multiple inputs',
      html:
        `<p>College of</p>
        <input id="swal-input1" class="swal2-input">
        <p>Semester School Year </p>
        <input id="swal-input2" class="swal2-input">
        <p>Teaching assignment </p>
        <input id="swal-input3" class="swal2-input">`,
      focusConfirm: false,
      preConfirm: () => {
        return [
          (<HTMLInputElement>document.getElementById('swal-input1'))!.value,
          (<HTMLInputElement>document.getElementById('swal-input2'))!.value,
          (<HTMLInputElement>document.getElementById('swal-input3')).value
        ]
      }
    })
    
    if (extras) {
      let teacher_info = this.loadProfileInfo();
      pdfMake.createPdf(this.docgenerator.generateTeachingAssignment(this.teachingAssignment, teacher_info, extras)).open();
    }
	}

  loadProfileInfo(){
    // let b_day = this.profileForm.value.date_of_birth.toISOString().split('T')[0].split('-')
    // b_day = `${b_day[1]}/${b_day[2]}/${b_day[0]}`
    let data = {
        profile_img: this.profileForm.value.profile_img == null ? '' : this.profileForm.value.profile_img == null,
        name: {
          firstname: this.profileForm.value.firstname == null ? '': this.profileForm.value.firstname,
          lastname: this.profileForm.value.lastname == null ? '': this.profileForm.value.lastname,
          middlename: this.profileForm.value.middlename == null ? '': this.profileForm.value.middlename
        },
        address: {
          house_no: this.profileForm.value.house_no == null ? '' : this.profileForm.value.house_no,
          street: this.profileForm.value.street == null ? '' : this.profileForm.value.street,
          barangay: this.profileForm.value.barangay == null ? '' : this.profileForm.value.barangay,
          town: this.profileForm.value.town == null ? '' : this.profileForm.value.town,
          province: this.profileForm.value.province == null ? '' : this.profileForm.value.province
        },
        contact_info: {
          tel_no: this.profileForm.value.tel_no == null ? '' : this.profileForm.value.tel_no,
          phone_no: this.profileForm.value.phone_no == null ? '' : this.profileForm.value.phone_no,
        },
        personal_info: {
          birth_place: this.profileForm.value.birth_place == null ? '' : this.profileForm.value.birth_place,
          date_of_birth: this.profileForm.value.date_of_birth == null ? '' : this.profileForm.value.date_of_birth,
          nationality: this.profileForm.value.nationality == null ? '' : this.profileForm.value.nationality,
          sex: this.profileForm.value.sex == null ? '' : this.profileForm.value.sex
        },
        teaching_info: {
          academic_rank: this.profileForm.value.academic_rank == null ? '' : this.profileForm.value.academic_rank,
          teaching_status: this.profileForm.value.teaching_status == null ? '' : this.profileForm.value.teaching_status,
          nature_of_appointment: this.profileForm.value.nature_of_appointment == null ? '' : this.profileForm.value.nature_of_appointment,
          teaching_record: this.profileForm.value.teaching_record == null ? -1 : this.profileForm.value.teaching_record,
          other_educational_qualification: this.profileForm.value.other_educational_qualification == null ? '' : this.profileForm.value.other_educational_qualification
        },
        highest_school: {
          degree: this.profileForm.value.degree == null ? '' : this.profileForm.value.degree,
          location: this.profileForm.value.school_location == null ? '' : this.profileForm.value.school_location
        },
        non_teaching_duty: this.profileForm.value.non_teaching_duty == null ? '' : this.profileForm.value.non_teaching_duty,
        consultation: {
          time: this.profileForm.value.time == null ? '' : this.profileForm.value.time,
          location: this.profileForm.value.consultation_location == null ? '' : this.profileForm.value.consultation_location
        }
    }
    return data;
  }


  updateProfile() {
    this.sending = true;

    let data = this.loadProfileInfo();

    this.teacherApi.updateProfileInfo(this.tokenId, data).subscribe((data: any) => {
      this.sending = false;
      this.snackbar.open(data.detail, 'Close', { duration: 3 * 1000})
    }, (err: any) => {
      let errorSnackbar = this.snackbar.open(err.error.detail, 'Close', {duration: 3 * 1000})
      this.sending = false;
    })
  }

 
}
