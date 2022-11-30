import { AfterViewInit, Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ClassApiService } from 'src/app/apis/class-api.service';
import { TeacherApiService } from 'src/app/apis/teacher-api.service';
import { SelectStudentsTableComponent } from 'src/app/components/select-students-table/select-students-table.component';
import { DocumentGeneratorService } from 'src/app/services/document-generator.service';
import { SessionService } from 'src/app/services/session.service';
import Swal from 'sweetalert2';

var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;  

@Component({
	selector: 'app-view-class-info',
	templateUrl: './view-class-info.component.html',
	styleUrls: ['./view-class-info.component.css'],
})
export class ViewClassInfoComponent implements OnInit, AfterViewInit {
	token: string = '';
	userId = '';
	classId = '';

	disableEditing =false;

	extraClassInfo  = <any>{};

	classInfoChanged: boolean = false;
	addStudentLoading: boolean = false;
	removeStudentsLoading: boolean = false;

	classInfoForm: FormGroup;

	classLoads = <any>[];
	classStudents = <any>[];
	classInfo = <any>{};


	studentsTableColumns: string[] = ['profile_img', 'name', 'gender', 'year'];
	studentsDataSource = new MatTableDataSource();
	selectedStudents = new Set();

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	constructor(
		private router: Router,
		public dialog: MatDialog,
		private docgenerator: DocumentGeneratorService,
		private snackBar: MatSnackBar,
		private route: ActivatedRoute,
		private fb: FormBuilder,
		private classAPI: ClassApiService,
		private teacherApi: TeacherApiService,
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
		if (this.tokenStorage.getUser().role.toLowerCase() != 'department head'){
			this.disableEditing = true;
		}
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
				this.classInfo = data;
			},
			(err) => { }
		);
	}

	loadClassLoads() {
		this.classAPI.getClassLoads(this.token).subscribe((data) => {
			data.data.forEach((value: any) => {
				this.classLoads.push(value);
			});
		});
	}

	loadClassStudents() {
		this.classAPI.getClassStudents(this.token).subscribe((data) => {
			this.classStudents = data.data;
			
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

	createPreEnrollmentData(){
		return {
			department_name: this.classInfo['department_name'],
			class_name: this.classInfo['name'],
			section_block: this.classInfo['section_block'],
			sy: {
				startYear: '',
				endYear: '',
			}
		}
	}

	async generatePreEnrollmentForm() {
		pdfMake.createPdf(this.docgenerator.generatePreEnrollmentForm(this.createPreEnrollmentData(), this.classLoads)).open();
	}

	async archiveClass() {
		const { value: className } = await Swal.fire({
			title: `Archive Class`,
			html: `<p>Please Enter <span class="font-semibold">'${this.classInfoForm.controls['name'].value}'</span> to archive</p>`,
			input: 'text',
			icon: 'warning',
			timer: 15000,
			timerProgressBar: true,
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Confirm',
			inputValidator: (value) => {
				if (!value) {
					return 'Please fill in the field!';
				}
				return '';
			}
		});

		if (className){
			if (className != this.classInfoForm.controls['name'].value){
				Swal.fire({
					icon: 'error',
					title: 'Incorrect Class Name',
					html: `Unable to archive <span class="font-semibold">'${this.classInfoForm.controls['name'].value}'</span>`,
				})
			} else {
				this.classAPI.archiveClass(this.token).subscribe(
					(data: any) => {
						Swal.fire({
							text: data.detail,
							icon: 'success',
							confirmButtonColor: '#bc2ac9',
							confirmButtonText: 'Finish'
						}).then((result:any) => {
							this.router.navigate(['/dept-head/classes'])
						})
					}
				)
			}
		}
	}
}
