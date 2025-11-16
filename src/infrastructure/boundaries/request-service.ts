import { LoginRequest, JwtResponse } from "../models/login";
//import {Course ,CourseListResponse,CourseRequest,CourseResponse} from"../models/course";
export interface IRequestService {
  getAuthHeader(): any
  generalRequest(url: string, data: any | null): Promise<any>
  jwtRequest(
    jwt: string,
    url: string,
    data: any | null
  ): Promise<any>
  uploadRequest(
    url: string,
    data: any | null
  ): Promise<any>
  downloadPost(url: string, label: string, data: any): Promise<any>
  getPdfData(url: string, data: any): Promise<string>
  doExport(url: string, fileName: string, data: any): Promise<any>
  getAuthHeader(): any;
  generalRequest(url: string, data: any | null,header:any): Promise<any>;//这是修改后的
  jwtRequest(jwt: string, url: string, data: any | null): Promise<any>;
  uploadRequest(url: string, data: any | null): Promise<any>;
  downloadPost(url: string, label: string, data: any): Promise<any>;
  getPdfData(url: string, data: any): Promise<string>;
  doExport(url: string, fileName: string, data: any): Promise<any>;

  /*// 新增课程相关方法
  getCourseList(): Promise<CourseListResponse>;
  addCourse(course: CourseRequest): Promise<CourseResponse>;
  deleteCourse(courseId: number): Promise<{ code: number; message: string }>;*/
}