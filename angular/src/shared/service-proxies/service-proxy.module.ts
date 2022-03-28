//import { AbpHttpInterceptor, RefreshTokenService, AbpHttpConfigurationService } from 'abp-ng2-module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { JwtInterceptor } from 'src/app/core/interceptor/jwt.interceptor';
import * as ApiServiceProxies from './service-proxies';

@NgModule({
    providers: [
        ApiServiceProxies.AccessRightsController,        
        ApiServiceProxies.AccountController,        
        ApiServiceProxies.AppointmentController,        
        ApiServiceProxies.DepartmentMasterController,        
        ApiServiceProxies.DiagnosisMasterController,        
        ApiServiceProxies.DoctorMasterController,        
        ApiServiceProxies.PatientMasterController,        
        ApiServiceProxies.PatientProfileController,        
        ApiServiceProxies.PrescriptionMasterController,        
        ApiServiceProxies.TemplateMasterController,
        ApiServiceProxies.TestMasterController,        
        ApiServiceProxies.UserController,        
        ApiServiceProxies.VitalsReportController,     
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
    ]
})
export class ServiceProxyModule { }
