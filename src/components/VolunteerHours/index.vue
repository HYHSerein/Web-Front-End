<template>
    <div class="main-view-container">
        <!-- 志愿活动编辑对话框 -->
        <el-dialog v-model="editVisible" :close-on-click-modal="false" width="60%" class="custom-dialog"
            destroy-on-close>
            <template #header>
                <div class="dialog-header">
                    <h3 class="dialog-title">志愿活动信息编辑</h3>
                </div>
            </template>

            <div class="edit-form-container">
                <el-form ref="form" :model="itemData" class="base-table-edit-form" label-width="100px">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="学生">
                                <el-select v-model="itemData.personId" placeholder="请选择学生" class="form-select" filterable>
                                    <el-option v-for="item in data.studentList" :key="item.id" :value="item.id"
                                        :label="item.title" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="活动日期">
                                <el-date-picker v-model="itemData.activityDate" type="date" placeholder="选择活动日期"
                                    class="form-input" value-format="YYYY-MM-DD" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="活动名称">
                                <el-input v-model="itemData.activityName" placeholder="请输入活动名称" class="form-input" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="志愿时长">
                                <el-input v-model="itemData.hours" placeholder="请输入志愿时长（小时）" class="form-input"
                                    type="number" step="0.5">
                                    <template #append>小时</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="组织单位">
                                <el-input v-model="itemData.organization" placeholder="请输入组织单位" class="form-input" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="状态">
                                <el-select v-model="itemData.status" placeholder="请选择状态" class="form-select">
                                    <el-option label="已完成" value="已完成" />
                                    <el-option label="审核中" value="审核中" />
                                    <el-option label="已取消" value="已取消" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="活动描述">
                        <el-input v-model="itemData.description" type="textarea" :rows="4" placeholder="请输入活动描述"
                            class="form-input" />
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
                    <h2 class="page-title">志愿活动管理</h2>
                </div>
            </div>

            <!-- 操作栏 -->
            <div class="action-bar">
                <div class="action-left">
                    <el-button type="success" @click="addItem()" class="action-btn add-btn">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        添加志愿活动
                    </el-button>
                </div>
                <div class="action-right">
                    <div class="search-group">
                        <el-input v-model="data.numName" placeholder="请输入学号或姓名" class="search-input"
                            @keyup.enter="doQuery()">
                            <template #prefix>
                                <el-icon>
                                    <Search />
                                </el-icon>
                            </template>
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
                    <el-table-column label="操作" width="180" fixed="right">
                        <template v-slot="scope">
                            <div class="table-actions">
                                <el-button type="primary" size="small" @click="editItem(scope.$index)"
                                    class="table-btn">
                                    <el-icon>
                                        <Edit />
                                    </el-icon>
                                    编辑
                                </el-button>
                                <el-button type="danger" size="small" @click="deleteItem(scope.$index)"
                                    class="table-btn delete-btn">
                                    <el-icon>
                                        <Delete />
                                    </el-icon>
                                    删除
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="studentNum" label="学号" width="140" />
                    <el-table-column prop="studentName" label="姓名" width="100" />
                    <el-table-column prop="className" label="班级" width="200" show-overflow-tooltip />
                    <el-table-column prop="activityName" label="活动名称" width="200" show-overflow-tooltip />
                    <el-table-column label="志愿时长" width="120">
                        <template v-slot="scope">
                            <el-tag type="success" size="small" class="hours-tag">
                                {{ scope.row.hours }} 小时
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="activityDate" label="活动日期" width="130" />
                    <el-table-column prop="organization" label="组织单位" width="180" show-overflow-tooltip />
                    <el-table-column label="状态" width="100">
                        <template v-slot="scope">
                            <el-tag :type="getStatusType(scope.row.status)" size="small">
                                {{ scope.row.status }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="description" label="活动描述" min-width="200" show-overflow-tooltip />
                </el-table>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup name="VolunteerHours">
import type { VolunteerHoursData, VolunteerHoursItem } from "~/domain/models/teaching";
import { container } from '~/inverfiy.config';
import { ID_VOLUNTEER_HOURS_PRESENTER } from '~/types';
import { VolunteerHoursPresenter } from "~/domain/presenters/volunteer-hours-presenter";
import { ref } from "vue";
import {
    Edit, Delete, Plus, Search,
    Check, Close
} from '@element-plus/icons-vue'

const presenter = container.get<VolunteerHoursPresenter>(ID_VOLUNTEER_HOURS_PRESENTER);
let data = ref<VolunteerHoursData>({} as VolunteerHoursData);
let itemData = ref<VolunteerHoursItem>({} as VolunteerHoursItem);
let editVisible = ref(false);

presenter.volunteerHoursInit().then((res) => {
    data.value = res;
});

// 根据状态返回对应的标签类型
const getStatusType = (status: string): 'success' | 'warning' | 'info' | 'danger' => {
    if (status === '已完成') return 'success';
    if (status === '审核中') return 'warning';
    if (status === '已取消') return 'info';
    return 'danger';
};

const doQuery = async () => {
    await presenter.getVolunteerHoursList(data.value);
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
</script>

<style lang="scss" scoped>
/* 志愿时长标签样式 */
.hours-tag {
    font-weight: 600;
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 6px;
}
</style>

