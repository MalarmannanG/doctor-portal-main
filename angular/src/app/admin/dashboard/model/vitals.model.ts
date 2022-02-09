import { AppoinemtModel } from "../../appointment/model/appointmentt.model";

export class VitalsReportModel {
    constructor() {
        this.patientFiles = [];
        this.patientNewFiles = [];
    }

    id: number;
    appointmentID: number;
    patientID: number;
    height: number;
    weight: number;
    bloodPresure: number;
    pulse: number;
    temprature: number;
    spO2: number;
    isActive: boolean;
    createdDate: any;
    createdBy: number;
    updatedDate: any;
    updatedBy: number;
    patientFiles: PatientFilesModel[];
    patientNewFiles: PatientNewFilesModel[];
    appointment: AppoinemtModel;
}

export class PatientFilesModel {
    id: number;
    appointmentID: number;
    patientID: number;   
    fileName: string;
    filePath: string;
    isDeleted: boolean;
    createdDate: any;
    createdBy: number;
    updatedDate: any;
    updatedBy: number;
}

export class PatientNewFilesModel {    
    fileName: string;
    base64String: string;
}