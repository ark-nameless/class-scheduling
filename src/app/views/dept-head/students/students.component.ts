import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewStudentComponent } from '../forms/new-student/new-student.component';



@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  
  departmentId = ''
  
  constructor(
    public dialog: MatDialog,
  ) { 
    this.departmentId = window.sessionStorage.getItem('dept-id') ?? '';
  }

  ngOnInit(): void {
  }

  addNewStudentDialog() {
    const dialogRef = this.dialog.open(NewStudentComponent);

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
