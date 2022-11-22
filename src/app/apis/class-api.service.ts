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
}
