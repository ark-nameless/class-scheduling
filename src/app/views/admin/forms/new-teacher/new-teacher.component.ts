import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-teacher',
  templateUrl: './new-teacher.component.html',
  styleUrls: ['./new-teacher.component.css']
})
export class NewTeacherComponent implements OnInit {
  form: FormGroup;
  initialValue: FormGroup;

  sending = false

  constructor(private fb: FormBuilder, 
              private router: Router,
              private snackBar: MatSnackBar
  ) {
    this.initialValue = this.form = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      department: [null, [Validators.required]],
    })
  }

  ngOnInit(): void {
  }

}
