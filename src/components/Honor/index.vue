<template>
    <div class="main-view-container">
        <!-- 荣誉编辑对话框 -->
        <el-dialog v-model="editVisible" :close-on-click-modal="false" width="50%" class="custom-dialog"
            destroy-on-close>
            <template #header>
                <div class="dialog-header">
                    <div class="header-icon">
                        <el-icon>
                            <Trophy />
                        </el-icon>
                    </div>
                    <h3 class="dialog-title">荣誉信息编辑</h3>
                </div>
            </template>

            <div class="edit-form-container">
                <el-form ref="form" :model="itemData" class="base-table-edit-form" label-width="80px">
                    <el-form-item label="学生">
                        <el-select v-model="itemData.personId" placeholder="请选择学生" class="form-select">
                            <el-option v-for="item in data.studentList" :key="item.id" :value="item.id"
                                :label="item.title" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="荣誉名称">
                        <el-input v-model="itemData.honorName" placeholder="请输入荣誉名称" class="form-input" />
                    </el-form-item>
                    <el-form-item label="荣誉等级">
                        <el-select v-model="itemData.honorLevel" placeholder="请选择荣誉等级" class="form-select">
                            <el-option label="国家级" value="national" />
                            <el-option label="省级" value="provincial" />
                            <el-option label="市级" value="municipal" />
                            <el-option label="校级" value="school" />
                            <el-option label="院级" value="college" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="获得时间">
                        <el-date-picker 
                            v-model="itemData.awardTime" 
                            type="date" 
                            placeholder="选择获得时间" 
                            class="form-input" 
                            format="YYYY-MM-DD" 
                            value-format="YYYY-MM-DD" 
                        />
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
                            <Trophy />
                        </el-icon>
                    </div>
                    <h2 class="page-title">荣誉管理</h2>
                </div>
            </div>

            <!-- 操作栏 -->
            <div class="action-bar">
                <div class="action-left">
                    <el-button type="success" @click="addItem()" class="action-btn add-btn">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        添加荣誉
                    </el-button>
                </div>
                <div class="action-right">
                    <div class="search-group">
                        <div class="filter-item">
                            <span class="filter-label">学生</span>
                            <el-select v-model="data.personId" placeholder="请选择学生" class="filter-select">
                                <el-option v-for="item in data.studentList" :key="item.id" :value="item.id"
                                    :label="item.title" />
                            </el-select>
                        </div>
                        <div class="filter-item">
                            <span class="filter-label">荣誉等级</span>
                            <el-select v-model="data.honorLevel" placeholder="请选择荣誉等级" class="filter-select">
                                <el-option label="国家级" value="national" />
                                <el-option label="省级" value="provincial" />
                                <el-option label="市级" value="municipal" />
                                <el-option label="校级" value="school" />
                                <el-option label="院级" value="college" />
                            </el-select>
                        </div>
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
                    <el-table-column label="操作" width="180">
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
                    <el-table-column prop="honorName" label="荣誉名称" width="200" show-overflow-tooltip />
                    <el-table-column label="荣誉等级" width="120">
                        <template v-slot="scope">
                            <el-tag :type="getLevelType(scope.row.honorLevel)" size="small">
                                {{ getLevelText(scope.row.honorLevel) }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="awardTime" label="获得时间" width="160" />
                </el-table>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup name="Honor">
import type { HonorData, HonorItem } from "~/domain/models/teaching";
import { container } from '~/inverfiy.config';
import { ID_HONOR_PRESENTER } from '~/types';
import { HonorPresenter } from "~/domain/presenters/honor-presenter";
import { ref } from "vue";  // 只需要导入 ref
import { onMounted } from 'vue';  // 如果自动导入不起作用，就显式导入
import {
    Trophy, Edit, Delete, Plus, Search,
    Check, Close
} from '@element-plus/icons-vue'

const presenter = container.get<HonorPresenter>(ID_HONOR_PRESENTER);
let data = ref<HonorData>({} as HonorData);
let itemData = ref<HonorItem>({} as HonorItem);
let editVisible = ref(false);

// 初始化
presenter.honorInit().then((res) => {
    data.value = res;
});

// 根据荣誉等级返回对应的标签类型
const getLevelType = (level: string): 'success' | 'warning' | 'info' | 'primary' | 'danger' => {
    switch(level) {
        case 'national': return 'success';
        case 'provincial': return 'warning';
        case 'municipal': return 'primary';
        case 'school': return 'info';
        case 'college': return 'danger';
        default: return 'info';
    }
};

// 将等级值转换为显示文本
const getLevelText = (level: string): string => {
    const levelMap: Record<string, string> = {
        'national': '国家级',
        'provincial': '省级',
        'municipal': '市级',
        'school': '校级',
        'college': '院级'
    };
    return levelMap[level] || '';
};

// 查询
// 在 honor.index 的 doQuery 方法中
const doQuery = async () => {
    console.log("【前端组件】doQuery 开始");
    console.log("【前端组件】查询参数:", {
        personId: data.value.personId,
        honorLevel: data.value.honorLevel
    });
    
    try {
        const result = await presenter.getHonorList(data.value);
        console.log("【前端组件】Presenter 返回结果:", result);
        console.log("【前端组件】dataList 内容:", result.dataList);
        console.log("【前端组件】dataList 长度:", result.dataList ? result.dataList.length : 0);
        
        data.value = result;
        console.log("【前端组件】设置后的 data.value:", data.value);
    } catch (error) {
        console.error("【前端组件】查询失败:", error);
    }
};

// 提交
const itemSubmit = async () => {
    try {
        console.log("提交的荣誉数据：", itemData.value);
        const result = await presenter.itemSubmit(itemData.value, data.value);
        data.value = result;
        editVisible.value = false;
    } catch (error) {
        console.error("提交失败：", error);
    }
};

// 添加
const addItem = async () => {
    itemData.value = presenter.addItem(data.value);
    editVisible.value = true;
};

// 编辑
const editItem = async (index: number) => {
    itemData.value = presenter.editItem(data.value, index);
    editVisible.value = true;
};

// 删除
const deleteItem = async (index: number) => {
    const result = await presenter.deleteItem(data.value, index);
    data.value = result;
};
// 测试所有荣誉记录的方法
const testAllHonors = async () => {
    try {
        console.log("=== 测试所有荣誉记录 ===");
        const response = await fetch('/api/honor/testAllHonors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({})
        });
        const result = await response.json();
        console.log("测试接口返回:", result);
    } catch (error) {
        console.error("测试失败:", error);
    }
};

// 在组件挂载时调用测试方法 - onMounted 是自动导入的
onMounted(() => {
    testAllHonors();
    
    // 原有的初始化代码
    presenter.honorInit().then((res) => {
        console.log("初始化结果:", res);
        data.value = res;
    });
});


</script>