import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoadingService } from './loading-services';

@Component({
    selector: 'app-my-loader',
    templateUrl: './custome.loader.component.html',
    styleUrls: ['./custome.loader.component.css']
})
export class MyLoaderComponent implements OnInit {

    loading: boolean;

    constructor(private loaderService: LoadingService, private cdRef:ChangeDetectorRef) {
       

    }
    ngOnInit() {
        this.loaderService.isLoading.subscribe((v) => {
            this.loading = v;
            this.cdRef.detectChanges();
        });
    }

}