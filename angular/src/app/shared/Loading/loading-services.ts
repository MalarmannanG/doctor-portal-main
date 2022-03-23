import { Injectable } from '@angular/core';
 
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class LoadingService {
    public isLoading = new BehaviorSubject(false);
    constructor() {

    }
    setLoading(value) {
         this.isLoading.next(value);
    }
    
    getLoadingStatus() : Observable<boolean>
    {
       return this.isLoading.asObservable();
    }

}