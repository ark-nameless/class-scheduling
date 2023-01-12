import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthApiService } from 'src/app/apis/auth-api.service';
import { ClassApiService } from 'src/app/apis/class-api.service';
import { TeacherApiService } from 'src/app/apis/teacher-api.service';
import { RoomDialogComponent } from 'src/app/components/room-dialog/room-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
    selector: 'app-class-schedules',
    templateUrl: './class-schedules.component.html',
    styleUrls: ['./class-schedules.component.css']
})
export class ClassSchedulesComponent implements OnInit {

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private session: SessionService,
        private authApi: AuthApiService,
        private teacherApi: TeacherApiService,
        private classApi: ClassApiService,
        private snackbar: MatSnackBar,
        public dialog: MatDialog,
    ) {

    }

    ngOnInit(): void {

    }
    createNewSchedule(){
        this.router.navigate([`/dept-head/create-new-schedule`]);
    }
    createRequestSubject(){
        this.router.navigate([`/dept-head/create-request-subjects`]);
    }

    openRoomsDialog(){
        const dialogRef = this.dialog.open(RoomDialogComponent);

        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }

}
