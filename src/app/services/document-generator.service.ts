import { Injectable } from '@angular/core';

var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;



@Injectable({
	providedIn: 'root'
})
export class DocumentGeneratorService {

	constructor(
	) { }



	public generateTeachingAssignment(class_loads: any, profile: any = <any>{}) {
		// playground requires you to assign document definition to a variable called dd
		let utc = new Date().toJSON().slice(0, 10).replace(/-/g, '/');

		let loads = <any>[];
		loads.push(
			[
				{ text: 'Section Code', style: 'tableHeader', alignment: 'center' },
				{ text: 'Day(s)', style: 'tableHeader', alignment: 'center' },
				{ text: 'Time', style: 'tableHeader', alignment: 'center' },
				{ text: 'Course Code', style: 'tableHeader', alignment: 'center' },
				{ text: 'Descriptive Title', style: 'tableHeader', alignment: 'center' },
				{ text: 'Units', style: 'tableHeader', alignment: 'center' },
				{ text: 'Converted Hours', style: 'tableHeader', alignment: 'center' },
				{ text: 'College', style: 'tableHeader', alignment: 'center' },
				{ text: 'Class Size', style: 'tableHeader', alignment: 'center' }
			]
		)

		transformTeacherAssignmentToPdfMakeTableData(class_loads).forEach((data: any) => loads.push(data))

		console.log(loads);
		var docDefinition = {
			content: [
				{
					columns: [
						{
							width: '*',
							text: [
								{ text: 'DEPARTMENT OF ', style: 'textBold', },
								{ text: 'COMPUTER SCIENCE', style: 'textBoldUnderline', },
							], margin: [0, 0, 0, 2]
						},
						{
							width: 'auto',
							text: [
								{ text: '1ST SEMESTER of SY 2022-2023', style: 'textBold', },
							], margin: [0, 0, 0, 2]
						}
					]
				},
				{
					text: [
						{ text: 'TEACHING ASSIGMENT (', style: 'textBold', },
						{ text: 'REGULAR', style: 'textBoldUnderline', },
						{ text: ' / SPECIAL CLASSES)', style: 'textBold', }
					]
					, margin: [0, 0, 0, 10]
				},
				{
					text: [
						{ text: 'FULL-TIME', style: 'textBoldUnderline', },
						{ text: ' / PART-TIME FACULTY', style: 'textBold', }
					], margin: [0, 0, 0, 2]
				},
				{
					columns: [
						{
							width: '*',
							text: [
								{ text: 'Name: ', style: 'defaultText', },
								{ text: 'ALDWIN M. ILUMIN', style: 'textBoldUnderline', },
							], margin: [0, 0, 0, 2]
						},
						{
							width: 'auto',
							text: [
								{ text: 'Academic Rank: ', style: 'defaultText', },
								{ text: 'Asst. Professor', style: 'textBoldUnderline', },
							], margin: [0, 0, 0, 2]
						}
					]
				},
				{
					text: [
						{ text: 'Nature of Appointment: ', style: 'defaultText', },
						{ text: 'Permanent Full-time / Program Chair', style: 'textBoldUnderline', },
					], margin: [0, 0, 0, 2]
				},
				{
					columns: [
						{
							width: 'auto',
							text: [
								{ text: 'PRC License: ', style: 'defaultText', },
								{ text: '______________________', style: 'textBoldUnderline', },
							], margin: [0, 0, 10, 0]
						},
						{
							width: 'auto',
							text: [
								{ text: 'Number:', style: 'defaultText', },
								{ text: '___________', style: 'textBoldUnderline', },
							], margin: [0, 0, 10, 0]
						},
						{
							width: 'auto',
							text: [
								{ text: 'Valid Until: ', style: 'defaultText', },
								{ text: '________________', style: 'textBoldUnderline', },
							], margin: [0, 0, 0, 2]
						}
					], margin: [0, 0, 0, 2]
				},
				{
					text: [
						{ text: 'Teaching Record: ', style: 'defaultText', },
						{ text: '21 years', style: 'textBoldUnderline', },
					], margin: [0, 0, 0, 2]
				},
				{
					text: [
						{ text: 'Highest Degree: ', style: 'defaultText', },
						{ text: 'Doctor in Information Technology (DIT-with units)', style: 'textBoldUnderline', },
					], margin: [0, 0, 0, 2]
				},
				{
					text: [
						{ text: 'School and Year Obtained: ', style: 'defaultText', },
						{ text: 'University of the Cordilleras-Baguio City/', style: 'textBoldUnderline', },
					], margin: [0, 0, 0, 2]
				},
				{
					text: [
						{ text: 'Other Information on Educational Qualification: ', style: 'defaultText', },
						{ text: 'Master in Information Technology (MIT)- MSEUF Lucena City (2009); Bachelor of Science in Computer Science(BSCS)-Manuel S. Enverga University Foundation – Lucena City (2001)', style: 'textBoldUnderline', },
					], margin: [0, 0, 0, 2]
				},
				{
					text: [
						{ text: 'Non-Teaching Duty: ', style: 'defaultText', },
						{ text: 'Research, Promotion, & Community Outreach', style: 'textBoldUnderline', },
					], margin: [0, 0, 0, 2]
				},
				{
					columns: [
						{
							width: '*',
							text: [
								{ text: 'Consultation Hours: ', style: 'defaultText', },
								{ text: 'W / 03:00-04:00pm', style: 'textBoldUnderline', },
							],
						},
						{
							width: '*',
							text: [
								{ text: 'Venue: : ', style: 'defaultText', },
								{ text: 'Consultation Room', style: 'textBoldUnderline', },
							],
						}
					], margin: [0, 0, 0, 15]
				},
				{
					style: 'tableExample',
					color: '#444',
					table: {
						widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
						headerRows: 1,
						body: loads
					}
				},
				{
					text: '________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________',
					style: 'textBold',
					margin: [0, 0, 0, 15]
				},
				{
					columns: [
						{
							width: '50%',
							columns: [
								{
									type: 'none',
									ul: [
										{ text: 'Prepared By:', style: 'textBold' },
										{ text: '\n\n\nALDWIN M. ILUMIN, MIT', style: 'textBold' },
										{ text: 'Department Chairperson', style: 'textBold' },
										{ text: '\n\nRecommending Approval:\n\n\n', style: 'textBold' },
										{ text: 'DR. CRYSTAL B. QUINTANA', style: 'textBold' },
										{ text: '.        Dean of Studies', style: 'textBold', },
										{
											style: 'tableExample',
											table: {
												body: [
													[{ text: 'Teaching Assigment acknowledge and received:', alignment: 'center', border: [true, true, true, false] }],
													[{ text: '\n', border: [true, false, true, false], alignment: 'center' }],
													[{ text: 'ALDWIN M. ILUMIN', style: 'textBold', border: [true, false, true, false], alignment: 'center' }],
													[{ text: `Date: ${utc}`, border: [true, false, true, true], alignment: 'center' }],

												]
											},
											layout: {
												defaultBorder: true,
											}
										},
									]
								},
							]
						},
						{
							width: 'auto',
							columns: [
								{
									type: 'none',
									ul: [
										{
											text: [
												{ text: 'TOTAL- Regular  ', style: 'textBold' },
												{ text: `${totalUnits(class_loads)} units/ ${totalHours(class_loads)} converted hours`, style: 'textBoldUnderline' }
											]
										},
										{ text: '\n\n\n\n', style: 'textBold' },
										{ text: '\n', style: 'textBold' },
										{ text: '\n\n\n\n\n', style: 'textBold' },
										{ text: 'Approved by:\n\n\n', style: 'textBold', alignment: 'center' },
										{ text: '', style: 'textBold' },
										{ text: 'BENILDA N. VILLENAS, Ph.D.', style: 'textBold', alignment: 'center' },
										{ text: 'Vice President for Academics and Research', style: 'textBold', alignment: 'center' },
									]
								},
							]
						}
					]
				},
			],
			styles: {
				defaultText: {
					fontSize: 13
				},
				textBold: {
					fontSize: 13,
					bold: true,
				},
				textBoldUnderline: {
					fontSize: 13,
					bold: true,
					decoration: 'underline'
				},
				tableLoads: {

				},
				tableExample: {
					margin: [0, 5, 0, 15]
				},
				tableHeader: {
					bold: true,
					fontSize: 9,
					color: 'black'
				},
				tableContent: {
					fontSize: 11,
				}
			},
			defaultStyle: {
				// alignment: 'justify'
				margin: [0, 5, 0, 5]
			}

		}

		return docDefinition;
	}



	public generatePreEnrollmentForm(class_info: any, class_loads: any) {

		let loads = [];
		loads.push(
			[
				{ text: 'Section Code', style: 'tableHeader', alignment: 'center' },
				{ text: 'Subject Code', style: 'tableHeader', alignment: 'center' },
				{ text: 'Description', style: 'tableHeader', alignment: 'center' },
				{ text: 'Units', style: 'tableHeader', alignment: 'center' },
				{ text: 'Hrs/Wk', style: 'tableHeader', alignment: 'center' },
				{ text: 'Day/s', style: 'tableHeader', alignment: 'center' },
				{ text: 'Time', style: 'tableHeader', alignment: 'center' },
				{ text: 'Professor', style: 'tableHeader', alignment: 'center' },
			],
		);

		transformClassLoadToPdfMakeTableData(class_loads).forEach((data) => loads.push(data))

		loads.push(
			[
				{ text: '', style: 'tableContent', alignment: 'center' },
				{ text: '', style: 'tableContent', alignment: 'center' },
				{ text: 'Total number of units/hours', style: 'tableContentBold', alignment: 'right' },
				{ text: `${totalUnits(class_loads)}`, style: 'tableContent', alignment: 'center' },
				{ text: `${totalHours(class_loads)}`, style: 'tableContent', alignment: 'center' },
				{ text: '', style: 'tableContent', alignment: 'center' },
				{ text: '', style: 'tableContent', alignment: 'center' },
				{ text: '', style: 'tableContent', alignment: 'center' },
			],
		);

		let docDefinition = {
			pageSize: 'A3',
			content: [
				{
					columns: [
						{
							width: '68%',
							text: [
								{ text: 'Course: ', style: 'textBold' },
								{ text: class_info.department_name, style: 'textBoldUnderline' }
							]
						},
						{
							width: 'auto',
							text: [
								{ text: 'Pre-Enrollment Form No.', style: 'textBold' },
								{ text: '______________', style: 'textBoldUnderline' }
							]
						}
					], style: 'defaultMargin'
				},
				{
					columns: [
						{
							width: '68%',
							text: [
								{ text: 'Year/Section:: ', style: 'textBold' },
								{ text: class_info.class_name, style: 'textBoldUnderline' }
							]
						},
						{
							width: 'auto',
							text: [
								{ text: 'Cash', style: 'textBold' },
								{ text: '___________', style: 'textBoldUnderline' },
								{ text: 'Installment', style: 'textBold' },
								{ text: '____________', style: 'textBoldUnderline' }
							]
						}
					], style: 'defaultMargin'
				},
				{
					columns: [
						{
							width: '68%',
							text: [
								{ text: 'Section Block: ', style: 'textBold' },
								{ text: class_info.section_block, style: 'textBoldUnderline' }
							]
						},
						{
							width: 'auto',
							text: [
								{ text: 'CET/F137/XBS (PSA)/CGMC', style: 'textBold' },
							]
						}
					], margin: [0, 0, 0, 20]
				},
				{
					text: 'SUBJECT(s) TO BE TAKEN:', style: 'textBold'
				},
				{
					style: 'tableExample',
					color: '#444',
					table: {
						widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', '*',],
						headerRows: 1,
						body: loads
					}
				},
			],
			styles: {
				defaultText: {
					fontSize: 13
				},
				textBold: {
					fontSize: 13,
					bold: true,
				},
				textBoldUnderline: {
					fontSize: 13,
					bold: true,
					decoration: 'underline'
				},
				tableLoads: {

				},
				tableExample: {
					margin: [0, 5, 0, 15]
				},
				tableHeader: {
					bold: true,
					fontSize: 13,
					color: 'black'
				},
				tableContent: {
					fontSize: 13,
					color: 'black'
				},
				tableContentBold: {
					bold: true,
					fontSize: 13,
					color: 'black'
				},
				defaultMargin: {
					margin: [0, 0, 0, 3]
				}
			},
			defaultStyle: {
				// alignment: 'justify'
				margin: [0, 5, 0, 5]
			}

		}

		return docDefinition;
	}
}


function transformClassLoadToPdfMakeTableData(class_load: any) {
	let data: { text: any; style: string; alignment: string; }[][] = [];
	class_load.forEach(
		(load: any) => {
			let days = '';
			let times = ''
			load.schedules.forEach(
				(schedule: any) => {
					days += schedule.days.join('') + '\n';
					times += `${schedule.startTime.split(' ')[0]}-${schedule.endTime.split(' ')[0]}\n`;
				}
			)
			data.push(
				[
					{ text: load.section_id, style: 'tableContent', alignment: 'left' },
					{ text: load.subject_id, style: 'tableContent', alignment: 'left' },
					{ text: load.description, style: 'tableContent', alignment: 'left' },
					{ text: load.units, style: 'tableContent', alignment: 'center' },
					{ text: load.hours, style: 'tableContent', alignment: 'center' },
					{ text: days, style: 'tableContent', alignment: 'center' },
					{ text: times, style: 'tableContent', alignment: 'left' },
					{ text: `${load.name.lastname.toUpperCase()}, ${load.name.firstname.toUpperCase()[0]}`, style: 'tableContent', alignment: 'left' },
				],
			)
		}
	)
	return data;
}

function transformTeacherAssignmentToPdfMakeTableData(class_load: any) {
	let data = <any>[];
	class_load.forEach(function (load: any) {
		data.push([
			{ text: load.section_id, style: 'tableContent', alignment: 'center' },
			{ text: load.days, style: 'tableContent', alignment: 'center' },
			{ text: load.time, style: 'tableContent', alignment: 'center' },
			{ text: load.subject_id, style: 'tableContent', alignment: 'center' },
			{ text: load.description, style: 'tableContent', alignment: 'center' },
			{ text: load.units, style: 'tableContent', alignment: 'center' },
			{ text: load.hours, style: 'tableContent', alignment: 'center' },
			{ text: load.college, style: 'tableContent', alignment: 'center' },
			{ text: load.class_size, style: 'tableContent', alignment: 'center' }
		]);
	});
	return data;
}

function totalHours(class_load: any) {
	let hours = 0;
	class_load.forEach((load: any) => hours += load.hours)
	return hours;
}
function totalUnits(class_load: any) {
	let units = 0;
	class_load.forEach((load: any) => units += load.units)
	return units;
}
