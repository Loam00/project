import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../models/User';
import { ErrorHandlerService } from './error-handler.service';

import { Observable, BehaviorSubject } from 'rxjs'
import { first, catchError, tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = "http://localhost:3000/auth";

  isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
  userId: Pick<User, "id_user">

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private router: Router) { }

  register(user: Omit<User, "id">): Observable<User> {
    console.log(user);
    return this.http.post<User>(`${this.url}/register`, user, this.httpOptions).pipe(
      first(),
      catchError(this.errorHandlerService.handleError<User>("register"))
      )
  }

  login(
    email: Pick<User, "email">,
    password: Pick<User, "password">
    ): Observable<{
    userId: Pick<User, "id_user">;
  }> {
    return this.http
    .post(`${this.url}/login`, { email, password }, this.httpOptions)
    .pipe(
      first(Object),
      tap((Logger: { userId: Pick<User, "id_user">}) => {
        this.userId = Logger.userId;
        this.isUserLoggedIn$.next(true);
        this.router.navigate(["home"]);
      }),
      catchError(this.errorHandlerService.handleError<{
        userId: Pick<User, "id_user">
      }>("login"))
    )
  }
}
