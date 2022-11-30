import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthApiService } from 'src/app/apis/auth-api.service';
import { ClassApiService } from 'src/app/apis/class-api.service';
import { DepartmentApiService } from 'src/app/apis/department-api.service';
import { StudentApiService } from 'src/app/apis/student-api.service';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-classes-table',
  templateUrl: './classes-table.component.html',
  styleUrls: ['./classes-table.component.css']
})
export class ClassesTableComponent implements OnInit {
  private subs = new Subscription();

  displayedColumns: string[] = ['name', 'major', 'semester', 'year', 'students'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  classes = <any>[];

  selectedRow = <any>{};

  @Input()
  departmentId = '';

  @Input()
  origin = '';

  userId = '';

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private classApi: ClassApiService,
    private events: EventEmitterService,
    private authApi: AuthApiService,
    private snackBar: MatSnackBar,
    private token: SessionService,
  ) {
    this.userId = token.getUser().id;
  }

  ngOnInit() {
    this.subs.add(this.classApi.getClasses(this.departmentId)
      .subscribe((res: any) => {
        res.data.forEach((element:any) => {
          let no_students = element.students == null ? 0 : element.students.length;
          this.classes.push({
            id: element.id,
            name: element.name,
            major: element.major ?? ' ',
            semester: element.semester,
            year: `${element.year.start}-${element.year.end}`,
            students: no_students
          })
        });
        // this.classes = res.data;
        console.log(this.classes);


        this.dataSource = new MatTableDataSource(this.classes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (err: any) => {
        window.location.reload();
      }));
  }


  ngAfterViewInit() {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  rowOnClick(data: any) {
    this.selectedRow = data;
    let source = 'dept-head';
    if (origin != ''){
      source = 'admin'
    }
    this.router.navigate([`/${source}/view-class-schedule/${data.id}`]);
  }


}
