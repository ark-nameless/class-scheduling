import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthApiService } from 'src/app/apis/auth-api.service';
import { ClassApiService } from 'src/app/apis/class-api.service';
import { RoomApiService } from 'src/app/apis/room-api.service';
import { TeacherApiService } from 'src/app/apis/teacher-api.service';
import { RoomDialogComponent } from 'src/app/components/room-dialog/room-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { SessionService } from 'src/app/services/session.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-class-schedules',
  templateUrl: './class-schedules.component.html',
  styleUrls: ['./class-schedules.component.css'],
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
    private roomApi: RoomApiService,
    public dialog: MatDialog
  ) {}

  rooms = [];
  roomsDatalist = "";

  ngOnInit(): void {
    this.roomApi.getAllUsedRooms().subscribe(
        (data) => {
            this.rooms = data;
            console.log(this.rooms)
            this.roomsDatalist = `<datalist id="rooms">`
            data.forEach((room: String) => this.roomsDatalist += `<option value="${room}">`)
            this.roomsDatalist += `</datalist>`
            console.log(this.roomsDatalist)
        }
    )
  }


  createNewSchedule() {
    this.router.navigate([`/dept-head/create-new-schedule`]);
  }
  createRequestSubject() {
    this.router.navigate([`/dept-head/create-request-subjects`]);
  }

  async openRoomsDialog() {
    const { value: extras } = await Swal.fire({
      title: 'View Room',
      html: `<p>Room Name: </p>
              <input list="rooms" id="swal-input1" class="swal2-input">
              ${this.roomsDatalist}
            `,
      focusConfirm: false,
      preConfirm: () => {
        return [
          (<HTMLInputElement>document.getElementById('swal-input1'))!.value,
        ];
      },
    });

    if (extras) {
        console.log(extras);
      const dialogRef = this.dialog.open(RoomDialogComponent, {
        data: {
            extras,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        console.log(`Dialog result: ${result}`);
      });
    }
  }
}
