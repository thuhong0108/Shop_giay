import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private BASE_URL = 'http://localhost:8000/api/auth'

  constructor(private http: HttpClient) { }

  signUp(data: any): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/signup`, data)
  }

  login(data: any): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/login`, data)
  }
}

