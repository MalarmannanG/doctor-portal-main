import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONSTANTS } from "src/app/constants/app-constants";
import { TestMasterModel } from "../model/test-master.model.service";


@Injectable({ providedIn: 'root' })

export class TestMasterService {
    
    
    constructor(private http: HttpClient) {
        
    }    
   
    getAll(query = ""): Observable<any> {        
        return this.http.get<any>(`${APP_CONSTANTS.SERVICE_BASE_URL}${APP_CONSTANTS.API.TEST_MASTER}/GetAll${query}`);
    }

    get(id): Observable<any> {        
        return this.http.get<any>(`${APP_CONSTANTS.SERVICE_BASE_URL}${APP_CONSTANTS.API.TEST_MASTER}/Get/${id}`);
    }

    put(model: TestMasterModel): Observable<any> {
        return this.http.put<any>(`${APP_CONSTANTS.SERVICE_BASE_URL}${APP_CONSTANTS.API.TEST_MASTER}/Update`, model);
    }

    post(model: TestMasterModel): Observable<any> {
        return this.http.post<any>(`${APP_CONSTANTS.SERVICE_BASE_URL}${APP_CONSTANTS.API.TEST_MASTER}/Create`, model);
    }

    delete(id): Observable<any> {
        return this.http.delete<any>(`${APP_CONSTANTS.SERVICE_BASE_URL}${APP_CONSTANTS.API.TEST_MASTER}/Delete/${id}`);
    }

    getAllUsers(query = ""): Observable<any> {        
        return this.http.get<any>(`${APP_CONSTANTS.SERVICE_BASE_URL}${APP_CONSTANTS.API.TEST_MASTER}/GetAll${query}`);
    }


}