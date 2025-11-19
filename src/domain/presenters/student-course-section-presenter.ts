import { inject, injectable } from 'inversify';
import { ID_TEACHING_SERVICE } from '~/types';
import { ITeachingService } from '~/domain/boundaries/teaching-service';
import type { CourseItem } from '~/domain/models/teaching';

export interface CourseTableCell {
    dayKey: string;   // mon/tue/...
    sectionIdx: number; // 0-4
    courseName: string; // 课程名（可扩展）
    place: string;
    teacherName: string;
}

export interface CourseTableData {
    table: CourseTableCell[];
}

@injectable()
export class StudentCourseSectionPresenter {
    constructor(
        @inject(ID_TEACHING_SERVICE)
        private readonly teachingService: ITeachingService
    ) { }

    /* 工具：把 time 拆成 星期+节次 */
    private parseTime(t: number): { dayKey: string; sectionIdx: number } {
        const d = Math.floor(t / 100); // 1-7
        const s = t % 10;              // 1-5
        const map = ['', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        return { dayKey: map[d], sectionIdx: s - 1 };
    }

    /* 主入口：加载并转成前端直接用的格子数组 */
    public async load(data: CourseTableData): Promise<void> {
        const list = await this.teachingService.getStudentCourseSectionList();

        data.table = list.map(item => {
            const { dayKey, sectionIdx } = this.parseTime(item.time ?? 0);
            return {
                dayKey,
                sectionIdx,
                courseName: `${item.courseName}`, // 可再查 courseName
                place: `${item.place}`,
                teacherName: `${item.teacherName}`,
            };
        });
    }
}