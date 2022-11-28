import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ClassApiService } from 'src/app/apis/class-api.service';
import { SelectStudentsTableComponent } from 'src/app/components/select-students-table/select-students-table.component';
import { SessionService } from 'src/app/services/session.service';

@Component({
	selector: 'app-view-class-info',
	templateUrl: './view-class-info.component.html',
	styleUrls: ['./view-class-info.component.css'],
})
export class ViewClassInfoComponent implements OnInit, AfterViewInit {
	token: string = '';
	userId = '';
	classId = '';

	classInfoChanged: boolean = false;
	addStudentLoading: boolean = false;
	removeStudentsLoading: boolean = false;

	classInfoForm: FormGroup;

	classLoads = <any>[];
	classStudents = <any>[];

	studentsTableColumns: string[] = ['profile_img', 'name', 'gender', 'year'];
	studentsDataSource = new MatTableDataSource();
	selectedStudents = new Set();

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	constructor(
		public dialog: MatDialog,
		private snackBar: MatSnackBar,
		private route: ActivatedRoute,
		private fb: FormBuilder,
		private classAPI: ClassApiService,
		private tokenStorage: SessionService
	) {
		this.classInfoForm = fb.group({
			name: [null],
			major: [null],
			semester: [null],
			startYear: [null],
			endYear: [null],
		});

		this.userId = tokenStorage.getUser().id;
	}

	ngOnInit(): void {
		this.route.params.subscribe((params) => (this.token = params['token']));

		this.loadClassInfo();
		this.loadClassLoads();
		this.loadClassStudents();
		this.listenToClassInfoChanges();
	}

	ngAfterViewInit(): void { }

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.studentsDataSource.filter = filterValue.trim().toLowerCase();

		if (this.studentsDataSource.paginator) {
			this.studentsDataSource.paginator.firstPage();
		}
	}

	listenToClassInfoChanges(){
		this.classInfoForm.controls['name'].valueChanges.subscribe(() => this.classInfoChanged = true);
		this.classInfoForm.controls['major'].valueChanges.subscribe(() => this.classInfoChanged = true);
		this.classInfoForm.controls['semester'].valueChanges.subscribe(() => this.classInfoChanged = true);
		this.classInfoForm.controls['startYear'].valueChanges.subscribe(() => this.classInfoChanged = true);
		this.classInfoForm.controls['endYear'].valueChanges.subscribe(() => this.classInfoChanged = true);
	}

	loadClassInfo() {
		this.classAPI.getClassInfo(this.token).subscribe(
			(data) => {
				this.classId = data.id;
				this.classInfoForm.get('name')?.setValue(data.name);
				this.classInfoForm.get('major')?.setValue(data.major);
				this.classInfoForm.get('semester')?.setValue(data.semester);
				this.classInfoForm.get('startYear')?.setValue(data.year.start);
				this.classInfoForm.get('endYear')?.setValue(data.year.end);
				this.classInfoChanged = false;
			},
			(err) => { }
		);
	}

	loadClassLoads() {
		this.classAPI.getClassLoads(this.token).subscribe((data) => {
			data.data.forEach((value: any) => {
				value.name =
					value.name.lastname +
					', ' +
					value.name.firstname +
					' ' +
					value.name.middlename.toUpperCase()[0];
				this.classLoads.push(value);
			});
		});
	}

	loadClassStudents() {
		this.classAPI.getClassStudents(this.token).subscribe((data) => {
			this.classStudents = data.data;

			console.log(this.classStudents);

			this.studentsDataSource = new MatTableDataSource(this.classStudents);

			this.studentsDataSource.paginator = this.paginator;
			this.studentsDataSource.sort = this.sort;
		});
	}

	selectStudent(id: any) {
		if (this.selectedStudents.has(id)) {
			this.selectedStudents.delete(id);
		} else {
			this.selectedStudents.add(id);
		}
		console.log(this.selectedStudents);
	}

	openAddStudentDialog() {
		const dialogRef = this.dialog.open(SelectStudentsTableComponent, {
			data: { class_id: this.token },
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result != 'none'){
				this.addStudentLoading = true;
	
				this.classAPI
					.addNewStudentsInClass(this.token, { students: Array.from(result) })
					.subscribe(
						(data) => {
							this.addStudentLoading = false;
							this.snackBar.open(data.detail, 'Close', {duration: 1000 * 3});
							this.loadClassStudents();
						},
						(err) => {
							this.addStudentLoading = false;
						}
				);
			}
		});
	}

	updateClassInfo() {
		let payload = {
			name: this.classInfoForm.controls['name'].value,
			major: this.classInfoForm.controls['major'].value,
			semester: this.classInfoForm.controls['semester'].value,
			year: {
				start: this.classInfoForm.controls['startYear'].value,
				end: this.classInfoForm.controls['endYear'].value,
			}
		}
		this.classAPI.updateClassInfo(this.classId, payload).subscribe(
			(data: any) => {
				this.snackBar.open(data.detail, 'Close', {duration: 1000 * 3});
			}
		)
	}


	removeStudentsFromClass() {
		this.removeStudentsLoading = true;
	
		this.classAPI
			.removeStudentsFromClass(this.token, { students: Array.from(this.selectedStudents) })
			.subscribe(
				(data) => {
					this.removeStudentsLoading = false;
					this.snackBar.open(data.detail, 'Close', {duration: 1000 * 3});
					this.loadClassStudents();
				},
				(err) => {
					this.removeStudentsLoading = false;
				}
		);

		this.selectedStudents.clear();
	}
}
