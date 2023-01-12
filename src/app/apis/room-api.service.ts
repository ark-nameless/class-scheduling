import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionService } from '../services/session.service';

@Injectable({
  providedIn: 'root'
})
export class RoomApiService {
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

  getAllUsedRooms(): Observable<any> {
    return this.http.get<any>(this.apiURL + `/rooms`);
  }

  getRoomSchedules(name: string): Observable<any> {
    return this.http.get<any>(this.apiURL + `/rooms/schedules/${name}`);
  }
}
