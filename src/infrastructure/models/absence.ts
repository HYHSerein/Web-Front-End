import { OptionItem } from "~/infrastructure/models/base";
export interface AbsenceData {//表里面所有的数据
numName:string;
dataList:AbsenceItem[];//表中的所有的数据，每一个代表一行数据
absenceSelectList:OptionItem[];//所有的下拉框，每一个代表下拉框的一个选项
currentIndex:number;
}
export interface AbsenceItem {//和数据库的表对应
    absenceId:number;
    student:string;
    studentId:number;
    teacher: string;
    teacherId:number;
    beginTime: string;
    endTime: string;
    absenceType: string;
    absenceReason: string;
    result: string;
}
export interface teacherRequest {
    result:string;
}
export interface teacherAbsenceItem {
    studentName: string;
    absenceBegin: string;
    absenceEnd: string;
    absenceType: string;
    absenceReason: string;
    approveStatus: string;
}