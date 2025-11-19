<template>
<div class="main-view-container">
    <div class="main-content">
      <div class="page-header">
        <div class="header-content">
          <div class="header-icon">
            <el-icon><Calendar /></el-icon>
          </div>
          <h2 class="page-title">课程表</h2>
        </div>
      </div>

      <!-- 课表表格 -->
      <div class="table-container">
        <el-table :data="tableData" class="course-table" header-cell-class-name="pretty-header" row-class-name="pretty-row" cell-class-name="pretty-cell">
          <el-table-column label="节次" width="140" align="center">
            <template #default="{ row }">
              <div class="section-cell">
                <div class="section-text">{{ row.section }}</div>
                <div class="time-text">{{ row.time }}</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            v-for="d in weekDays"
            :key="d.key"
            :label="d.label"
            align="center"
            min-width="130"
          >
      <template #default="{ row }">
        <div v-if="row[d.key]" class="course-cell">
          <div class="course-name">{{ row[d.key].name }}</div>
          <div class="course-teacher">{{ row[d.key].teacherName }}</div>
          <div class="course-location">{{ row[d.key].place }}</div>
        </div>
      </template>
    </el-table-column>
  </el-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="StudentCourseSection">
import { container } from '~/inverfiy.config';
import { ref, onMounted } from 'vue'
import { inject } from 'inversify';
import { ID_STUDENT_COURSE_SECTION_PRESENTER } from '~/types';
import { StudentCourseSectionPresenter, CourseTableData } from "~/domain/presenters/student-course-section-presenter";

interface CourseCell {
  name: string;       // 课程名称
  teacherName: string;    // 教师名称
  place: string;   // 上课地点
}

interface Course {
  section: string;
  time: string;
  mon: CourseCell | '';  // 改为对象类型
  tue: CourseCell | '';
  wed: CourseCell | '';
  thu: CourseCell | '';
  fri: CourseCell | '';
  sat: CourseCell | '';
  sun: CourseCell | '';
  [key: string]: CourseCell | '' | string 
}

const sectionTimeMap = [
  '8:00-9:50',   // 第1节（sectionIdx=0）
  '10:10-12:00', // 第2节（sectionIdx=1）
  '14:00-15:50', // 第3节（sectionIdx=2）
  '16:10-18:00', // 第4节（sectionIdx=3）
  '19:00-20:50'  // 第5节（sectionIdx=4）
];

const tableData = ref<Course[]>(
  Array.from({ length: 5 }, (_, i) => ({
    section: `第 ${i + 1} 节`,
    time: sectionTimeMap[i],
    mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: ''
  }))
)

const presenter = container.get<StudentCourseSectionPresenter>(ID_STUDENT_COURSE_SECTION_PRESENTER)


/* ---------- 3. 加载并填充 ---------- */
onMounted(async () => {
  const data: CourseTableData = { table: [] };
  await presenter.load(data);
  console.log(data);

  for (const cell of data.table) {
    const { dayKey, sectionIdx } = cell;
    // 仅保留有效节次（0-4）和有效星期键
    if (sectionIdx >= 0 && sectionIdx < 5) {
      tableData.value[sectionIdx][dayKey] = { 
        name: cell.courseName,
        teacherName: cell.teacherName == 'undefined' ? '暂无教师' : cell.teacherName,
        place: cell.place == 'null' ? '暂无' : (cell.place || '未知地点')
      };
    }
  }
});

const weekDays = [
  { key: 'mon', label: '周一' },
  { key: 'tue', label: '周二' },
  { key: 'wed', label: '周三' },
  { key: 'thu', label: '周四' },
  { key: 'fri', label: '周五' },
  { key: 'sat', label: '周六' },
  { key: 'sun', label: '周日' }
]

function parseTime(t: number): { dayKey: string; sectionIdx: number } {
  const day = Math.floor(t / 100);          // 第 1 位
  const section = t % 10;                   // 第 3 位
  const dayKey = ['', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'][day];
  return { dayKey, sectionIdx: section - 1 }; // sectionIdx 从 0 开始
}
</script>

<style scoped>
.main-view-container {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}
.page-header {
  margin-bottom: 16px;
}
.header-content {
  display: flex;
  align-items: center;
  gap: 8px;
}
.page-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}
.table-container {
  background: #fff;
  padding: 16px;
  border-radius: 4px;
}

.course-table {
  border-radius: 12px;
  overflow: hidden;          /* 让圆角包住表头 */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  background: #ffffff;
}

.pretty-header {
  background: linear-gradient(180deg, #f5f7fa 0%, #e4e7f0 100%);
  color: #3c4043;
  font-weight: 600;
  font-size: 15px;
  height: 48px;
  padding: 0 12px;
  border: none !important;   /* 去掉默认竖线 */
}

.pretty-header .cell {
  justify-content: center;
}

.pretty-row {
  height: 106px;             /* 统一行高 */
  transition: background 0.25s;
}
.pretty-row:hover > td {
  background: #f0f9ff !important;   /* 悬停整行高亮 */
}

/* ---------- 4. 单元格：去掉竖线 + 内部圆角卡片 ---------- */
.pretty-cell {
  border-right: none !important;    /* 无竖线 */
  padding: 8px;
  vertical-align: middle;
}

/* ---------- 5. 节次：左侧彩虹条 + 时间标签 ---------- */
.section-cell {
  height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 12px;
  border-left: 4px solid;           /* 彩虹条 */
  border-radius: 6px 0 0 6px;
  background: #fafbfc;
}
/* 每节课一个颜色 */
.pretty-row:nth-child(1) .section-cell { border-left-color: #ff7b7b; }
.pretty-row:nth-child(2) .section-cell { border-left-color: #ffa94d; }
.pretty-row:nth-child(3) .section-cell { border-left-color: #ffd43b; }
.pretty-row:nth-child(4) .section-cell { border-left-color: #51cf66; }
.pretty-row:nth-child(5) .section-cell { border-left-color: #74c0fc; }

.section-text {
  font-size: 16px;
  font-weight: 600;
  color: #2d3436;
}
.time-text {
  font-size: 12px;
  color: #636e72;
  margin-top: 4px;
}

/* ---------- 6. 课程卡片：柔和阴影 + 圆角 ---------- */
.course-wrapper {
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.course-cell {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}
.course-cell:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.course-name {
  font-size: 14px;
  font-weight: 500;
  color: #2d3436;
  margin-bottom: 4px;
}
.course-teacher,
.course-location {
  font-size: 12px;
  color: #636e72;
}

/* ---------- 7. 去掉最底部横线 ---------- */
.pretty-table::before {
  height: 0;
}

.course-cell {
  display: flex !important; /* 强制flex布局，优先级覆盖Element默认样式 */
  flex-direction: column !important; /* 纵向排列=分行 */
  gap: 6px !important; /* 字段之间的间距（关键：调大到6px，避免拥挤） */
  padding: 10px 8px !important; /* 单元格内边距，增加呼吸感 */
  border-radius: 6px !important;
  background-color: #f9fafb !important;
  white-space: normal !important; /* 允许文本换行（比如长课程名） */
}

.el-table__row:hover .course-content {
  background-color: #f0f9ff;
  border-radius: 6px;
  padding: 8px;
  width: 100%;
}
/* 1. 统一行高 */
.equal-row {
  height: 110px;          /* 你想多高就写多少 */
}

/* 2. 让单元格本身也撑满行高 */
.equal-cell {
  height: 110px;
  padding: 0 !important;  /* 去掉 Element 默认 padding，我们自己控制 */
}

/* 3. 有课没课都占满格子并垂直居中 */
.course-cell,
.section-cell {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 垂直居中 */
  padding: 8px;
  box-sizing: border-box;
}

/* 4. 没课时也保留一个空块占位，防止高度塌陷 */
.course-cell:empty::before {
  content: '';
  display: block;
  height: 100%;
}
.course-table {
  table-layout: fixed;   /* 列宽固定，顺便加速渲染 */
}

</style>