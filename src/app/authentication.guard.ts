import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { LoggedInCheckService } from './logged-in-check.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
	constructor(private user : LoggedInCheckService)	
	{}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
  	//console.log("In auth guard" + this.user.isLoggedInState);
    return this.user.isLoggedInState;
  }
}
