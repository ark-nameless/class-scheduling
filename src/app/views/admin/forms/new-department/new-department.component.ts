import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DepartmentApiService } from 'src/app/apis/department-api.service';
import { TeacherApiService } from 'src/app/apis/teacher-api.service';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

@Component({
  selector: 'app-new-department',
  templateUrl: './new-department.component.html',
  styleUrls: ['./new-department.component.css']
})
export class NewDepartmentComponent implements OnInit {

  form: FormGroup;
  initialValue: FormGroup;
  head_id: FormControl = new FormControl();

  sending = false

  teachers = <any>[]
  loadingTeachers = false;

  constructor(private fb: FormBuilder, 
              private router: Router,
              private event: EventEmitterService,
              private teacherApi: TeacherApiService,
              private departmentApi: DepartmentApiService,
              private snackBar: MatSnackBar
  ) {
    this.initialValue = this.form = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(1)]],
      abbrev: [null, [Validators.required, Validators.minLength(1)]],
      section_id: [null, [Validators.required, Validators.minLength(1)]],
      head_id: [null, [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.loadTeachers();
  }

  loadTeachers(){ 
    this.loadingTeachers = true;
    this.teacherApi.getNoneDeptHeadTeachers().subscribe((data: any) => {
      // data.data.forEach((entry: any) => {
      //   entry.name = entry.name !== null ? entry.name.lastname + ', ' + 
      //                entry.name.firstname + ' ' + entry.name.middlename.toUpperCase()[0] + '.': '';
      //   this.teachers.push(entry)
      // });
      this.teachers = data.data;
      console.log(this.teachers);
      this.loadingTeachers = false;
    })
  }

  onSubmit() {
    this.sending = true;

    let body = { 
                 'name': this.form.value.name , 
                 'abbrev': this.form.value.abbrev,
                 'section_id': this.form.value.section_id,
                 'head_id': this.form.value.head_id
               };
               
    let new_department = this.departmentApi.createNewDepartment(body).subscribe((res: any) => {
        if (res.status_code == 409) {
          let errorSnackbar = this.snackBar.open(res.detail, 'Clear', {duration: 5 * 1000})
          
          errorSnackbar.onAction().subscribe(() => {
            this.form.reset(this.initialValue);
          });
        }
        let success = this.snackBar.open('Successfully Created New Department', 'Clear', {duration: 5 * 1000})
          
        this.event.newEvent({'event': 'added department', 'data': res.data});
        success.onAction().subscribe(() => {
          this.form.reset(this.initialValue);
        });

        this.sending = false;
      }, (err: any) => {
        console.log(err);
        let errorSnackbar = this.snackBar.open(err.error.detail, 'Clear', {duration: 5 * 1000})
        
        errorSnackbar.onAction().subscribe(() => {
          this.form.reset(this.initialValue);
        });
        
        this.sending = false;
    })
  }


}
