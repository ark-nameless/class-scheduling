import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionService } from '../services/session.service';

@Injectable({
  providedIn: 'root'
})
export class StudentApiService {
  apiURL = environment.API_URL;

  constructor(
    private http: HttpClient, 
    private token: SessionService,
    ) { }
  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token.getToken(),
      // 'skip': 'true',
    }),
  };

  getStudents(deptId = ''): Observable<any[]> {
    if (deptId != '') return this.getStudentsInDepartment(deptId);
    return this.http
      .get<any[]>(this.apiURL + '/students', this.httpOptions)
  }

  getStudentsInDepartment(departmentId: string): Observable<any>{
    let headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'accept': 'application/json',
        'Authorization': 'Bearer ' + this.token.getToken(),
      })
    }
    return this.http
      .get<any>(this.apiURL + `/departments/${departmentId}/students`, headers);
  }

  getVerifiedStudents(): Observable<any[]> {
    return this.http
      .get<any[]>(this.apiURL + '/students/verified', this.httpOptions)
  }

  getStudentPublicProfile(id: string): Observable<any> {
    return this.http
               .get<any>(this.apiURL + `/students/${id}`, this.httpOptions);
  }

  registerUnverifiedStudent(student: any): Observable<any> {
    let headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'accept': 'application/json',
        'Authorization': 'Bearer ' + this.token.getToken(),
      })
    }
    return this.http
      .post<any>(this.apiURL + '/students', JSON.stringify(student), headers)
  }

  verifyStudentAccount(token: string, data: any): Observable<any> {
    let headers = { 
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'accept': 'application/json',
        // 'Authorization': 'Bearer ' + this.token.getToken(),
      })
    };

    return this.http
               .put<any>(this.apiURL + '/students/' + token, JSON.stringify(data), headers);
  }


  handleError(error: any) {
    console.log(error);
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    if (error.status == 422 || error.status == 401){
    }
    console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
  
}
