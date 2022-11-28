import { Component, OnInit } from '@angular/core';
import { StudentApiService } from 'src/app/apis/student-api.service';
import { TeacherApiService } from 'src/app/apis/teacher-api.service';
import { SessionService } from 'src/app/services/session.service';
import { SubjectLoadConflictCheckerService } from 'src/app/services/subject-load-conflict-checker.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  userId = '';

  currentSchedule = <any>[];

  daySchedule = <any>[];


  constructor(
    private teacherApi: TeacherApiService,
    private session: SessionService,
  ) { 
    this.userId = this.session.getUser().id;
  }

  ngOnInit(): void {
    this.loadSchedule();
  }

  loadSchedule(){
    this.teacherApi.getTeacherSchedules(this.userId).subscribe(
      (data: any) => {
        console.log(data.data);
        this.currentSchedule = data.data;

        this.distributeSchedule();
      }
    );
  }

  private compareTime(a: any, b: any){
    return timeToInt(a.startTime) - timeToInt(b.startTime);
  }
  

  private dayInSchedule(day: string){
    let schedules = <any>[];
    this.currentSchedule.forEach((load:any) => {
      load.schedules.forEach((schedule: any) => {
        if (schedule.days.findIndex((d:string) => d === day) > -1){
          schedules.push({
            description: load.description,
            startTime: schedule.startTime, 
            endTime: schedule.endTime, 
            location: schedule.location
          })
        }
      })
    });
    return schedules;
  }

  distributeSchedule(){
    ['M','T','W','Th','F','S'].forEach( (day_schedule:any) => {
      this.daySchedule.push({
        day: day_schedule,
        schedules: this.dayInSchedule(day_schedule).sort(this.compareTime)
      });
    })
  }
  

}




function timeToInt(time: string) {
  time = time.toLowerCase()
  let multiply = time.search('pm') <= -1 ? 0 : 1200;
  let time_striped = time.replace(/\D/g, '');

  return parseInt(time_striped) + multiply;
}