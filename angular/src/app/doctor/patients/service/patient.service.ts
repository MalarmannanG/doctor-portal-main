import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONSTANTS } from "src/app/constants/app-constants";
import { PatientModel } from "../model/patient.model";

@Injectable({ providedIn: 'root' })

export class PatientMasterService {
    
    
    constructor(private http: HttpClient) {
        
    }    
   
    getAll(query = ""): Observable<any> {        
        return this.http.get<any>(`${APP_CONSTANTS.SERVICE_BASE_URL}${APP_CONSTANTS.API.PATIENT}/GetAll${query}`);
    }

    get(id): Observable<any> {        
        return this.http.get<any>(`${APP_CONSTANTS.SERVICE_BASE_URL}${APP_CONSTANTS.API.PATIENT}/Get/${id}`);
    }

    put(model): Observable<any> {
        return this.http.put<any>(`${APP_CONSTANTS.SERVICE_BASE_URL}${APP_CONSTANTS.API.PATIENT}/Update`, model);
    }

    post(model: PatientModel): Observable<any> {
        return this.http.post<any>(`${APP_CONSTANTS.SERVICE_BASE_URL}${APP_CONSTANTS.API.PATIENT}/Create`, model);
    }

    delete(id): Observable<any> {
        return this.http.delete<any>(`${APP_CONSTANTS.SERVICE_BASE_URL}${APP_CONSTANTS.API.PATIENT}/Delete/${id}`);
    }


}