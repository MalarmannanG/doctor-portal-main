import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { APP_CONSTANTS } from "src/app/constants/app-constants";
import { User } from "src/app/core/models/user";
import { LoginRequestModel } from "../model/auth.model";

@Injectable({ providedIn: 'root' })

export class AccountService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    
    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(
            JSON.parse(localStorage.getItem("currentUser"))
          );
          this.currentUser = this.currentUserSubject.asObservable();
    }   
    public get currentUserValue(): User {
        return this.currentUserSubject.value;
      }
    
    login(model: LoginRequestModel): Observable<any> {
        return this.http.post<any>(`${APP_CONSTANTS.SERVICE_BASE_URL}${APP_CONSTANTS.API.LOGIN}`, model)
        .pipe(
            map((user) => {
              // store user details and jwt token in local storage to keep user logged in between page refreshes
              console.log(user)
              localStorage.setItem("currentUser", JSON.stringify(user));
              this.currentUserSubject.next(user);
              return user;
            })
          );;
    }


}