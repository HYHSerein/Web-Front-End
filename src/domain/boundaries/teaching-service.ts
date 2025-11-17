import { DataResponse } from "~/infrastructure/models/request";
import { OptionItem } from "~/infrastructure/models/base";
import { CourseItem, VolunteerHoursItem } from "~/domain/models/teaching";
export interface ITeachingService {
    getCourseList(numName: string | null): Promise<CourseItem[]>;
    courseDelete(courseId: number): Promise<DataResponse>;
    courseSave(data: CourseItem): Promise<DataResponse>;
    getStudentItemOptionList(): Promise<OptionItem[]>;
    getCourseItemOptionList(): Promise<OptionItem[]>;
    getScoreList(personId: number | null, courseId: number | null): Promise<[]>;
    scoreSave(scoreId: number | null, personId: number, courseId: number, mark: number): Promise<DataResponse>;
    scoreDelete(scoreId: number): Promise<DataResponse>;
    // 志愿者活动管理接口
    getVolunteerHoursList(numName: string | null): Promise<VolunteerHoursItem[]>;
    volunteerHoursDelete(volunteerId: number): Promise<DataResponse>;
    volunteerHoursSave(data: VolunteerHoursItem): Promise<DataResponse>;
}