import { DataResponse } from "~/infrastructure/models/request";
import { OptionItem } from "~/infrastructure/models/base";
import { CourseItem } from "~/domain/models/teaching";
import { CourseSectionItem } from "~/domain/models/teaching";
import { HonorItem } from "~/domain/models/teaching";
import { IRequestService } from "~/infrastructure/boundaries/request-service";
import { ITeachingService } from "~/domain/boundaries/teaching-service";
import { ID_REQUEST_SERVICE, } from "~/types";
import { inject, injectable } from "inversify";
import { TeacherItem } from "../models/person";
import { imageEmits } from "element-plus";
@injectable()
export class TeachingServiceImpl implements ITeachingService {
    constructor(
        @inject(ID_REQUEST_SERVICE) private readonly requestService: IRequestService
    ) { }

    public async getCourseList(
        numName: string | null
    ): Promise<CourseItem[]> {
        const res = await this.requestService.generalRequest("/api/course/getCourseList", {
            numName: numName,
        });
        return res.data as CourseItem[];
    }
    //删除课程后台数据请求方法
    public async courseDelete(courseId: number): Promise<DataResponse> {
        const res = await this.requestService.generalRequest("/api/course/courseDelete", {
            courseId: courseId,
        });
        return res as DataResponse;
    }
    //课程保存后台数据请求方法
    public async courseSave(data: CourseItem): Promise<DataResponse> {
        const res = await this.requestService.generalRequest("/api/course/courseSave", data);
        return res as DataResponse;
    }
    //获取学生选择项列表后台数据请求方法
    public async getStudentItemOptionList(): Promise<OptionItem[]> {
        const res = await this.requestService.generalRequest("/api/score/getStudentItemOptionList", null);
        return res.itemList as OptionItem[];
    }
    // //获取课程选择项列表后台数据请求方法
    // public async getCourseItemOptionList(): Promise<OptionItem[]> {
    //     const res = await this.requestService.generalRequest("/api/course/getCourseItemOptionList", null);
    //     return res.itemList as OptionItem[];
    // }
    //获取成绩列表后台数据请求方法
    public async getScoreList(
        personId: number | null,
        courseId: number | null
    ): Promise<[]> {
        const res = await this.requestService.generalRequest("/api/score/getScoreList", {
            personId: personId,
            courseId: courseId,
        });
        return res.data as [];
    }
    //成绩保存后台数据请求方法
    public async scoreSave(
        scoreId: number | null,
        personId: number,
        courseId: number,
        mark: number
    ): Promise<DataResponse> {
        const res = await this.requestService.generalRequest("/api/score/scoreSave", {
            scoreId: scoreId,
            personId: personId,
            courseId: courseId,
            mark: mark,
        });
        return res as DataResponse;
    }
    //成绩删除后台数据请求方法
    public async scoreDelete(scoreId: number): Promise<DataResponse> {
        const res = await this.requestService.generalRequest("/api/score/scoreDelete", {
            scoreId: scoreId,
        });
        return res as DataResponse;
    }

    public async getCourseItemOptionList(): Promise<OptionItem[]> {
        const res = await this.requestService.generalRequest("/api/course/getCourseItemOptionList", null);
        console.log(res.data);
        return res.itemList as OptionItem[];
    }

    public async getCourseSectionList(
        numName: string | null
    ): Promise<CourseSectionItem[]> {
        const res = await this.requestService.generalRequest("/api/courseSection/getCourseSectionList", {
            numName: numName,
        });
        return res.data as CourseSectionItem[];
    }

    public async courseSectionSave(data: CourseSectionItem): Promise<DataResponse> {
        const res = await this.requestService.generalRequest("/api/courseSection/courseSectionSave", data);
        return res as DataResponse;
    }

    public async courseSectionDelete(courseSectionId: number): Promise<DataResponse> {
        const res = await this.requestService.generalRequest("/api/courseSection/courseSectionDelete", {
            courseSectionId: courseSectionId,
        });
        return res as DataResponse;
    }
    // 志愿者活动管理实现
    //获取志愿者活动列表后台数据请求方法
    public async getVolunteerHoursList(numName: string | null): Promise<any[]> {
        const res = await this.requestService.generalRequest("/api/volunteer/getVolunteerHoursList", {
            nameOrNum: numName,
        });
        return res.data as any[];
    }

    //删除志愿者活动后台数据请求方法
    public async volunteerHoursDelete(volunteerId: number): Promise<DataResponse> {
        const res = await this.requestService.generalRequest("/api/volunteer/volunteerHoursDelete", {
            volunteerId: volunteerId,
        });
        return res as DataResponse;
    }

    public async courseSectionPublish(num: string): Promise<DataResponse> {
        const res = await this.requestService.generalRequest("/api/courseSection/courseSectionPublish", {
            num: num,
        });
        return res as DataResponse;
    }
    //志愿者活动保存后台数据请求方法
    public async volunteerHoursSave(data: any): Promise<DataResponse> {
        const res = await this.requestService.generalRequest("/api/volunteer/volunteerHoursSave", {
            form: data
        });
        return res as DataResponse;
    }

    public async courseSectionSelect(courseSectionId: number): Promise<DataResponse> {
        const res = await this.requestService.generalRequest("/api/courseSection/courseSectionSelect", {
            courseSectionId: courseSectionId,
        });
        return res as DataResponse;
    }

    public async courseSectionUnselect(courseSectionId: number): Promise<DataResponse> {
        const res = await this.requestService.generalRequest("/api/courseSection/courseSectionUnselect", {
            courseSectionId: courseSectionId,
        });
        return res as DataResponse;
    }

    public async getTeacherItemOptionList(): Promise<OptionItem[]> {
        const res = await this.requestService.generalRequest("/api/courseSection/getTeacherItemOptionList", null);
        return res.itemList as OptionItem[];
    }

    public async getTimeItemOptionList(): Promise<OptionItem[]> {
        const res = await this.requestService.generalRequest("/api/courseSection/getTimeItemOptionList", null);
        return res.itemList as OptionItem[];
    }
    public async getHonorList(
        personId: number | null,
        honorLevel: string | null
    ): Promise<HonorItem[]> {
        console.log("【TeachingService】getHonorList 调用参数:", { personId, honorLevel });

        const res = await this.requestService.generalRequest("/api/honor/getHonorList", {
            personId: personId,
            honorLevel: honorLevel,
        });

        console.log("【TeachingService】generalRequest 返回:", res);
        console.log("【TeachingService】返回的 data:", res.data);
        console.log("【TeachingService】返回的 data 类型:", typeof res.data);
        console.log("【TeachingService】返回的 data 长度:", Array.isArray(res.data) ? res.data.length : '不是数组');

        if (Array.isArray(res.data)) {
            console.log("【TeachingService】第一条数据:", res.data[0]);
        }

        return res.data as HonorItem[];
    }


    // 荣誉保存后台数据请求方法
    public async honorSave(
        honorId: number | null,
        personId: number,
        honorName: string,
        honorLevel: 'national' | 'provincial' | 'municipal' | 'school' | 'college',
        awardTime: string,
        awardUnit?: string,
        description?: string
    ): Promise<DataResponse> {
        const res = await this.requestService.generalRequest("/api/honor/honorSave", {
            honorId: honorId,
            personId: personId,
            honorName: honorName,
            honorLevel: honorLevel,
            awardTime: awardTime,
            awardUnit: awardUnit,
            description: description,
        });
        return res as DataResponse;
    }

    // 荣誉删除后台数据请求方法
    public async honorDelete(honorId: number): Promise<DataResponse> {
        const res = await this.requestService.generalRequest("/api/honor/honorDelete", {
            honorId: honorId,
        });
        return res as DataResponse;
    }
    public async getHonorLevelOptionList(): Promise<OptionItem[]> {
        const res = await this.requestService.generalRequest("/api/honor/getHonorLevelOptionList", null);
        return res.itemList as OptionItem[];
    }
}