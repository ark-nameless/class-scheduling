import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectDepartmentsComponent } from './select-departments/select-departments.component';
import { DialogDeleteAccountComponent } from './dialog-delete-account/dialog-delete-account.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { VaMatTableComponent } from './va-mat-table/va-mat-table.component';
import { ColumnSorterComponent } from './column-sorter/column-sorter.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { StudentsTableComponent } from './tables/students-table/students-table.component';
import { CdkMenuModule } from '@angular/cdk/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ClassesTableComponent } from './tables/classes-table/classes-table.component';
import { TeachersTableComponent } from './tables/teachers-table/teachers-table.component';



@NgModule({
  declarations: [
    SelectDepartmentsComponent,
    DialogDeleteAccountComponent,
    VaMatTableComponent,
    ColumnSorterComponent,
    StudentsTableComponent,
    ClassesTableComponent,
    TeachersTableComponent,
  ],
  imports: [
    CommonModule,

    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatCheckboxModule,
    DragDropModule,

    CdkMenuModule,

    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatStepperModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDividerModule,
    MatProgressBarModule,
    MatSidenavModule,
    NgSelectModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatButtonToggleModule,
  ],
  exports: [
    SelectDepartmentsComponent,
    DialogDeleteAccountComponent,
    VaMatTableComponent,
    ColumnSorterComponent,
    StudentsTableComponent,
    ClassesTableComponent,
    TeachersTableComponent,
  ]
})
export class ComponentsModule { }
