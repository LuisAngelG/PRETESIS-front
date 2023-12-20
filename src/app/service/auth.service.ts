import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

  login(email: String, password: String): Observable<any>{
    return this.http.post(
      AUTH_API + 'signin',{
        email,
        password
      },
      httpOptions
    )
  }

  register(username: string, email: string, password: string): Observable<any>{
    return this.http.post(
      AUTH_API + 'signup',
      {
        username,
        email,
        password
      },
      httpOptions
    )
  }

  loguot(): Observable<any>{
    return this.http.post(AUTH_API + 'signout', { }, httpOptions)
  }
}
