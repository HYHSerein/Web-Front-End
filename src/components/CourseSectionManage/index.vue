<template>
    <div class="main-view-container">
        <el-dialog v-model="editVisible" :close-on-click-modal="false" width="60%" class="custom-dialog"
            destroy-on-close>
            <template #header>
                <div class="dialog-header">
                    <div class="header-icon">
                        <el-icon>
                            <Document />
                        </el-icon>
                    </div>
                    <h3 class="dialog-title">选课信息编辑</h3>
                </div>
            </template>

            <div class="edit-form-container">
                <el-form ref="form" :model="itemData" class="base-table-edit-form" label-width="100px">
                    <el-form-item label="课程">
                        <el-select v-model="itemData.courseId" placeholder="请选择课程" class="form-select">
                            <el-option v-for="item in data.courseSelectList" :key="item.id" :value="item.id"
                                :label="item.title" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="课序号">
                        <el-input v-model="itemData.num" placeholder="请输入课序号" class="form-input" />
                    </el-form-item>
                    <el-form-item label="上课地点">
                        <el-input v-model="itemData.place" placeholder="请输入上课地点" class="form-input" />
                    </el-form-item>
                    <el-form-item label="授课老师">
                        <el-select v-model="itemData.teacherId" placeholder="请选择授课教师" class="form-select">
                            <el-option v-for="item in data.teacherSelectList" :key="item.id" :value="item.id"
                                :label="item.title" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="上课时间">
                        <el-select v-model="itemData.time" placeholder="请选择上课时间" class="form-select">
                            <el-option v-for="item in data.timeSelectList" :key="item.id" :value="item.id"
                                :label="item.title" />
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>

            <template #footer>
                <div class="dialog-footer">
                    <el-button type="success" @click="itemSubmit()" class="action-btn success-btn">
                        <el-icon>
                            <Check />
                        </el-icon>
                        提交
                    </el-button>
                    <el-button type="info" plain @click="editVisible = false" class="action-btn cancel-btn">
                        <el-icon>
                            <Close />
                        </el-icon>
                        取消
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 主要内容区域 -->
        <div class="main-content">
            <!-- 页面头部 -->
             <div class="page-header">
                <div class="header-content">
                    <div class="header-icon">
                        <el-icon>
                            <Document />
                        </el-icon>
                    </div>
                    <h2 class="page-title">选课管理</h2>
                </div>
            </div>

            <!-- 操作栏 -->
            <div class="action-bar">
                <div class="action-left">
                    <el-button type="success" @click="addItem()" class="action-btn add-btn">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        添加选课信息
                    </el-button>
                </div>
                <div class="action-right">
                    <div class="search-group">
                        <el-input v-model="data.num" placeholder="请输入课程课序号或课程名" class="search-input">
                            <template #prepend>课序号或课程名</template>
                        </el-input>
                        <el-button type="primary" @click="doQuery()" class="search-btn">
                            <el-icon>
                                <Search />
                            </el-icon>
                            查询
                        </el-button>
                    </div>
                </div>
            </div>

            <!-- 数据表格 -->
            <div class="table-container">
                <el-table :data="data.dataList" stripe class="base-table-table">
                    <el-table-column label="序号" width="70">
                        <template v-slot="scope">
                            <div class="sequence-number">
                                {{ scope.$index + 1 }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="num" label="课序号" width="80" />
                    <!-- <el-table-column prop="name" label="" width="200" /> -->
                    <el-table-column prop="courseName" label="课程名称" width="100" show-overflow-tooltip />
                    <el-table-column prop="teacherName" label="授课教师" width="100" show-overflow-tooltip />
                    <el-table-column prop="time" label="上课时间" width="200" show-overflow-tooltip :formatter="(row) => formatTime(row.time)"/>
                    <el-table-column prop="place" label="上课地点" width="200" show-overflow-tooltip />
                    <el-table-column prop="optional" label="选课状态" width="140" :formatter="formatOptionalStatus" v-if = "appStore.userInfo.role == 'ROLE_ADMIN'" />
                    <el-table-column prop="status" label="选课状态" width="140" :formatter="formatSelectStatus" v-if = "appStore.userInfo.role == 'ROLE_STUDENT'" />
                    <el-table-column label="操作" width="300" fixed="right">
                        <template v-slot="scope">
                            <div class="table-actions">
                                <el-button type="primary" size="small" @click="editItem(scope.$index)"
                                    class="table-btn" v-if = "appStore.userInfo.role == 'ROLE_ADMIN'">
                                    <el-icon>
                                        <Edit />
                                    </el-icon>
                                    编辑
                                </el-button>
                                <el-button type="warning" size="small" @click="publishItem(scope.$index)"
                                    class="table-btn publish-btn" v-if = "appStore.userInfo.role == 'ROLE_ADMIN'">
                                    <el-icon>
                                        <UploadFilled v-if="!scope.row.optional" /> 
                                        <Delete v-else />
                                    </el-icon>
                                    {{ scope.row.optional ? '撤销发布' : '发布选课' }}
                                </el-button>
                                <el-button type="danger" size="small" @click="deleteItem(scope.$index)"
                                    class="table-btn delete-btn" v-if = "appStore.userInfo.role == 'ROLE_ADMIN'">
                                    <el-icon>
                                        <Delete />
                                    </el-icon>
                                    删除
                                </el-button>
                                <el-button type="info" size="small" @click="selectItem(scope.$index)"
                                    class="table-btn select-btn" v-if = "appStore.userInfo.role == 'ROLE_STUDENT' && scope.row.status == false" >
                                    <el-icon>
                                        <Plus />
                                    </el-icon>
                                    选中
                                </el-button>
                                <el-button type="info" size="small" @click="unselectItem(scope.$index)"
                                    class="table-btn unselect-btn" v-if = "appStore.userInfo.role == 'ROLE_STUDENT' && scope.row.status == true" >
                                    <el-icon>
                                        <Delete />
                                    </el-icon>
                                    退课
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>

                </el-table>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup name="CourseSectionManage">
import type { CourseSectionData, CourseSectionItem } from "~/domain/models/teaching";
import { container } from '~/inverfiy.config';
import { ID_COURSE_SECTION_PRESENTER } from '~/types';
import { CourseSectionPresenter } from "~/domain/presenters/course-section-presenter";
import { ref } from "vue";
import { useAppStore } from "~/stores/app";
import {
    Document, Edit, Delete, Plus, Search,
    Check, Close
} from '@element-plus/icons-vue'
const presenter = container.get<CourseSectionPresenter>(ID_COURSE_SECTION_PRESENTER);
const appStore = useAppStore();
let data = ref<CourseSectionData>({} as CourseSectionData);
let itemData = ref<CourseSectionItem>({} as CourseSectionItem);
let editVisible = ref(false);
presenter.courseSectionInit().then((res) => {
    data.value = res;
});
const doQuery = async () => {
    await presenter.getCourseSectionList(data.value);
};
const addItem = async () => {
    itemData.value = presenter.addItem(data.value);
    editVisible.value = true;
};
const editItem = async (index: number) => {
    itemData.value = presenter.editItem(data.value, index);
    editVisible.value = true;
};

const itemSubmit = async () => {
    await presenter.itemSubmit(itemData.value, data.value);
    editVisible.value = false;
};
const deleteItem = async (index: number) => {
    await presenter.deleteItem(data.value, index);
};

const publishItem = async (index: number) => {
    await presenter.publishItem(data.value, index);
};
const selectItem = async (index: number) => {
    await presenter.selectItem(data.value, index);
}
const unselectItem = async (index: number) => {
    await presenter.unselectItem(data.value, index);
};

const weekMap = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

// 2. 节次→时间映射（按实际课程时间调整）
// 方案1：显式声明 Record<number, string>，键为 number 类型
const sectionTimeMap: Record<number, string> = {
  1: '08:00-09:50',
  2: '10:10-12:00',
  3: '14:00-15:50',
  4: '16:10-18:00',
  5: '19:00-20:50'
};

const formatTime = (timeCode: string | number | undefined) => {
  if (!timeCode || String(timeCode).length !== 3) {
    return '暂无时间';
  }

  const codeStr = String(timeCode);
  const weekCode = parseInt(codeStr.substring(0, 1));
  const section = parseInt(codeStr.substring(1));

  if (isNaN(weekCode) || isNaN(section) || weekCode > 6 || section < 1 || section > 5) {
    return '时间格式错误';
  }

  const weekName = weekMap[weekCode];
  const sectionTime = sectionTimeMap[section]; // 现在类型匹配，无报错
  return `${weekName}第${section}节 ${sectionTime}`;
};

const formatOptionalStatus = (row: any, column: any, value: boolean) => {
  return value ? '可选' : '不可选';
};
const formatSelectStatus = (row: any, column: any, value: boolean) => {
  return value ? '已选' : '未选';
};
</script>
<style lang="scss" scoped></style>