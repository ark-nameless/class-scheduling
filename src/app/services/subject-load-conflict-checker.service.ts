import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SubjectLoadConflictCheckerService {

  constructor() { }

  timeToInt(time: string) {
    time = time.toLowerCase();
    let multiply = 0;
    if (time.split(' ')[1] == 'pm'){
      if (parseInt(time.split(':')[0]) == 12){
        multiply = 0;
      } else {
        multiply = 1200;
      }
    }
    if (time.split(' ')[1] == 'am'){
      if (parseInt(time.split(':')[0]) == 12){
        multiply = 12;
      } else {
        multiply = 0;
      }
    }
    // let multiply = time.search('pm') <= -1 ? 0 : 1200;
    let time_striped = time.replace(/\D/g, '');

    return parseInt(time_striped) + multiply;
  }

  checkTimeCollision(t1: any, t2: any) {
    t1.startTime = this.timeToInt(t1.startTime);
    t1.endTime = this.timeToInt(t1.endTime);
    t2.startTime = this.timeToInt(t2.startTime);
    t2.endTime = this.timeToInt(t2.endTime);

    return (
      t1.endTime > t2.startTime &&
      t2.endTime > t1.startTime
    )
  }

  public checkScheduleToSchedules(sched1: any, sched2: any) {
    for (let i = 0; i < sched2.length; i++) {
      for (const day of sched2[i].days) {
        if (sched1.days.indexOf(day) != -1) {
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

  public validScheduleTime(scheduleList: any) {
    const scheduleLen = scheduleList.schedules.length;
    let currentSchedule = scheduleList.schedules[scheduleLen-1];

    if (this.timeToInt(currentSchedule.startTime) >= this.timeToInt(currentSchedule.endTime)){
      return false;
    }
    return true;
  }

  public validScheduleToSchedule(sched1: any, sched2: any) {
    for (let i = 0; i < sched1.length; i++) {
      if (this.checkScheduleToSchedules(sched1[i], sched2) == true) {
        return false;
      }
    }
    return true;
  }


  public validSchedule(sched: any) {
    if (sched.length == 1) return true;
    let first = sched[0];

    for (let i = 1; i < sched.length; i++) {
      for (const day of sched[i].days) {
        if (first.days.indexOf(day) != -1) {
          let t1 = {
            startTime: first.startTime,
            endTime: first.endTime
          };
          let t2 = {
            startTime: sched[i].startTime,
            endTime: sched[i].endTime
          };
          if (this.checkTimeCollision(t1, t2)) return false
        }
      }
    }
    return true;
  }

  public validScheduleToTeachersLoad(sched: any, teacherLoad: any, teacherId='') {
    if (teacherLoad.length > 0) {
      for (let i = 0; i < sched.length; i++){
        for (const sched2 of teacherLoad){
          // if (teacherId != )
          if (teacherId != sched2.id && this.checkScheduleToSchedules(sched[i], sched2.schedules)) {
            return false;
          }
        }
      }
    }
    return true;
  }

  public validSchedules(scheduleList: any){
    let valid = true;
    for (let i = 0; i < scheduleList.length; i++) {
      scheduleList[i].schedules.forEach((sched: any) => {
        scheduleList.forEach((schedule: any, index: number) => {
          if (index != i && scheduleList[i].teacher_id == schedule.teacher_id) {
            valid = this.checkScheduleToSchedules(sched, schedule.schedules);
          }
        });
      });
    }
    return !valid;
  }

}
