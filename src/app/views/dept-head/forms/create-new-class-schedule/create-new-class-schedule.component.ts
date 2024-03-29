import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthApiService } from 'src/app/apis/auth-api.service';
import { ClassApiService } from 'src/app/apis/class-api.service';
import { DepartmentApiService } from 'src/app/apis/department-api.service';
import { TeacherApiService } from 'src/app/apis/teacher-api.service';
import { RoomDialogComponent } from 'src/app/components/room-dialog/room-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { SessionService } from 'src/app/services/session.service';
import { SubjectLoadConflictCheckerService } from 'src/app/services/subject-load-conflict-checker.service';






@Component({
  selector: 'app-create-new-class-schedule',
  templateUrl: './create-new-class-schedule.component.html',
  styleUrls: ['./create-new-class-schedule.component.css']
})
export class CreateNewClassScheduleComponent implements OnInit {

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

  all_loads = <any>[];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private session: SessionService,
    private conflictChecker: SubjectLoadConflictCheckerService,
    private authApi: AuthApiService,
    private teacherApi: TeacherApiService,
    private departmentApi: DepartmentApiService,
    private classApi: ClassApiService,
    private snackbar: MatSnackBar,
    public dialog: MatDialog,
  ) {
    this.initialClassForm = this.classForm = this.fb.group({
      name: [null, [Validators.required]],
      major: [null,],
      semester: [null, [Validators.required]],
      startYear: [null, [Validators.required]],
      endYear: [null, [Validators.required]],
    })

    if (window.sessionStorage.getItem('dept-id') == null) {
      this.authApi.getDepartmentId(session.getUser().id).subscribe(data => {
        window.sessionStorage.setItem('dept-id', data.data);
      })
    }
  }

  private getDeptId() { return window.sessionStorage.getItem('dept-id') || ''; }


  ngOnInit(): void {
    this.loadAllLoads();
    this.loadTeachers();
    this.loadResponseSchedules();
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

  loadAllLoads(){ 
    this.classApi.getAllSubjectLoads().subscribe((data:any) => this.all_loads = data.data);
  }

  loadResponseSchedules(){
    this.departmentApi.getSubjectResponses(this.getDeptId()).subscribe( 
      (data: any) => {
        console.log(data);
        this.selectedRequesSchedules = data.data;
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

  // private timeToInt(time: string) {
  //   time = time.toLowerCase()
  //   let multiply = time.search('pm') <= -1 ? 0 : 1200;
  //   let time_striped = time.replace(/\D/g, '');

  //   return parseInt(time_striped) + multiply;
  // }

  // private checkTimeCollision(t1: any, t2: any) {
  //   t1.startTime = this.timeToInt(t1.startTime);
  //   t1.endTime = this.timeToInt(t1.endTime);
  //   t2.startTime = this.timeToInt(t2.startTime);
  //   t2.endTime = this.timeToInt(t2.endTime);

  //   return (
  //     t1.endTime > t2.startTime &&
  //     t2.endTime > t1.startTime
  //   )
  // }

  // private checkSchedule(sched1: any, sched2: any) {
  //   console.log(sched2)
  //   let days = sched1.days.join('')

  //   for (let i = 0; i < sched2.length; i++) {
  //     for (const day of sched2[i].days) {
  //       // similar day; perform check
  //       if (days.search(day) != -1) {
  //         let t1 = {
  //           startTime: sched1.startTime,
  //           endTime: sched1.endTime
  //         };
  //         let t2 = {
  //           startTime: sched2[i].startTime,
  //           endTime: sched2[i].endTime
  //         };
  //         if (this.checkTimeCollision(t1, t2)) return true
  //       }
  //     }
  //   }
  //   return false
  // }

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



  removeSchedule(index: number) {
    this.scheduleList.splice(index, 1);
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

  async validateSchedule(){
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
    let res = this.conflictChecker.validScheduleToTeachersLoad(currentSchedule.schedules, this.selectedTeacherSchedule);
    if (res === false){
      this.snackbar.open('Invalid Schedule, there is a conflict in the teacher\s current subject load.', 'Close', { duration: errorMessageDuration * 1000 });
    } else if (res === -1) {
      this.snackbar.open('Invalid Schedule, The room is already in use.', 'Close', { duration: errorMessageDuration * 1000 });
    }
    else if (await this.conflictChecker.validRoomAssignmentToAllLoads(currentSchedule.schedules, this.all_loads) === false){
      this.snackbar.open('Invalid Schedule, The room is already in use.', 'Close', { duration: errorMessageDuration * 1000 });
    }
    else {
      let validLoad = true;
      let conflictRoom = false;
      let j = 0;
      for (let i = 0; i < this.scheduleList.length; i++) {
        this.scheduleList[i].schedules.every((sched: any) => {
          this.scheduleList.every((schedule: any, index: number) => {
            // check only if not the same schedule and same teacher's schedule
            if (index != i && this.scheduleList[i].teacher_id == schedule.teacher_id) {
              validLoad = !this.conflictChecker.checkScheduleToSchedules(sched, schedule.schedules);
            } 
            // check room if not the same schedule
            if (index != i){
              conflictRoom = !this.conflictChecker.validRoomAssignment(sched, schedule.schedules);
              if (conflictRoom){
                return false;
              }
            }
            return true;
          });
        });
      }
      if (conflictRoom){
        this.snackbar.open('Invalid Schedule, The room is already in use.', 'Close', { duration: errorMessageDuration * 1000 });
      } else if (validLoad == true){
        this.snackbar.open('Congrats! It\'s a valid schedule.', 'Close', { duration: errorMessageDuration * 1000 });
        this.isValidSchedule = true;
      }
      else {
        this.snackbar.open('There is collision in your schedule. Please check subject loads.', 'Close', { duration: errorMessageDuration * 1000 });
      }
    }
  }


  publishClassSchedule() {
    let class_schedule = {
      department_id: window.sessionStorage.getItem('dept-id'),
      major: this.classForm.value.major,
      name: this.classForm.value.name,
      semester: this.classForm.value.semester,
      year: {
        start: this.classForm.value.startYear,
        end: this.classForm.value.endYear
      },
      subject_loads: this.scheduleList,
      response_loads: Array.from(this.selectedSchedules)
    }

    this.classApi.createNewClassSchedule(class_schedule).subscribe((data: any) => {
      this.classForm = this.initialClassForm;
      let res = this.snackbar.open('Class Schedule Successfully Published', 'Close', { duration: 3 * 1000 });

      res.onAction().subscribe(() => {
        this.router.navigate(['dept-head/dashboard'])
      })
    }, err => {

    })
  }

  openRoomsDialog(location: string){
    const dialogRef = this.dialog.open(RoomDialogComponent, {data: location});

    dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
    });
  }

}
