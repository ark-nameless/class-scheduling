import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-view-requesting-departments',
  templateUrl: './view-requesting-departments.component.html',
  styleUrls: ['./view-requesting-departments.component.css']
})
export class ViewRequestingDepartmentsComponent implements OnInit {


  departmentId = '';


  constructor(
    private tokenStorage: SessionService,
  ) {
    
		this.departmentId = window.sessionStorage.getItem('dept-id') ?? ' ';
  }

  ngOnInit(): void {
  }

}
