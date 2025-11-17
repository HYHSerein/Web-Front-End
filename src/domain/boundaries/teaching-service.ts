import { DataResponse } from "~/infrastructure/models/request";
import { OptionItem } from "~/infrastructure/models/base";
import { CourseItem } from "~/domain/models/teaching";
import { HonorItem } from "~/domain/models/teaching";
export interface ITeachingService {
    getCourseList(numName: string | null): Promise<CourseItem[]>;
    courseDelete(courseId: number): Promise<DataResponse>;
    courseSave(data: CourseItem): Promise<DataResponse>;
    getStudentItemOptionList(): Promise<OptionItem[]>;
    getCourseItemOptionList(): Promise<OptionItem[]>;
    getHonorLevelOptionList(): Promise<OptionItem[]>;
    getScoreList(personId: number | null, courseId: number | null): Promise<[]>;
    scoreSave(scoreId: number | null, personId: number, courseId: number, mark: number): Promise<DataResponse>;
    scoreDelete(scoreId: number): Promise<DataResponse>;
    getHonorList(personId: number | null, honorLevel: string | null): Promise<HonorItem[]>;
    honorSave(honorId: number | null, personId: number, honorName: string, honorLevel: string, awardTime: string, awardUnit?: string, description?: string): Promise<DataResponse>;
    honorDelete(honorId: number): Promise<DataResponse>;
}