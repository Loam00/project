import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor( private AuthService: AuthService, private router: Router) { }

  canActivate(): Observable<boolean> {
    if(!this.AuthService.isUserLoggedIn$.value) {
      this.router.navigate(["login"]);
    }
    return this.AuthService.isUserLoggedIn$;
  }
}
