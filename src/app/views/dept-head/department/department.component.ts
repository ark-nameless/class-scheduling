import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {

  departmentId = ''

  constructor() { }

  ngOnInit(): void {
    this.departmentId = window.sessionStorage.getItem('dept-id') ?? '';
  }

}
