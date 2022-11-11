import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DepartmentApiService } from 'src/app/apis/department-api.service';
import { StudentApiService } from 'src/app/apis/student-api.service';

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
              private departmentApi: DepartmentApiService,
              private studentApi: StudentApiService,
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
    this.studentApi.registerUnverifiedStudent(body).subscribe((res: any) => {
        if (res.status_code == 409) {
          let errorSnackbar = this.snackBar.open(res.detail, 'Clear', {duration: 5 * 1000})
          
          errorSnackbar.onAction().subscribe(() => {
            this.form.reset(this.initialValue);
          });
        }
        let success = this.snackBar.open('User Registration Successful', 'Clear', {duration: 5 * 1000})
          
        success.onAction().subscribe(() => {
          this.form.reset(this.initialValue);
        });

        this.sending = false;
      }, (err: any) => {
      
        this.sending = false;
    })
  }

}
