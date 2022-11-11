import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, retry, Subscription, throwError } from 'rxjs';
import { StudentApiService } from 'src/app/apis/student-api.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-table-students',
  templateUrl: './table-students.component.html',
  styleUrls: ['./table-students.component.css']
})
export class TableStudentsComponent implements OnInit {
  private subs = new Subscription();

  displayedColumns: string[] = ['name', 'email', 'verified', 'deparment_name', 'actions'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  students = <any>[];

  constructor(
    private studentAPI: StudentApiService,
    private token: SessionService,
  ) {
  }

  ngOnInit() {
    this.subs.add(this.studentAPI.getStudents()
      .subscribe((res: any) => {
        res.data.forEach((entry: any) => {
          entry.name = entry.name !== null ? entry.name.lastname + ', ' + entry.name.firstname + ' ' + entry.name.middlename.toUpperCase()[0] + '.': '';
          this.students.push(entry)
        });
        console.log(res);
        this.dataSource = new MatTableDataSource(this.students);
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

  loadStudents() { 
    return this.studentAPI.getStudents().subscribe((data: any) => {
      data.data.forEach((entry: any) => {
        entry.name = entry.name !== null ? entry.name.lastname + ', ' + entry.name.firstname + ' ' + entry.name.middlename.toUpperCase()[0] + '.': '';
        this.students.push(entry)
      });
      this.dataSource = this.students;
    })
  }

  rowOnClick(id: any) {
    console.log(id);
  }
}
