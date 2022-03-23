import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONSTANTS } from "src/app/constants/app-constants";
import { AppUserModel } from "../model/user.model";

@Injectable({ providedIn: 'root' })
export class UserMasterService {
    
    
    constructor(private http: HttpClient) {
        
    }    
   
    getAll(query = ""): Observable<any> {        
        return this.http.get<any>(`${APP_CONSTANTS.SERVICE_BASE_URL}${APP_CONSTANTS.API.USERS}/GetAll${query}`);
    }

    get(id): Observable<any> {        
        return this.http.get<any>(`${APP_CONSTANTS.SERVICE_BASE_URL}${APP_CONSTANTS.API.USERS}/Get/${id}`);
    }

    put(model: AppUserModel): Observable<any> {
        return this.http.put<any>(`${APP_CONSTANTS.SERVICE_BASE_URL}${APP_CONSTANTS.API.USERS}/Update`, model);
    }

    post(model: AppUserModel): Observable<any> {
        return this.http.post<any>(`${APP_CONSTANTS.SERVICE_BASE_URL}${APP_CONSTANTS.API.USERS}/Create`, model);
    }

    delete(id): Observable<any> {
        return this.http.delete<any>(`${APP_CONSTANTS.SERVICE_BASE_URL}${APP_CONSTANTS.API.USERS}/Delete/${id}`);
    }
    getAllSpecialization(name): Observable<any> {
        return this.http.get<any>(`${APP_CONSTANTS.SERVICE_BASE_URL}${APP_CONSTANTS.API.USERS}/GeAllSpecialization`);
    }

}