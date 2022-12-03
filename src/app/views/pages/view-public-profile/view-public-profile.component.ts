import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentApiService } from 'src/app/apis/student-api.service';
import { TeacherApiService } from 'src/app/apis/teacher-api.service';
import { DocumentGeneratorService } from 'src/app/services/document-generator.service';
import { SessionService } from 'src/app/services/session.service';
import Swal from 'sweetalert2';

var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;  
@Component({
  selector: 'app-view-public-profile',
  templateUrl: './view-public-profile.component.html',
  styleUrls: ['./view-public-profile.component.css']
})
export class ViewPublicProfileComponent implements OnInit {
  userId = '';
  userRole = '';
  currentRole = '';

  teacherInfo = <any>[];

  userProfile = <any>{};
  userName = ''
  profileIndicator = '';

  teachingAssignment = <any>[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentApi: StudentApiService,
    private teacherApi: TeacherApiService,
    private docgenerator: DocumentGeneratorService,
    private session: SessionService,

  ) { 
    this.route.params.subscribe( params => {
        this.userId = params['token'];
        this.userRole = params['role'];

        if (this.userRole == 'student'){
          this.loadStudentProfile();

        } 
        else if (this.userRole == 'teacher' || this.userRole == 'department head'){
          this.loadTeacherProfile();
        }
      }
    );

    this.currentRole = session.getUser().role;
  }

  ngOnInit(): void {
    this.loadTeacherInfo();
  }

  loadStudentProfile(){
    this.profileIndicator = 'Student';
    this.studentApi.getStudentPublicProfile(this.userId).subscribe(
      (data:any) => {
        this.userProfile = data.data;
        console.log(this.userProfile);
        let name = this.userProfile.name;

        this.userName = `${name['lastname']}, ${name['firstname']} ${name['middlename']}.`
      }
    )
  }

  loadTeacherProfile(){
    this.profileIndicator = 'Teacher';
    this.teacherApi.getTeacherPublicProfile(this.userId).subscribe(
      (data:any) => {
        this.userProfile = data.data;
        let name = this.userProfile.name;

        this.userName = `${name['lastname']}, ${name['firstname']} ${name['middlename']}.`
        this.loadTeachingAssignment();
      }
    )
  }

  loadTeacherInfo(){
    this.teacherApi.getTeacherProfile(this.userId).subscribe(
      (data) => {
        this.teacherInfo = data.data;
      }
    )
  }


  loadTeachingAssignment(){
    this.teacherApi.getTeachingAssigment(this.userId).subscribe(
      (data) => {
        this.teachingAssignment = data.data;
        console.log(data);
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
      pdfMake.createPdf(this.docgenerator.generateTeachingAssignment(this.teachingAssignment, this.teacherInfo.profile, extras)).open();
    }
	}

}
