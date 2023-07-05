import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoomApiService } from 'src/app/apis/room-api.service';

@Component({
  selector: 'app-room-dialog',
  templateUrl: './room-dialog.component.html',
  styleUrls: ['./room-dialog.component.css']
})
export class RoomDialogComponent implements OnInit {

  roomSchedule = <any>{};
  isEmpty = true;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private roomApiService: RoomApiService,
  ) {
  }

  ngOnInit(): void {
    this.data = this.data.extras[0];
    console.log(this.data);
    this.getRoomSchedule(this.data);
  }

  getRoomSchedule(name: string) {
    this.roomApiService.getRoomSchedules(name).subscribe((schedules) => {
      console.log(schedules);
      this.roomSchedule = schedules;
      if (schedules == null || schedules === undefined){
        this.roomSchedule = { 'M': [], 'T': [], 'W': [], 'Th': [], 'F': [], 'SAT': [], }
        this.isEmpty = true;
      } else {
        this.isEmpty = false;
      }
    })
  }

}
