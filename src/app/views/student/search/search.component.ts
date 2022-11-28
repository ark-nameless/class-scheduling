import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'jquery';
import { Observable, startWith } from 'rxjs';
import { StudentApiService } from 'src/app/apis/student-api.service';
import { TeacherApiService } from 'src/app/apis/teacher-api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  studentList = <any>[];
  teacherList = <any>[];

  studentSearch = '';
  teacherSearch = '';

  constructor(
    private router: Router,
    private studentApi: StudentApiService,
    private teacherApi: TeacherApiService,
  ) { 

  }

  ngOnInit(): void {
    this.loadStudents();
    this.loadTeachers();
  }

  loadTeachers() {
    this.teacherApi.getAllTeachers().subscribe(
      (data: any) => {
        console.log(data);
        this.teacherList = data.data
      }
    )
  }

  loadStudents() {
    this.studentApi.getStudents().subscribe(
      (data: any) => {
        console.log(data);
        this.studentList = data.data
      }
    )
  }

  searchTeacher() {
    console.log(this.teacherSearch);
    this.router.navigate([`/student/teacher/profile/${this.teacherSearch}`])
  }
  searchStudent() {
    console.log(this.studentSearch);
    this.router.navigate([`/student/student/profile/${this.studentSearch}`])
  }

}
