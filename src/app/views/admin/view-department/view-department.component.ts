import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-department',
  templateUrl: './view-department.component.html',
  styleUrls: ['./view-department.component.css']
})
export class ViewDepartmentComponent implements OnInit {
  departmentId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { 
    this.route.params.subscribe(
      (params) => {
        this.departmentId = params['id'];
      }
    )
  }

  ngOnInit(): void {
  }

}
