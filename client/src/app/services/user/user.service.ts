import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { User } from 'src/app/models/user';
import { USER_KEY } from 'src/app/constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  loggedInUser$ = new Subject()
  private BASE_URL = 'http://localhost:8000/api/user'

  constructor(private http: HttpClient) { }

  editUser(data: User): Observable<User> {
    return this.http.put<User>(`${this.BASE_URL}/${data._id}`, data)
  }

  getUserStorage(): User {
    const userJSON: any = localStorage.getItem(USER_KEY)
    return JSON.parse(userJSON)
  }
}
