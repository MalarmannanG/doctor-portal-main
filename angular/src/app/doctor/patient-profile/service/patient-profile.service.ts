import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONSTANTS } from "src/app/constants/app-constants";
import { PatientProfileModel } from "../model/patient-profile.model.service";


@Injectable({ providedIn: 'root' })

export class PatientProfileService {


    constructor(private http: HttpClient) {

    }

    getMedicines(query = ""): Observable<any> {
        return this.http.get<any>(`${APP_CONSTANTS.SERVICE_BASE_URL}${APP_CONSTANTS.API.PRESCRIPTION_MASTER}/GetAll${query}`);
    }

    getAll(query = ""): Observable<any> {
        return this.http.get<any>(`${APP_CONSTANTS.SERVICE_BASE_URL}${APP_CONSTANTS.API.PATIENT_PROFILE}/GetAll${query}`);
    }
    GetAllInActive(query = ""): Observable<any> {
        return this.http.get<any>(`${APP_CONSTANTS.SERVICE_BASE_URL}${APP_CONSTANTS.API.PATIENT_PROFILE}/GetAllInActive${query}`);
    }
    get(id): Observable<any> {
        return this.http.get<any>(`${APP_CONSTANTS.SERVICE_BASE_URL}${APP_CONSTANTS.API.PATIENT_PROFILE}/Get/${id}`);
    }
    getByPatient(id): Observable<any> {
        return this.http.get<any>(`${APP_CONSTANTS.SERVICE_BASE_URL}${APP_CONSTANTS.API.PATIENT_PROFILE}/GetByPatient/${id}`);
    }
    put(model): Observable<any> {
        return this.http.put<any>(`${APP_CONSTANTS.SERVICE_BASE_URL}${APP_CONSTANTS.API.PATIENT_PROFILE}/Update`, model);
    }

    post(model: PatientProfileModel): Observable<any> {
        return this.http.post<any>(`${APP_CONSTANTS.SERVICE_BASE_URL}${APP_CONSTANTS.API.PATIENT_PROFILE}/Create`, model);
    }

    delete(id): Observable<any> {
        return this.http.delete<any>(`${APP_CONSTANTS.SERVICE_BASE_URL}${APP_CONSTANTS.API.PATIENT_PROFILE}/Delete/${id}`);
    }

    getAllUsers(query = ""): Observable<any> {
        return this.http.get<any>(`${APP_CONSTANTS.SERVICE_BASE_URL}${APP_CONSTANTS.API.USERS}/GetAll${query}`);
    }
    getAllComplaints(): Observable<any> {
        return this.http.get<any>(`${APP_CONSTANTS.SERVICE_BASE_URL}${APP_CONSTANTS.API.PATIENT_PROFILE}/GetAllComplaints`);
    }

}