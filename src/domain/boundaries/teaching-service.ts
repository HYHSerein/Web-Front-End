import { DataResponse } from "~/infrastructure/models/request";
import { OptionItem } from "~/infrastructure/models/base";
import { CourseItem } from "~/domain/models/teaching";
import { CourseSectionItem } from "~/domain/models/teaching";
export interface ITeachingService {
    getCourseList(numName: string | null): Promise<CourseItem[]>;
    courseDelete(courseId: number): Promise<DataResponse>;
    courseSave(data: CourseItem): Promise<DataResponse>;
    getCourseSectionList(numName: string | null): Promise<CourseSectionItem[]>;
    courseSectionDelete(courseSectionId: number): Promise<DataResponse>;
    courseSectionSave(data: CourseSectionItem): Promise<DataResponse>;
    courseSectionPublish(courseSectionId: string): Promise<DataResponse>;
    courseSectionSelect(courseSectionId: number): Promise<DataResponse>;
    courseSectionUnselect(courseSectionId: number): Promise<DataResponse>;
    getStudentItemOptionList(): Promise<OptionItem[]>;
    getCourseItemOptionList(): Promise<OptionItem[]>;
    getScoreList(personId: number | null, courseId: number | null): Promise<[]>;
    scoreSave(scoreId: number | null, personId: number, courseId: number, mark: number): Promise<DataResponse>;
    scoreDelete(scoreId: number): Promise<DataResponse>;
    getTeacherItemOptionList(): Promise<OptionItem[]>;
    getTimeItemOptionList(): Promise<OptionItem[]>;
}