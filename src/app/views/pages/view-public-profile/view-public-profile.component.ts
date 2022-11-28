import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentApiService } from 'src/app/apis/student-api.service';
import { TeacherApiService } from 'src/app/apis/teacher-api.service';

@Component({
  selector: 'app-view-public-profile',
  templateUrl: './view-public-profile.component.html',
  styleUrls: ['./view-public-profile.component.css']
})
export class ViewPublicProfileComponent implements OnInit {
  userId = '';
  userRole = '';

  userProfile = <any>{};
  userName = ''

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentApi: StudentApiService,
    private teacherApi: TeacherApiService,

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
  }

  ngOnInit(): void {
  }

  loadStudentProfile(){
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
    this.teacherApi.getTeacherPublicProfile(this.userId).subscribe(
      (data:any) => {
        this.userProfile = data.data;
        let name = this.userProfile.name;

        this.userName = `${name['lastname']}, ${name['firstname']} ${name['middlename']}.`
      }
    )
  }

}
