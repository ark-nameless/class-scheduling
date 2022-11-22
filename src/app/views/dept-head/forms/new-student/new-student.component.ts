import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { StudentApiService } from 'src/app/apis/student-api.service';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

@Component({
  selector: 'app-new-student',
  templateUrl: './new-student.component.html',
  styleUrls: ['./new-student.component.css']
})
export class NewStudentComponent implements OnInit {

  form: FormGroup;
  initialValue: FormGroup;

  sending = false

  departments = <any>[]
  loadingDepartments = false;


  constructor(private fb: FormBuilder, 
              private router: Router,
              private studentApi: StudentApiService,
              private event: EventEmitterService,
              private snackBar: MatSnackBar
    ) {
    this.initialValue = this.form = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      department: [null, [Validators.required]],
    })

    
  }

  ngOnInit(): void {
  }


  onSubmit() {
    this.sending = true;

    let body = { 'email': this.form.value.email , 'department_id': window.sessionStorage.getItem('dept-id') }
    let new_user = this.studentApi.registerUnverifiedStudent(body).subscribe((res: any) => {
        if (res.status_code == 409) {
          let errorSnackbar = this.snackBar.open(res.detail, 'Clear', {duration: 5 * 1000})
          
          errorSnackbar.onAction().subscribe(() => {
            this.form.reset(this.initialValue);
          });
        }
        let success = this.snackBar.open('User Registration Successful', 'Clear', {duration: 5 * 1000})
          
        this.event.newEvent({'event': 'added student', 'data': res.data});
        success.onAction().subscribe(() => {
          this.form.reset(this.initialValue);
        });

        this.sending = false;
      }, (err: any) => {
        console.log(err);
        if (err.status == 409){
          let errorSnackbar = this.snackBar.open(err.error.detail, 'Clear', {duration: 5 * 1000})
          
          errorSnackbar.onAction().subscribe(() => {
            this.form.reset(this.initialValue);
          });
        }
        this.sending = false;
    })
  }


}
