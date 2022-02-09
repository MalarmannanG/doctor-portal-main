import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";

import { AuthService } from "../service/auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let authenticated = localStorage.getItem('token') ? true : false;
    
    if (!authenticated) {
      this.router.navigate(["/authentication/signin"]);
      return authenticated
    }
    
    return authenticated;
  }
}
