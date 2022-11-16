import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthApiService } from 'src/app/apis/auth-api.service';
import { TeacherApiService } from 'src/app/apis/teacher-api.service';
import { AuthService } from 'src/app/services/auth.service';
import { SessionService } from 'src/app/services/session.service';


export interface ActiveSchedule {
    sectionCode: string;
    subjectCode: string;
    subjectDescription: string;
    units: number
    hours: number
    room: string;
    teacherId: string;
    schedule: [{
        days: string,
        startTime: string,
        endTime: string,
        location: string
    }]
}


export interface SubjectSchedule {
    sectionCode: string;
    subjectCode: string;
    subjectDescription: string;
    units: number;
    hours: number;
    room: string;
    teacherId: string;
}

@Component({
    selector: 'app-class-schedules',
    templateUrl: './class-schedules.component.html',
    styleUrls: ['./class-schedules.component.css']
})
export class ClassSchedulesComponent implements OnInit {

    schedule = {
        sectionCode: '',
        subjectCode: '',
        subjectDescription: '',
        units: 0,
        hours: 0,
        room: '',
        teacherId: '',
        schedule: [{
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

    daySelector = ''
    startTime = '';
    endTime = '';

    days = <any>[];
    times = '';

    subjectSchedule = [
        {
            days: '',
            startTime: '',
            endTime: '',
            location: ''
        }
    ]

    selectedTeacherSchedule = <any>[];

    constructor(
        private fb: FormBuilder,
        private session: SessionService,
        private authApi: AuthApiService,
        private teacherApi: TeacherApiService,
        private snackbar: MatSnackBar,
    ) {
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
            // this.departmentTeachers = data.data;
            this.loadingTeachers = false;
        })
    }

    private emptySchedule() {
        return this.schedule.sectionCode == '' ||
            this.schedule.subjectCode == '' ||
            this.schedule.subjectDescription == '' ||
            this.schedule.units == 0 ||
            this.schedule.hours == 0 ||
            this.schedule.room == '';
    }

    private emptySubjectLoad() {
        const length = this.scheduleList[this.selectedLoad].schedule.length - 1;
        return this.scheduleList[this.selectedLoad].schedule[length].days.length <= 0 ||
            this.scheduleList[this.selectedLoad].schedule[length].startTime == '' ||
            this.scheduleList[this.selectedLoad].schedule[length].endTime == '';
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



    addSubjectSchedule() {
        if (this.emptySubjectLoad()) {
            this.snackbar.open('Please fill in all the fields before adding', 'Close', { duration: 3 * 1000 });
            return
        }
        this.scheduleList[this.selectedLoad].schedule.push({
            days: '',
            startTime: '',
            endTime: '',
            location: ''
        });
    }
    removeSubjectSchedule(index: number) {
        this.scheduleList[this.selectedLoad].schedule.splice(index, 1);
    }



    removeSchedule(index: number) {
        this.scheduleList.splice(index, 1);
    }
    clearSchedule() {
        this.schedule = {
            sectionCode: '',
            subjectCode: '',
            subjectDescription: '',
            units: 0,
            hours: 0,
            room: '',
            teacherId: '',
            schedule: [{
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
            sectionCode: '',
            subjectCode: '',
            subjectDescription: '',
            units: 0,
            hours: 0,
            room: '',
            teacherId: '',
            schedule: [{
                days: '',
                startTime: '',
                endTime: '',
                location: ''
            }]
        };

    }

    selectedTeacher() {
        const teacherId = this.scheduleList[this.selectedLoad].teacherId;
        this.teacherApi.getTeacherSchedule(teacherId).subscribe((data: any) => {
            this.selectedTeacherSchedule = data.data;
        })
    }

    private validaSelectedLoad() {
        const scheduleLen = this.scheduleList[this.selectedLoad].schedule.length;
        const baseSchedule = this.scheduleList[this.selectedLoad].schedule[0];

        for (let i = 0, advance = i + 1; advance < scheduleLen; i++, advance++) {
            let scheduleDay = this.scheduleList[this.selectedLoad].schedule[advance].days.join('');
            let found = baseSchedule.days.forEach((day: any) => {
                let searched = scheduleDay.search(day)
                if (searched != -1) {

                }
            });
        }
    }

    private checkFilledUpSchedule() {
    }

    validateSchedule() {
        if (this.emptySubjectLoad()) {
            this.snackbar.open('Please add schedule before trying to validate it.', 'Close', { duration: 1 * 1000 });
            return
        }

        this.validaSelectedLoad();
    }
}
