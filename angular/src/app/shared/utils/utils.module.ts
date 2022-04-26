import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BusyIfDirective } from './busy-if.directive';
import { ValidationMessagesComponent } from './validation-messages.component';
import { EqualValidator } from './validation/equal-validator.directive';
import { PasswordComplexityValidator } from './validation/password-complexity-validator.directive';
//import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

@NgModule({
    imports: [
        CommonModule,
        //Ng4LoadingSpinnerModule.forRoot()
    ],
    providers: [
         
    ],
    declarations: [
        EqualValidator,
        PasswordComplexityValidator,
        BusyIfDirective,
        ValidationMessagesComponent,
    ],
    exports: [
        EqualValidator,
        PasswordComplexityValidator,
        BusyIfDirective,
        ValidationMessagesComponent,
    ]
})
export class UtilsModule { }
