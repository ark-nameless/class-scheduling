import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DepartmentApiService } from 'src/app/apis/department-api.service';
import { TeacherApiService } from 'src/app/apis/teacher-api.service';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

@Component({
  selector: 'app-new-teacher',
  templateUrl: './new-teacher.component.html',
  styleUrls: ['./new-teacher.component.css']
})
export class NewTeacherComponent implements OnInit {

  form: FormGroup;
  initialValue: FormGroup;

  sending = false

  departments = <any>[]
  loadingDepartments = false;

  constructor(private fb: FormBuilder, 
              private router: Router,
              private departmentApi: DepartmentApiService,
              private teacherApi: TeacherApiService,
              private event: EventEmitterService,
              private snackBar: MatSnackBar
    ) {
    this.initialValue = this.form = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      department: [null, [Validators.required]],
    })

    
  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  private loadDepartments(){
    this.loadingDepartments = true;
    this.departmentApi.getDepartments().subscribe((data: any) => {
      this.departments = data.data;
      this.loadingDepartments = false;
    })
  }

  onSubmit() {
    this.sending = true;

    let body = { 'email': this.form.value.email , 'department_id': this.form.value.department }
    this.teacherApi.registerUnverifiedTeacher(body).subscribe((res: any) => {
        if (res.status_code == 409) {
          let errorSnackbar = this.snackBar.open(res.detail, 'Clear', {duration: 5 * 1000})
          
          errorSnackbar.onAction().subscribe(() => {
            this.form.reset(this.initialValue);
          });
        }
        let success = this.snackBar.open('User Registration Successful', 'Clear', {duration: 5 * 1000})
        this.event.newEvent({'event': 'added teacher', 'data': res.data});

        success.onAction().subscribe(() => {
          this.form.reset(this.initialValue);
        });

        this.sending = false;
      }, (err: any) => {
        let errorSnackbar = this.snackBar.open(err.error.detail, 'Clear', {duration: 5 * 1000})
          
        errorSnackbar.onAction().subscribe(() => {
          this.form.reset(this.initialValue);
        });

        this.sending = false;
    })
  }
}
