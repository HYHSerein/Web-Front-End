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
        <el-table :data="tableData"  class="course-table">
          <el-table-column prop="section" label="节次" width="90" align="center" />
          <el-table-column
            v-for="d in weekDays"
            :key="d.key"
            :prop="d.key"
            :label="d.label"
            align="center"
          >
            <template #default="{ row }">
              <div class="course-cell">{{ row[d.key] }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="StudentCourseSection">
import { ref } from 'vue'


interface Course {
  section: string
  mon: string
  tue: string
  wed: string
  thu: string
  fri: string
  sat: string
  sun: string
}

const weekDays = [
  { key: 'mon', label: '周一' },
  { key: 'tue', label: '周二' },
  { key: 'wed', label: '周三' },
  { key: 'thu', label: '周四' },
  { key: 'fri', label: '周五' },
  { key: 'sat', label: '周六' },
  { key: 'sun', label: '周日' }
]

const tableData = ref<Course[]>(
  Array.from({ length: 5 }, (_, i) => ({
    section: `第 ${i + 1} 节`,
    mon: i % 2 === 0 ? '高数' : '',
    tue: i % 3 === 1 ? '英语' : '',
    wed: '',
    thu: i % 2 === 1 ? '物理' : '',
    fri: '',
    sat: '',
    sun: ''
  }))
)
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
.course-cell {
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
</style>

