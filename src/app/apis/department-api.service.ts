import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SessionService } from '../services/session.service';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartmentApiService {
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

  getDepartments(): Observable<any[]> {
    return this.http
      .get<any[]>(this.apiURL + '/departments', this.httpOptions)
  }
}
