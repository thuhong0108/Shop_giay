import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { USER_KEY } from '../../constants';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedInUser = new Subject()
  private BASE_URL = 'http://localhost:8000/api/auth'

  constructor(private http: HttpClient) { }

  signUp(data: any): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/signup`, data)
  }

  login(data: any): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/login`, data)
  }

  getUserStorage(): User {
    const userJSON: any = localStorage.getItem(USER_KEY)
    return JSON.parse(userJSON)
  }
}

