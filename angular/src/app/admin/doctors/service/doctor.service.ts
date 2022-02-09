import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONSTANTS } from "src/app/constants/app-constants";
import { DoctorModel } from "../model/doctor.model.service";

@Injectable({ providedIn: 'root' })

export class DoctorService {
    
    
    constructor(private http: HttpClient) {
        
    }    
   
    getAll(query = ""): Observable<any> {        
        return this.http.get<any>(`${APP_CONSTANTS.SERVICE_BASE_URL}${APP_CONSTANTS.API.DOCTOR}/GetAll${query}`);
    }

    get(id): Observable<any> {        
        return this.http.get<any>(`${APP_CONSTANTS.SERVICE_BASE_URL}${APP_CONSTANTS.API.DOCTOR}/Get/${id}`);
    }

    put(model): Observable<any> {
        return this.http.put<any>(`${APP_CONSTANTS.SERVICE_BASE_URL}${APP_CONSTANTS.API.DOCTOR}/Update`, model);
    }

    post(model: DoctorModel): Observable<any> {
        return this.http.post<any>(`${APP_CONSTANTS.SERVICE_BASE_URL}${APP_CONSTANTS.API.DOCTOR}/Create`, model);
    }

    delete(id): Observable<any> {
        return this.http.delete<any>(`${APP_CONSTANTS.SERVICE_BASE_URL}${APP_CONSTANTS.API.DOCTOR}/Delete/${id}`);
    }

    getAllUsers(query = ""): Observable<any> {        
        return this.http.get<any>(`${APP_CONSTANTS.SERVICE_BASE_URL}${APP_CONSTANTS.API.USERS}/GetAll${query}`);
    }


}