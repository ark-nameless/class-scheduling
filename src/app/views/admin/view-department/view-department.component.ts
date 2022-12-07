import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentApiService } from 'src/app/apis/department-api.service';
import { TeacherApiService } from 'src/app/apis/teacher-api.service';

@Component({
  selector: 'app-view-department',
  templateUrl: './view-department.component.html',
  styleUrls: ['./view-department.component.css']
})
export class ViewDepartmentComponent implements OnInit {
  departmentId = '';

  form!: FormGroup;
  initialValue!: FormGroup;
  head_id: FormControl = new FormControl();

  sending = false

  teachers = <any>[]
  loadingTeachers = false;

  departmentInfo = <any>{};

  constructor(
    private teacherApi: TeacherApiService,
    private departmentApi: DepartmentApiService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
  ) { 
    this.route.params.subscribe(
      (params) => {
        this.departmentId = params['id'];
      }
    )

    this.initialValue = this.form = this.fb.group({
      name: [null, [Validators.required]],
      abbrev: [null, [Validators.required]],
      section_id: [null, [Validators.required,]],
      head_id: [null],
    })
  }

  ngOnInit(): void {
    this.loadTeachers();
    this.loadDepartment();
  }

  loadTeachers(){ 
    this.loadingTeachers = true;
    this.teacherApi.getNoneDeptHeadTeachers().subscribe((data: any) => {
      this.teachers = data.data;
      this.loadingTeachers = false;
    })
  }

  loadDepartment(){
    this.departmentApi.getDepartmentInfo(this.departmentId).subscribe(
      (data: any) => {
        this.loadDepartmentInfo(data.data);
      }
    )
  }

  loadDepartmentInfo(data: any){
    this.form.patchValue({
      name: data.name,
      abbrev: data.abbrev,
      section_id: data.section_id
    });
  }



  updateDepartment(){
    let update_data = <any>{
      name: this.form.value.name,
      abbrev: this.form.value.abbrev,
      section_id: this.form.value.section_id,
    }

    if (this.form.value.head_id != null){
      update_data['head_id'] =  this.form.value.head_id;
    }
    

    this.departmentApi.updateDepartmentInfo(this.departmentId, update_data).subscribe(
      (data: any) => {
        this.snackbar.open(data.detail, 'Close', { duration: 3 * 1000 });
      }
    )
  }

}
