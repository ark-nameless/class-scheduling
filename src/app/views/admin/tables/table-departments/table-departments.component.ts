import {AfterViewInit, Component, ViewChild, OnInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Subscription } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DepartmentApiService } from 'src/app/apis/department-api.service';
import { FormControl } from '@angular/forms';
import { SessionService } from 'src/app/services/session.service';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-table-departments',
  templateUrl: './table-departments.component.html',
  styleUrls: ['./table-departments.component.css']
})
export class TableDepartmentsComponent implements OnInit {

  private subs = new Subscription();

  inputForm: FormControl = new FormControl();

  displayedColumns: string[] = ['name', 'abbrev', 'section_id'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  students = <any>[];

  constructor(
    private router: Router,
    private departmentApi: DepartmentApiService,
    private http: HttpClient,
    private events: EventEmitterService,
    private tokens: SessionService,
  ) {
  }

  ngOnInit() {
    this.subs.add(this.departmentApi.getDepartments()
      .subscribe((res: any) => {
        console.log(res);
        this.students = res.data;
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (err: any) => {
        window.location.reload();
      }));

    this.events.events$.forEach((event) => {
      if (event.event == 'added department') {
        this.students.push(event.data);
        this.dataSource.data = this.students;
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadDepartments() { 

    return this.departmentApi.getDepartments().subscribe((data: any) => {
      this.students = data.data;
      this.dataSource = data.data;
    })
  }

  navigateToDepartment(row: any) {
    this.router.navigate([`/admin/view-department/${row.id}`]);
  }

}
