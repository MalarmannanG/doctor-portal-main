import { PatientFilesModel, VitalsReportModel } from "../../dashboard/model/vitals.model";
import { PatientModel } from "../../patients/model/patient.model";

export class AppoinemtModel {
    constructor() {
        this.patient = new PatientModel();
        this.patientFiles = [];
    }
    id: number;
    patientId: number;
    patientName: string;
    consultingDoctorID: number;
    consultingDoctorName: string;
    visitType: string;
    isActive : boolean;
    dayOrNight: string;
    timeOfAppintment: string;
    appointmentDateTime: any;
    appointmentISOString : string;
    description: number;
    referredBy : string;
    patient: PatientModel;
    patientFiles: PatientFilesModel[];
    vitalsReportModel: VitalsReportModel;
    isOpened: boolean;
}