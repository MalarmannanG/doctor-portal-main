import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { APP_CONSTANTS } from "src/app/constants/app-constants";
import { Role } from "src/app/core/models/role";
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
              if(user.role == Role.Admin)
              user.img = "assets/images/user/admin_1.png";
              else if(user.role == Role.Doctor)
              user.img = "assets/images/user/doctor.png";
              else if(user.role == Role.Patient)
              user.img = "assets/images/user/patient.png";
              localStorage.setItem("currentUser", JSON.stringify(user));
              this.currentUserSubject.next(user);
              return user;
            })
          );;
    }


}