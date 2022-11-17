import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthApiService } from 'src/app/apis/auth-api.service';
import { ClassApiService } from 'src/app/apis/class-api.service';
import { TeacherApiService } from 'src/app/apis/teacher-api.service';
import { AuthService } from 'src/app/services/auth.service';
import { SessionService } from 'src/app/services/session.service';


// export interface ActiveSchedule {
//     section_id: string;
//     subject_id: string;
//     description: string;
//     units: number
//     hours: number
//     room: string;
//     teacher_id: string;
//     schedule: [{
//         days: string,
//         startTime: string,
//         endTime: string,
//         location: string
//     }]
// }


// export interface SubjectSchedule {
//     section_id: string;
//     subject_id: string;
//     description: string;
//     units: number;
//     hours: number;
//     room: string;
//     teacher_id: string;
// }

@Component({
    selector: 'app-class-schedules',
    templateUrl: './class-schedules.component.html',
    styleUrls: ['./class-schedules.component.css']
})
export class ClassSchedulesComponent implements OnInit {

    schedule = {
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

    scheduleList = <any>[];

    selectedLoad: number = -1;

    departmentTeachers = <any>[];
    loadingTeachers = false;
    selectedTeacherId = '';

    isValidSchedule = false;

    subjectSchedule = [
        {
            days: '',
            startTime: '',
            endTime: '',
            location: ''
        }
    ]

    selectedTeacherSchedule = <any>[];

    classForm: FormGroup;
    initialClassForm: FormGroup;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private session: SessionService,
        private authApi: AuthApiService,
        private teacherApi: TeacherApiService,
        private classApi: ClassApiService,
        private snackbar: MatSnackBar,
    ) {
        this.initialClassForm = this.classForm = this.fb.group({
            major: [null, ],
            semester: [null, [Validators.required]],
            startYear: [null, [Validators.required]],
            endYear: [null, [Validators.required]],
        })

        if (window.sessionStorage.getItem('dept-id') == null) {
            console.log('getting department id...')
            this.authApi.getDepartmentId(session.getUser().id).subscribe(data => {
                window.sessionStorage.setItem('dept-id', data.data);
            })
        }
    }

    private getDeptId() { return window.sessionStorage.getItem('dept-id') || ''; }


    ngOnInit(): void {
        this.loadTeachers();
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

    private emptySchedule() {
        return this.schedule.section_id == '' ||
            this.schedule.subject_id == '' ||
            this.schedule.description == '' ||
            this.schedule.units == 0 ||
            this.schedule.hours == 0 ;
    }

    emptySubjectLoad() {
        const length = this.scheduleList[this.selectedLoad].schedules.length - 1;
        return this.scheduleList[this.selectedLoad].schedules[length].days.length <= 0 ||
            this.scheduleList[this.selectedLoad].schedules[length].startTime == '' ||
            this.scheduleList[this.selectedLoad].schedules[length].endTime == '';
    }

    private timeToInt(time: string) {
        time = time.toLowerCase()
        let multiply = time.search('pm') <= -1 ? 0 : 1200;
        let time_striped = time.replace(/\D/g, '');

        return parseInt(time_striped) + multiply;
    }

    private checkTimeCollision(t1: any, t2: any) {
        t1.startTime = this.timeToInt(t1.startTime);
        t1.endTime = this.timeToInt(t1.endTime);
        t2.startTime = this.timeToInt(t2.startTime);
        t2.endTime = this.timeToInt(t2.endTime);

        return (
            t1.endTime > t2.startTime &&
            t2.endTime > t1.startTime
        )
    }

    private checkSchedule(sched1: any, sched2: any) {
        console.log(sched2)
        let days = sched1.days.join('')

        for (let i = 0; i < sched2.length; i++) {
            for (const day of sched2[i].days) {
                // similar day; perform check
                if (days.search(day) != -1) {
                    let t1 = {
                        startTime: sched1.startTime,
                        endTime: sched1.endTime
                    };
                    let t2 = {
                        startTime: sched2[i].startTime,
                        endTime: sched2[i].endTime
                    };
                    if (this.checkTimeCollision(t1, t2)) return true
                }
            }
        }
        return false
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
        this.scheduleList[this.selectedLoad].schedules.splice(index, 1);
    }



    removeSchedule(index: number) {
        this.scheduleList.splice(index, 1);
    }
    clearSchedule() {
        this.schedule = {
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
            }],
        };
    }
    addSchedule() {
        console.log(this.session.getUser())
        if (this.emptySchedule()) {
            this.snackbar.open('Please fill in all the fields before adding', 'Close', { duration: 3 * 1000 });
            return
        }
        this.scheduleList.push(this.schedule)
        this.schedule = {
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
        this.isValidSchedule = false;

    }

    selectedTeacher() {
        // this.selectedTeacherName = 
        const teacherId = this.scheduleList[this.selectedLoad].teacher_id;
        if (teacherId != ''){
            this.teacherApi.getTeacherSchedule(teacherId).subscribe((data: any) => {
                this.selectedTeacherSchedule = data.data;
            }, err => {

            })
        }
    }

    private validSelectedLoad() {
        const scheduleLen = this.scheduleList[this.selectedLoad].schedules.length;
        for (let i = 0, advance = i + 1; advance < scheduleLen; i++, advance++) {
            let scheduleDay = this.scheduleList[this.selectedLoad].schedules[advance].days.join('');
            let found = this.scheduleList[this.selectedLoad].schedules[i].days.forEach((day: any) => {
                console.log(day)
                let searched = scheduleDay.search(day)
                if (searched != -1) {
                    let i_time = this.scheduleList[this.selectedLoad].schedules[i];
                    let advance_time = this.scheduleList[this.selectedLoad].schedules[advance];

                    let t1 = { startTime: i_time.startTime, endTime: i_time.endTime };
                    let t2 = { startTime: advance_time.startTime, endTime: advance_time.endTime };
                    if (this.checkTimeCollision(t1, t2)) {
                        this.snackbar.open('There is collision in your schedule. Please check the time.', 'Close', { duration: 1 * 1000 });
                        return
                    }
                }
            });
        }
    }

    validateSchedule() {
        this.isValidSchedule = false;
        if (this.emptySubjectLoad()) {
            this.snackbar.open('Please add schedule before trying to validate it.', 'Close', { duration: 1 * 1000 });
            return
        }
        this.validSelectedLoad();
        let selected_index = 0;
        for (let i = 0; i < this.scheduleList.length; i++) {
            this.scheduleList[i].schedules.forEach((sched: any) => {
                this.scheduleList.forEach((schedule: any, index: number) => {
                    // check only if not the same schedule and same teacher's schedule
                    if (index != i && this.scheduleList[i].teacher_id == schedule.teacher_id) {
                        let res = this.checkSchedule(sched, schedule.schedules);
                        console.log(`${this.scheduleList[i].teacher_id} == ${schedule.teacher_id}`)
                        if (res){
                            this.snackbar.open('There is collision in your schedule. Please check the time.', 'Close', { duration: 1 * 1000 });
                            return 
                        }
                    }
                });
            });
        }
        // checking for saved subject load
        if (this.selectedTeacherSchedule.length > 0){
            this.scheduleList[this.selectedLoad].schedules.forEach((data: any) => {
                this.selectedTeacherSchedule.forEach((sched2: any) => {
                    if (this.checkSchedule(data, sched2.schedules)){
                        this.snackbar.open('There is collision in your schedule. Please check the time.', 'Close', { duration: 1 * 1000 });
                        return 
                    }
                })
            })
        }
        this.isValidSchedule = true;
    }


    publishClassSchedule() {
        console.log('publishing class schedule...')
        let class_schedule = {
            department_id: window.sessionStorage.getItem('dept-id'),
            major: this.classForm.value.major,
            semester: this.classForm.value.semester,
            year: {
                start: this.classForm.value.startYear,
                end: this.classForm.value.endYear
            },
            subject_loads: this.scheduleList
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
}
