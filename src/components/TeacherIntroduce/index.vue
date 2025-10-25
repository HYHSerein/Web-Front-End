<template>
    <div class="main-view-container">
        <!-- 个人信息卡片 -->
        <div class="info-card">
            <div class="card-header">
                <div class="header-icon">
                    <el-icon>
                        <User />
                    </el-icon>
                </div>
                <h3 class="card-title">个人信息</h3>
            </div>

            <div class="info-content">
                <div class="info-left">
                    <el-form ref="form" :model="data.info" label-width="80px" class="base-table-form">
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="工号">
                                    <el-input v-model="data.info.num" readonly class="readonly-input" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="姓名">
                                    <el-input v-model="data.info.name" readonly class="readonly-input" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="学院">
                                    <el-input v-model="data.info.dept" readonly class="readonly-input" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="学位">
                                    <el-input v-model="data.info.degree" readonly class="readonly-input" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="职称">
                                    <el-input v-model="data.info.title" readonly class="readonly-input" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="证件号码">
                                    <el-input v-model="data.info.card" readonly class="readonly-input" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="性别">
                                    <el-input v-model="data.info.genderName" readonly class="readonly-input" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="出生日期">
                                    <el-input v-model="data.info.birthday" readonly class="readonly-input" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="邮箱">
                                    <el-input v-model="data.info.email" readonly class="readonly-input" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="电话">
                                    <el-input v-model="data.info.phone" readonly class="readonly-input" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="地址">
                                    <el-input v-model="data.info.address" readonly class="readonly-input" />
                                </el-form-item>
                            </el-col>
                            <!-- <el-col :span="8">
                                <el-form-item label="备注">
                                    <el-input v-model="data.info.dept" readonly class="readonly-input" />
                                </el-form-item>
                            </el-col> -->
                        </el-row>
                    </el-form>
                </div>

                <div class="info-right">
                    <div class="photo-container">
                        <div class="photo-label">个人照片</div>
                        <div class="photo-wrapper">
                            <img :src="data.imgStr" alt="个人照片" class="person-photo" />
                            <div class="photo-name">{{ data.info.name }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup name="TeacherIntroduce">
import type { TeacherIntroduceData } from "~/domain/models/info";
import { container } from '~/inverfiy.config';
import { ID_TEACHER_INTRODUCE_PRESENTER } from '~/types';
import { TeacherIntroducePresenter } from "~/domain/presenters/teacher-introduce-presenter";
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { TeacherItem } from "~/domain/models/person";
import { User, Document, DataAnalysis } from '@element-plus/icons-vue'
const presenter = container.get<TeacherIntroducePresenter>(ID_TEACHER_INTRODUCE_PRESENTER);
let data = ref<TeacherIntroduceData>({ info: { personId: 0 } as TeacherItem } as TeacherIntroduceData);
let timer: string | number | NodeJS.Timeout | undefined;
const props = defineProps({
    personId: {
        type: Number,
        required: true
    },
});

const loadData = async () => {
    try {
        console.log('TeacherIntroduce(component): calling presenter with personId=', data.value.personId);
        await presenter.teacherIntroduceInit(data.value);
    } catch (err) {
        console.error('TeacherIntroduce(component): loadData error', err);
    }
};

watch(
    () => props.personId,
    val => {
        console.log("value", val);
        data.value.personId = val;
        loadData()
    },
    { immediate: true }
)

onMounted(async () => {
    await loadData();
});


</script>
<style lang="scss" scoped>
/* 卡片通用样式 */
.info-card,
.score-card,
.charts-card {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.1);
    margin-bottom: 24px;
    border: 1px solid rgba(102, 126, 234, 0.1);
    transition: all 0.3s ease;
    overflow: hidden;

    &:hover {
        box-shadow: 0 8px 30px rgba(102, 126, 234, 0.2);
        transform: translateY(-2px);
    }
}

/* 卡片头部样式 */
.card-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 16px 24px;
    display: flex;
    align-items: center;
    border-bottom: none;

    .header-icon {
        width: 32px;
        height: 32px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
        color: white;
        font-size: 16px;
    }

    .card-title {
        color: white;
        font-size: 18px;
        font-weight: 600;
        margin: 0;
        flex: 1;
    }
}

/* 个人信息卡片内容 */
.info-content {
    padding: 24px;
    display: flex;
    gap: 30px;
    align-items: flex;
}

.info-left {
    flex: 1;
}

.info-right {
    width: 180px;
    display: flex;
    justify-content: center;
}

.base-table-form {
  :deep(.el-form-item) {
    margin-bottom: 32px;   // 想多小就写多小
  }
  :deep(.el-form-item__label) {
    line-height: 38px;    // 让标签行高与输入框一致
  }
  /* 可选：再把输入框高度压一点 */
  :deep(.el-input__wrapper) {
    padding: 4px 8px;
  }
}

/* 表单样式 */
.teacher-form {
    :deep(.el-form-item__label) {
        color: #606266;
        font-weight: 500;
    }

    :deep(.el-form-item) {
        margin-bottom: 20px;
    }
}

.readonly-input {
    :deep(.el-input__wrapper) {
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        box-shadow: none;
        transition: all 0.3s ease;

        &:hover {
            border-color: #667eea;
            background: #f0f2ff;
        }
    }

    :deep(.el-input__inner) {
        color: #495057;
        font-weight: 500;
    }
}

@media (max-width: 768px) {
    .teacher-introduce-container {
        padding: 12px;
    }

    .info-content,
    .table-container,
    .charts-container {
        padding: 16px;
    }

    .teacher-avatar {
        width: 120px;
        height: 150px;
    }

    .chart-content {
        height: 200px;
        padding: 8px;
    }

    :deep(.el-col) {
        margin-bottom: 16px;
    }
}

/* Element Plus 组件样式覆盖 */
:deep(.el-table) {
    border-radius: 8px;
    overflow: hidden;
}

:deep(.el-tag) {
    border-radius: 6px;
    font-weight: 500;
}

:deep(.el-row) {
    margin-bottom: 0 !important;
}
</style>