import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ClassApiService } from 'src/app/apis/class-api.service';

@Component({
  selector: 'app-view-class-info',
  templateUrl: './view-class-info.component.html',
  styleUrls: ['./view-class-info.component.css']
})
export class ViewClassInfoComponent implements OnInit {

  token: string = '';

  classInfoForm: FormGroup;

  classLoads = <any>[];


  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private classAPI: ClassApiService,
  ) {

    this.classInfoForm = fb.group({
      name: [null, ],
      major: [null, ],
      semester: [null, ],
      startYear: [null, ],
      endYear: [null, ],
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe( params => 
      this.token = params['token']
    );

    this.populateClassInforForm();
  }

  populateClassInforForm() {
    this.classAPI.getClassInfo(this.token).subscribe(
      data => {

        this.classInfoForm.get('name')?.setValue(data.name);
        this.classInfoForm.get('major')?.setValue(data.major);
        this.classInfoForm.get('semester')?.setValue(data.semester);
        this.classInfoForm.get('startYear')?.setValue(data.year.start);
        this.classInfoForm.get('endYear')?.setValue(data.year.end);

        console.log(data);

      }, err => {

      }
    )

    this.classAPI.getClassLoads(this.token).subscribe(
      data => {
        data.data.forEach((value:any) => {
          value.name = value.name.lastname + ', ' + value.name.firstname + ' ' + value.name.middlename.toUpperCase()[0];

          this.classLoads.push(value);
        });
      }
    )
  }

}
