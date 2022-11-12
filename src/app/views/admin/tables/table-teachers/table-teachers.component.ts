import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, retry, Subscription, throwError } from 'rxjs';
import { AuthApiService } from 'src/app/apis/auth-api.service';
import { StudentApiService } from 'src/app/apis/student-api.service';
import { TeacherApiService } from 'src/app/apis/teacher-api.service';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { SessionService } from 'src/app/services/session.service';


@Component({
  selector: 'app-table-teachers',
  templateUrl: './table-teachers.component.html',
  styleUrls: ['./table-teachers.component.css']
})
export class TableTeachersComponent implements OnInit {
  private subs = new Subscription();

  displayedColumns: string[] = ['name', 'email', 'verified', 'department_name', 'actions'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  teachers = <any>[];

  selectedId = '';

  constructor(
    private teacherApi: TeacherApiService,
    private events: EventEmitterService,
    private authApi: AuthApiService,
    private snackBar: MatSnackBar,
    private token: SessionService,
  ) {
  }

  ngOnInit() {
    this.subs.add(this.teacherApi.getAllTeachers()
      .subscribe((res: any) => {
        res.data.forEach((entry: any) => {
          entry.name = entry.name !== null ? entry.name.lastname + ', ' + entry.name.firstname + ' ' + entry.name.middlename.toUpperCase()[0] + '.': '';
          this.teachers.push(entry)
        });
        this.dataSource = new MatTableDataSource(this.teachers);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (err: any) => {
        // window.location.reload();
      }));

      this.events.events$.forEach((event) => {
      if (event.event == 'added teacher') {
        event = event.data;
        let data = {
          id: event.id,
          name: event.name = event.name !== null ? event.name.lastname + ', ' + 
                             event.name.firstname + ' ' + event.name.middlename.toUpperCase()[0] + '.': '',
          email: event.email,
          verified: event.verified,
          department_name: event.department_name,
          abbrev: event.abbrev,
          role: event.role,
          profile_img: event.profile_img,
          department_id: event.department_id,
          address: event.address
        };
        this.teachers.push(data);
        this.dataSource.data = this.teachers;
      }
    })
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
    this.selectedId = data.id;
  }

  sendVerificationEmail(id: string = '') {
    if (id != '') this.selectedId = id;
    this.authApi.sendAccountVerifivation(this.selectedId).subscribe((data) => {
      this.snackBar.open(data.detail, 'Close', {duration: 3 * 1000})
    }, (error: any) => { 
      this.snackBar.open(error.error.detail, 'Close', {duration: 3 * 1000})
    })
  }

  sendPasswordResetEmail(id: string = '') {
    if (id != '') this.selectedId = id;
    console.log('send password reset email');
  }
}