import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AuthApiService } from 'src/app/apis/auth-api.service';
import { DepartmentApiService } from 'src/app/apis/department-api.service';
import { TeacherApiService } from 'src/app/apis/teacher-api.service';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { SessionService } from 'src/app/services/session.service';
import { DialogDeleteAccountComponent } from '../../dialog-delete-account/dialog-delete-account.component';


@Component({
  selector: 'app-subject-requests-table',
  templateUrl: './subject-requests.component.html',
  styleUrls: ['./subject-requests.component.css']
})
export class SubjectRequestsTableComponent implements OnInit {

  snackbarDuration = 3;

  private subs = new Subscription();

  displayedColumns: string[] = ['from', 'description', 'subjects', 'actions'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  requests = <any>[];

  selectedRow = <any>{};
  

  @Input()
  departmentId = '';

  userId = '';


  constructor(
    public dialog: MatDialog,
    private teacherApi: TeacherApiService,
    private departmentApi: DepartmentApiService,
    private events: EventEmitterService,
    private authApi: AuthApiService,
    private snackbar: MatSnackBar,
    private token: SessionService,
  ) {
    this.userId = token.getUser().id;
  }

  ngOnInit() {
    this.subs.add(this.departmentApi.getSubjectRequests(this.departmentId)
      .subscribe((res: any) => {
        this.requests = res.data;
        this.dataSource = new MatTableDataSource(this.requests);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (err: any) => {
        // window.location.reload();
      })
    );
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
    this.selectedRow = data
  }

  finishRequest(id = ''){
    id = id == '' ? this.selectedRow.id : id;

    console.log(id);

    this.departmentApi.finishScheduleRequest(id).subscribe(
      (data: any) => {
        this.snackbar.open(data.detail, 'Close', { duration: this.snackbarDuration * 1000 })

        const objWithIdIndex = this.requests.findIndex((obj:any) => obj.id === id);

        if (objWithIdIndex > -1) {
          this.requests.splice(objWithIdIndex, 1);
        }
        this.dataSource = this.requests;
      }
    )
  }
}
