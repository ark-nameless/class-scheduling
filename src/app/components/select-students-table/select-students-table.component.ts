import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, Inject, AfterViewInit, ViewChild } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ClassApiService } from 'src/app/apis/class-api.service';
import { SessionService } from 'src/app/services/session.service';

import { DialogRef } from '@angular/cdk/dialog';


@Component({
  selector: 'app-select-students-table',
  templateUrl: './select-students-table.component.html',
  styleUrls: ['./select-students-table.component.css']
})
export class SelectStudentsTableComponent implements OnInit, AfterViewInit{

  studentList = <any>[];
  userId = '';


  studentsTableColumns: string[] = ['select', 'profile_img', 'name', 'gender', 'year'];
  columns: string[] = ['profile_img', 'name', 'gender', 'year'];
  dataSource = new MatTableDataSource();
  selection;

  selectedStudents = new Set();

  @ViewChild(MatPaginator) selectStudentPaginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private classAPI: ClassApiService,
    private tokenStorage: SessionService,
  ) {
    this.userId = tokenStorage.getUser().id;
    
    this.selection = new SelectionModel<any>(true, []);
  }

  ngOnInit(): void {

    this.selection.changed.subscribe( data => {
      data.added.forEach(student => {
        this.selectedStudents.add(student.id);
      });
      data.removed.forEach(student => {
        this.selectedStudents.delete(student.id);
      })
    })
  }

  ngAfterViewInit() {
    this.classAPI.getStudentsNotInClass(this.data.class_id).subscribe(
      data => {
        this.studentList = data.data;
        this.dataSource = new MatTableDataSource(this.studentList);
        
        this.dataSource.paginator = this.selectStudentPaginator;
        this.dataSource.sort = this.sort;
      }
    )

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
}
