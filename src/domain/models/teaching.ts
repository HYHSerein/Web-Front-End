import { Option } from "element-plus/es/components/select-v2/src/select.types";
import { OptionItem } from "~/infrastructure/models/base";

//用于课程数据信息的定义
export interface CourseItem {
    courseId: number;
    num: string;
    name: string;
    credit: number;
    coursePath: string;
    preCourse: string;
    preCourseId: number;
}

export interface CourseData {
    numName: string;
    dataList: CourseItem[];
    courseSelectList: OptionItem[];
    currentIndex: number;
}
export interface ScoreItem {
    scoreId: number;
    personId: number;
    courseId: number;
    studentNum: string;
    studentName: string;
    courseNum: string;
    courseName: string;
    credit: number;
    mark: number;
    ranking: number;
}
export interface ScoreData {
    personId: number;
    courseId: number;
    dataList: ScoreItem[];
    studentList: OptionItem[];
    courseList: OptionItem[];
}

export interface CourseSectionItem {
    courseSectionId: number;
    num: string;
    optional: boolean;
    place: string;
    teacherId: number;
    teacherName: string;
    courseId: number;
    courseName: string;
    time: number;
    status: boolean;
}
export interface CourseSectionData {
    num: string;
    dataList: CourseSectionItem[];
    courseSectionSelectList: OptionItem[];
    teacherSelectList: OptionItem[];
    courseSelectList: OptionItem[];
    timeSelectList: OptionItem[];
    currentIndex: number;
}
// 在 teaching.ts 或相关类型文件中
export interface HonorItem {
    honorId: number;
    personId: number;
    honorName: string;
    honorLevel: string;
    awardTime: string;
    awardUnit: string;
    description: string;
    studentNum?: string;
    studentName?: string;
    className?: string;
}

export interface HonorData {
    personId: number;
    honorLevel: string;
    studentList: OptionItem[];
    honorLevelList: OptionItem[];
    dataList: HonorItem[];
}
//用于志愿者活动数据信息的定义
export interface VolunteerHoursItem {
    volunteerId: number;
    personId: number;
    studentNum: string;
    studentName: string;
    className: string;
    activityName: string;
    hours: number;
    activityDate: string;
    organization: string;
    description: string;
    status: string;
}

export interface VolunteerHoursData {
    numName: string;
    dataList: VolunteerHoursItem[];
    studentList: OptionItem[];
}

export interface StudentCourseSectionItem {
    studentCourseSectionId: number;
    courseSectionId: number;
    personId: number;
    time: number;       // 三位整数 1d0s
    teacherName: string;
    place: string;
    courseName: string;
}