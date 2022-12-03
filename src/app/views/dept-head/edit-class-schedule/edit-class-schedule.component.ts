import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthApiService } from 'src/app/apis/auth-api.service';
import { ClassApiService } from 'src/app/apis/class-api.service';
import { DepartmentApiService } from 'src/app/apis/department-api.service';
import { TeacherApiService } from 'src/app/apis/teacher-api.service';
import { AuthService } from 'src/app/services/auth.service';
import { SessionService } from 'src/app/services/session.service';
import { SubjectLoadConflictCheckerService } from 'src/app/services/subject-load-conflict-checker.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-edit-class-schedule',
  templateUrl: './edit-class-schedule.component.html',
  styleUrls: ['./edit-class-schedule.component.css']
})
export class EditClassScheduleComponent implements OnInit {

  classId = '';
  schedule = this.getEmptySchedule();

  scheduleList = <any>[];

  selectedLoad: number = -1;

  departmentTeachers = <any>[];
  loadingTeachers = false;
  selectedTeacherId = '';

  isValidSchedule = false;
  selectedTeacherSchedule = <any>[];

  classForm: FormGroup;
  initialClassForm: FormGroup;

  selectedRequesSchedules = <any>[];
  selectedSchedules = new Set<any>();
  selectedSchedulesList = <any>[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private session: SessionService,
    private conflictChecker: SubjectLoadConflictCheckerService,
    private authApi: AuthApiService,
    private teacherApi: TeacherApiService,
    private departmentApi: DepartmentApiService,
    private classApi: ClassApiService,
    private snackbar: MatSnackBar,
  ) {
    this.initialClassForm = this.classForm = this.fb.group({
      name: [null, [Validators.required]],
      major: [null,],
      semester: [null, [Validators.required]],
      startYear: [null, [Validators.required]],
      endYear: [null, [Validators.required]],
    })

    this.route.params.subscribe((params) => (this.classId = params['id']));
  }

  private getDeptId() { return window.sessionStorage.getItem('dept-id') || ''; }


  ngOnInit(): void {
    this.loadTeachers();
    this.loadResponseSchedules();
    this.loadClassLoad();
  }

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

  loadResponseSchedules(){
    this.departmentApi.getSubjectResponses(this.getDeptId()).subscribe( 
      (data: any) => {
        console.log(data);
        this.selectedRequesSchedules = data.data;
      }
    )
  }

  loadClassLoad(){
    this.classApi.getClassLoads(this.classId).subscribe(
      (data) => {
        this.scheduleList = data.data;
      }
    )
  }

  private emptySchedule() {
    return this.schedule.section_id == '' ||
      this.schedule.subject_id == '' ||
      this.schedule.description == '' ||
      this.schedule.units == 0 ||
      this.schedule.hours == 0;
  }

  private getEmptySchedule() {
    return {
      id: '',
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

  public selectRequestSchedule(data: any) {
		if (this.selectedSchedules.has(data)) {
			this.selectedSchedules.delete(data);
		} else {
			this.selectedSchedules.add(data);
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


  removeSchedule(index: number, id = '') {
    if (id !== ''){
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'You are about to delete an active schedule',
        footer: 'Are you sure you want to delete ?',
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false,
        showDenyButton: true,
        showCancelButton: true,
        denyButtonText: `Delete`,
      }).then((result) => {
        if (result.isDenied){
          Swal.fire('delete')
          // this.scheduleList.splice(index, 1);
        }
      })
    } else {
      this.scheduleList.splice(index, 1);
    }
  }
  clearSchedule() {
    this.schedule = this.getEmptySchedule();
  }
  addSchedule() {
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

  updateSchedule() {
    let currentSchedule = this.scheduleList[this.selectedLoad];

    let update_data = {
      description: currentSchedule.description,
      units: currentSchedule.units,
      hours: currentSchedule.hours,
      section_id: currentSchedule.section_id,
      subject_id: currentSchedule.subject_id,
      schedules: currentSchedule.schedules,
      teacher_id: currentSchedule.teacher_id,
    }

    this.classApi.updateSchedule(currentSchedule.id, update_data).subscribe(
      (data: any) => {
        this.snackbar.open(data.detail, 'Close', { duration: 2 * 1000 });
      }, err => {
        this.snackbar.open(err.error.detail, 'Close', { duration: 2 * 1000 });
      }
    )
  }

  updateSubjectLoadInfo(index: number){
    let currentSchedule = this.scheduleList[index];

    if (currentSchedule.hours <= 0 || currentSchedule.units <= 0 ||
        currentSchedule.description == '' || currentSchedule.section_id == '' || 
        currentSchedule.subject_id == ''){
          this.snackbar.open('Please Fill up all the Fields before updating!', 'Close', { duration: 2 * 1000});
          return;
    }

    let update_info = {
      description: currentSchedule.description,
      hours: currentSchedule.hours,
      units: currentSchedule.units,
      section_id: currentSchedule.section_id,
      subject_id: currentSchedule.subject_id,
    }

    this.classApi.updateSubjectInfo(currentSchedule.id, update_info).subscribe(
      (data: any) => {
        this.snackbar.open(data.detail, 'Close', { duration: 2 * 1000 });
      }, err => {
        this.snackbar.open(err.error.detail, 'Close', { duration: 2 * 1000 });
      }
    )
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
    else if (!this.conflictChecker.validScheduleToTeachersLoad(currentSchedule.schedules, this.selectedTeacherSchedule, currentSchedule.id)){
      this.snackbar.open('Invalid Schedule, there is a conflict in the teacher\'s current subject load.', 'Close', { duration: errorMessageDuration * 1000 });
    }
    else {
      let validLoad = true;
      for (let i = 0; i < this.scheduleList.length; i++) {
        this.scheduleList[i].schedules.forEach((sched: any) => {
          this.scheduleList.forEach((schedule: any, index: number) => {
            // check only if not the same schedule and same teacher's schedule
            if (index != i && this.scheduleList[i].teacher_id == schedule.teacher_id) {
              validLoad = !this.conflictChecker.checkScheduleToSchedules(sched, schedule.schedules);
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
