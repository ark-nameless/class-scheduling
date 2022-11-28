import {Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ClassApiService } from 'src/app/apis/class-api.service';
import { DepartmentApiService } from 'src/app/apis/department-api.service';



@Component({
  selector: 'app-request-class-schedule',
  templateUrl: './request-class-schedule.component.html',
  styleUrls: ['./request-class-schedule.component.css']
})
export class RequestClassScheduleComponent implements OnInit {

  snackbarDuration = 3;


  subjectList = <any>[];

  inputSubject = '';
  requestNote = '';

  allDepartments = <any>[];
  loadingDepartments = false;
  selectedDepartment = null;

  deptId = '';


  constructor(
    private departmentApi: DepartmentApiService,
    private classApi: ClassApiService,
    private snackbar: MatSnackBar,
    private router: Router,
  ) {
    this.deptId = this.getDeptId();
  }

  ngOnInit(): void {
      this.loadDepartments();
  }

  private getDeptId() { return window.sessionStorage.getItem('dept-id') || ''; }


  loadDepartments() {
    this.loadingDepartments = true;
    this.departmentApi.getDepartments().subscribe( (data:any) => {
      this.allDepartments = data.data;
      this.loadingDepartments = false;
    })
  }

  saveSubject(){
    if (this.inputSubject != ''){
      this.subjectList.push(this.inputSubject);
    }
    this.inputSubject = '';
  }

  removeSubject(index: any) {
    this.subjectList.splice(index, 1);
  }

  sendSchedule(){
    if (this.requestNote == '' || this.selectedDepartment == null || this.subjectList.length < 1) {
      this.snackbar.open('Please fill up all the information before sending', 'Close', { duration: this.snackbarDuration * 1000 } )
      return
    }
    let payload = {
      'description': this.requestNote,
      'to': this.selectedDepartment,
      'from': this.getDeptId(),
      'subjects': this.subjectList,
    }
    
    this.classApi.sendNewScheduleRequest(payload).subscribe(
      (data: any) => {
        let result = this.snackbar.open(data.detail, 'Close', { duration: this.snackbarDuration * 1000 })

        result.onAction().subscribe(() => this.router.navigate(['/dept-head/class-schedules']));
        result.afterDismissed().subscribe(() => this.router.navigate(['/dept-head/class-schedules']));
      }
    )
  }
}
