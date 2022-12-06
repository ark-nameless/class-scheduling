import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SessionService } from '../services/session.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClassApiService {
  apiURL = environment.API_URL;

  constructor(
    private http: HttpClient, 
    private token: SessionService,
    ) { }
  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token.getToken(),
    }),
  };

  createNewClassSchedule(data: any): Observable<any[]> {
    let headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token.getToken(),
      })
    }
    return this.http
               .post<any>(this.apiURL + '/classes', JSON.stringify(data), headers);
  }

  createNewResponseSchedule(data: any): Observable<any> {
    return this.http
               .post<any>(this.apiURL + `/classes/response-schedule`, JSON.stringify(data), this.httpOptions);
  }

  getClasses(id: string): Observable<any> {
    return this.http
               .get<any>(this.apiURL + `/departments/${id}/classes`, this.httpOptions);
  }

  getClassInfo(id: string): Observable<any> {
    return this.http
               .get<any>(this.apiURL + `/classes/${id}/class-info`, this.httpOptions);
  }

  getClassLoads(id: string): Observable<any> {
    return this.http
               .get<any>(this.apiURL + `/classes/${id}/class-loads`, this.httpOptions);
  }

  getClassStudents(id: string): Observable<any> {
    return this.http
               .get<any>(this.apiURL + `/classes/${id}/class-students`, this.httpOptions);
  }

  getStudentsNotInClass(id: string): Observable<any> {
    return this.http
               .get<any>(this.apiURL + `/classes/${id}/students-not-in-class`, this.httpOptions);
  }

  sendNewScheduleRequest(payload:any): Observable<any> {
    return this.http
               .post<any>(this.apiURL + `/classes/create-schedule-request`, payload, this.httpOptions);
  }
  

  addNewStudentsInClass(id: string, payload:any): Observable<any> {
    return this.http
               .put<any>(this.apiURL + `/classes/${id}/add-students`, payload, this.httpOptions);
  }
  updateClassInfo(id: string, payload:any): Observable<any> {
    return this.http
               .put<any>(this.apiURL + `/classes/${id}/class-info`, payload, this.httpOptions);
  }
  
  updateSchedule(id: string, payload:any): Observable<any> {
    return this.http
               .put<any>(this.apiURL + `/classes/${id}/update-subject-schedule`, payload, this.httpOptions);
  }

  updateSubjectInfo(id: string, payload:any): Observable<any> {
    return this.http
               .put<any>(this.apiURL + `/classes/${id}/update-subject-info`, payload, this.httpOptions);
  }

  updateClassLoads(id: string, payload: any): Observable<any> {
    return this.http
               .put<any>(this.apiURL + `/classes/${id}/class-loads`, payload, this.httpOptions);
  }


  removeStudentsFromClass(id: string, payload:any): Observable<any> {
    return this.http
               .put<any>(this.apiURL + `/classes/${id}/remove-students`, payload, this.httpOptions);
  }

  archiveClass(id: string): Observable<any> {
    return this.http
               .delete<any>(this.apiURL + `/classes/${id}/archive`, this.httpOptions);
  }

  removeClassLoad(classId: string, id: string): Observable<any> {
    return this.http
               .delete<any>(this.apiURL + `/classes/${classId}/class-load/${id}/delete`, this.httpOptions);
  }







}
