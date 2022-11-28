import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthApiService } from 'src/app/apis/auth-api.service';
import { ClassApiService } from 'src/app/apis/class-api.service';
import { DepartmentApiService } from 'src/app/apis/department-api.service';
import { TeacherApiService } from 'src/app/apis/teacher-api.service';
import { SessionService } from 'src/app/services/session.service';
import { SubjectLoadConflictCheckerService } from 'src/app/services/subject-load-conflict-checker.service';

@Component({
  selector: 'app-create-request-subjects',
  templateUrl: './create-request-subjects.component.html',
  styleUrls: ['./create-request-subjects.component.css']
})
export class CreateRequestSubjectsComponent implements OnInit {

  schedule = this.getEmptySchedule();

  scheduleList = <any>[];

  selectedLoad: number = -1;

  departmentTeachers = <any>[];
  loadingTeachers = false;
  selectedTeacherId = '';

  isValidSchedule = false;
  selectedTeacherSchedule = <any>[];

  selectedDepartment = '';
  loadingDepartments = false;
  allDepartments = <any>[];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private session: SessionService,
    private authApi: AuthApiService,
    private teacherApi: TeacherApiService,
    private conflictChecker: SubjectLoadConflictCheckerService,
    private classApi: ClassApiService,
    private departmentApi: DepartmentApiService,
    private snackbar: MatSnackBar,
    public dialog: MatDialog,
  ) {
    if (window.sessionStorage.getItem('dept-id') == null) {
      this.authApi.getDepartmentId(session.getUser().id).subscribe(data => {
        window.sessionStorage.setItem('dept-id', data.data);
      })
    }
  }

  ngOnInit(): void {
    this.loadTeachers();
    this.loadDepartments();
  }

  private getDeptId() { return window.sessionStorage.getItem('dept-id') || ''; }

  loadTeachers() {
    this.loadingTeachers = true;
    this.teacherApi.getTeacherPerDepartment(this.getDeptId()).subscribe((data: any) => {
      data.data.forEach((entry: any) => {
        entry.name = entry.name !== null ? entry.name.lastname + ', ' +
          entry.name.firstname + ' ' + entry.name.middlename.toUpperCase()[0] + '.' : '';
        this.departmentTeachers.push(entry)
      });
      this.loadingTeachers = false;
    })
  }

  loadDepartments() {
    this.loadingDepartments = true;
    this.departmentApi.getDepartments().subscribe( (data:any) => {
      this.allDepartments = data.data;
      this.loadingDepartments = false;
    })
  }


  private getEmptySchedule() {
    return {
      section_id: '',
      subject_id: '',
      description: '',
      units: 0,
      hours: 0,
      teacher_id: '',
      schedules: [{
        days: '',
        startTime: '',
        endTime: '',
        location: ''
      }]
    };
  }

  emptySubjectLoad() {
    const length = this.scheduleList[this.selectedLoad].schedules.length - 1;
    return this.scheduleList[this.selectedLoad].schedules[length].days.length <= 0 ||
      this.scheduleList[this.selectedLoad].schedules[length].startTime == '' ||
      this.scheduleList[this.selectedLoad].schedules[length].endTime == '';
  }

  private emptySchedule() {
    return this.schedule.section_id == '' ||
      this.schedule.subject_id == '' ||
      this.schedule.description == '' ||
      this.schedule.units == 0 ||
      this.schedule.hours == 0;
  }

  removeSchedule(index: number) {
    this.scheduleList.splice(index, 1);
  }
  clearSchedule() {
    this.schedule = this.getEmptySchedule();
  }
  addSchedule() {
    console.log(this.session.getUser())
    if (this.emptySchedule()) {
      this.snackbar.open('Please fill in all the fields before adding', 'Close', { duration: 3 * 1000 });
      return
    }
    this.scheduleList.push(this.schedule)
    this.schedule = this.getEmptySchedule();
    this.isValidSchedule = false;

  }



  selectedTeacher() {
    const teacherId = this.scheduleList[this.selectedLoad].teacher_id;
    if (teacherId != '') {
      this.teacherApi.getTeacherSchedule(teacherId).subscribe((data: any) => {
        this.selectedTeacherSchedule = data.data;
      }, err => {

      })
    }
  }
  
  addSubjectSchedule() {
    if (this.emptySubjectLoad()) {
      this.snackbar.open('Please fill in all the fields before adding', 'Close', { duration: 3 * 1000 });
      return
    }
    this.scheduleList[this.selectedLoad].schedules.push({
      days: '',
      startTime: '',
      endTime: '',
      location: ''
    });
    this.isValidSchedule = false;
  }
  removeSubjectSchedule(index: number) {
    if (this.scheduleList[this.selectedLoad].schedules.length > 1){
      this.scheduleList[this.selectedLoad].schedules.splice(index, 1);
    }
  }

  sendSchedule(){
    let data = {
      to_department: this.selectedDepartment,
      schedules: this.scheduleList
    };
    this.classApi.createNewResponseSchedule(data).subscribe( (data: any) => {
      console.log(data);
      if (data['status'] == 200){
        // this.dialog.open(SuccessDialog, { width: '250px' })
        this.snackbar.open(data.detail, 'Close', { duration: 3 * 1000})
      }
    })
  }

  validateSchedule(){
    const errorMessageDuration = 2;
    this.isValidSchedule = false;
    let currentSchedule = this.scheduleList[this.selectedLoad];


    if (this.emptySubjectLoad()) {
      this.snackbar.open('Please add schedule before trying to validate it.', 'Close', { duration: errorMessageDuration * 1000 });
      return
    }
    else if (!this.conflictChecker.validScheduleTime(currentSchedule)){
      this.snackbar.open('Please ensure that start time is lower than the end time.', 'Close', { duration: errorMessageDuration * 1000 });
      return
    }
    else if (!this.conflictChecker.validSchedule(this.scheduleList[this.selectedLoad].schedules)){
      this.snackbar.open('Invalid Schedule, Please check this loads schedule', 'Close', { duration: errorMessageDuration * 1000 });
    }
    else if (!this.conflictChecker.validScheduleToTeachersLoad(currentSchedule.schedules, this.selectedTeacherSchedule)){
      this.snackbar.open('Invalid Schedule, there is a conflict in the teacher\s current subject load.', 'Close', { duration: errorMessageDuration * 1000 });
    }
    else {
      let validLoad = true;
      for (let i = 0; i < this.scheduleList.length; i++) {
        this.scheduleList[i].schedules.forEach((sched: any) => {
          this.scheduleList.forEach((schedule: any, index: number) => {
            // check only if not the same schedule and same teacher's schedule
            if (index != i && this.scheduleList[i].teacher_id == schedule.teacher_id) {
              validLoad = !this.conflictChecker.checkScheduleToSchedules(sched, schedule.schedules);
              console.log(`${this.scheduleList[i].teacher_id} == ${schedule.teacher_id}: ${validLoad}`)
            }
          });
        });
      }
      if (validLoad == true){
        this.snackbar.open('Congrats! It\'s a valid schedule.', 'Close', { duration: errorMessageDuration * 1000 });
        this.isValidSchedule = true;
      } else {
        this.snackbar.open('There is collision in your schedule. Please check subject loads.', 'Close', { duration: errorMessageDuration * 1000 });
      }
    }

  }

}


@Component({
  selector: `dialog-success`,
  template: `
    <h1 mat-dialog-title>Delete file</h1>
    <div mat-dialog-content>
      Would you like to delete cat.jpeg?
    </div>
    <div mat-dialog-actions>
      <button mat-button mat-dialog-close>No</button>
      <button mat-button mat-dialog-close cdkFocusInitial>Ok</button>
    </div>
  `,
})
export class SuccessDialog{
  constructor(public dialogRef: MatDialogRef<SuccessDialog>) {}
}