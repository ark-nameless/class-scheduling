import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionService } from '../services/session.service';


@Injectable({
  providedIn: 'root'
})
export class TeacherApiService {
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

  getAllTeachers(deptId=''): Observable<any[]> {
    if (deptId != '') return this.getTeacherPerDepartment(deptId);
    return this.http
      .get<any[]>(this.apiURL + '/teachers', this.httpOptions)
  }

  getNoneDeptHeadTeachers(): Observable<any[]> {
    return this.http
               .get<any[]>(this.apiURL + '/teachers/none-department-head', this.httpOptions);
  }

  registerUnverifiedTeacher(student: any): Observable<any> {
    let headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'accept': 'application/json',
        'Authorization': 'Bearer ' + this.token.getToken(),
      })
    }
    return this.http
      .post<any>(this.apiURL + '/teachers', JSON.stringify(student), headers)
  }

  verifyTeacherInformation(token: string, data: any): Observable<any> {
    let headers = { 
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'accept': 'application/json',
        // 'Authorization': 'Bearer ' + this.token.getToken(),
      })
    };

    return this.http
               .put<any>(this.apiURL + '/teachers/' + token, JSON.stringify(data), headers);
  }

  getTeacherPerDepartment(id: string){
    return this.http
      .get<any[]>(this.apiURL + `/departments/${id}/teachers`, this.httpOptions)
  }

  getTeacherSchedule(id: string){ 
    return this.http
      .get<any[]>(this.apiURL + `/teachers/${id}/subject-loads`, this.httpOptions)    
  }

  getTeacherPublicProfile(id: string): Observable<any> {
    return this.http
               .get<any>(this.apiURL + `/teachers/${id}`, this.httpOptions);
  }

  getTeacherSchedules(id: string): Observable<any> {
    return this.http
               .get<any>(this.apiURL + `/teachers/${id}/schedules`, this.httpOptions)
  }

  getTeacherProfile(id: string): Observable<any> {
    return this.http
               .get<any>(this.apiURL + `/teachers/${id}/profile`, this.httpOptions);
  }

  getTeachingAssigment(id: string): Observable<any> {
    return this.http
               .get<any>(this.apiURL + `/teachers/${id}/teaching-assignment`, this.httpOptions);
  }



  updateCredentials(id: string, payload: any): Observable<any>{
    return this.http
               .put<any>(this.apiURL + `/teachers/${id}/update-credentials`, payload, this.httpOptions);
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
