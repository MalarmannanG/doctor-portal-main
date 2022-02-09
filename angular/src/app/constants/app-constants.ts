import { environment } from "src/environments/environment";

export const APP_CONSTANTS = {
    SERVICE_BASE_URL: environment.apiUrl,

    API: {
        USERS: '/Api/User',
        LOGIN: '/Api/Account/Login',
        DOCTOR: '/Api/DoctorMaster',
        TEMPLATE_MASTER: '/Api/TemplateMaster',
        PATIENT_PROFILE: '/Api/PatientProfile',
        DIAGNOSIS_MASTER: '/Api/DiagnosisMaster',
        TEST_MASTER: '/Api/TestMaster',
        PATIENT: '/Api/PatientMaster',
        APPOINTMENT: '/Api/Appointment',
        POP_USERS: '/Api/Account/Users',
        VITALS: '/Api/VitalsReport',
        PRESCRIPTION_MASTER: '/Api/PrescriptionMaster'
    }
}