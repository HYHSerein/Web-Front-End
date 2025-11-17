<template>
    <div class="main-view-container">
        <!-- 页面标题部分 -->
        <div class="intro-header">
            <div class="header-content">
                <div class="header-icon">
                    <el-icon>
                        <Platform />
                    </el-icon>
                </div>
                <h1 class="header-title">系统简介</h1>
                <p class="header-subtitle">基于现代前端技术栈的教学管理系统</p>
            </div>
        </div>

        <!-- 主要内容区域 -->
        <div class="content-wrapper">
            <!-- 媒体展示区域 - 置顶显示 -->
            <div class="media-section">
                <h3 class="media-title">
                    <el-icon class="title-icon">
                        <Picture />
                    </el-icon>
                    系统演示
                </h3>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <div class="media-card">
                            <h4 class="media-card-title">系统截图展示</h4>
                            <div class="carousel-wrapper">
                                <el-carousel height="350px" :interval="4000" arrow="hover" class="demo-carousel">
                                    <el-carousel-item v-for="item in imageUrl" :key="item.url">
                                        <div class="carousel-item">
                                            <img :src="item.url" alt="系统截图" class="carousel-image" />
                                        </div>
                                    </el-carousel-item>
                                </el-carousel>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="media-card">
                            <h4 class="media-card-title">功能演示视频</h4>
                            <div class="video-wrapper">
                                <video src="/app/video.mp4" controls autoplay muted type="video/mp4" preload="auto"
                                    class="demo-video">
                                    您的浏览器不支持视频播放
                                </video>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>

            <!-- 欢迎卡片 -->
            <el-card class="feature-card welcome-card" shadow="hover">
                <template #header>
                    <div class="card-header">
                        <el-icon class="header-icon-small success">
                            <Star />
                        </el-icon>
                        <span class="card-title">欢迎使用基于 Vue3 + TypeScript + Element Plus 的示例框架</span>
                    </div>
                </template>
                <div class="card-content">
                    <div class="tech-tags">
                        <el-tag type="info" size="large" effect="light" class="tech-tag">Vue 3</el-tag>
                        <el-tag type="success" size="large" effect="light" class="tech-tag">TypeScript</el-tag>
                        <el-tag type="warning" size="large" effect="light" class="tech-tag">Element Plus</el-tag>
                    </div>
                    <p class="description">
                        本框架基于现代前端技术栈构建，为开发者提供高效、灵活的开发环境，
                        集成了完整的教学管理功能模块，支持学生、教师、课程等多维度管理。
                    </p>

                    <div class="features-section">
                        <h4 class="section-title">
                            <el-icon class="title-icon">
                                <Setting />
                            </el-icon>
                            核心特性
                        </h4>
                        <div class="features-grid">
                            <div class="feature-item">
                                <div class="feature-icon">🎨</div>
                                <div class="feature-text">
                                    <strong>组件库完整</strong>
                                    <span>Element Plus 布局、表单、基础组件的完整示例</span>
                                </div>
                            </div>
                            <div class="feature-item">
                                <div class="feature-icon">📊</div>
                                <div class="feature-text">
                                    <strong>功能丰富</strong>
                                    <span>数据表格、消息提示、对话框等常用组件应用</span>
                                </div>
                            </div>
                            <div class="feature-item">
                                <div class="feature-icon">👥</div>
                                <div class="feature-text">
                                    <strong>管理模块</strong>
                                    <span>学生管理、课程管理和成绩管理功能模块</span>
                                </div>
                            </div>
                            <div class="feature-item">
                                <div class="feature-icon">🏗️</div>
                                <div class="feature-text">
                                    <strong>架构清晰</strong>
                                    <span>组件化设计，采用清洁架构实现前端数据分离</span>
                                </div>
                            </div>
                            <div class="feature-item">
                                <div class="feature-icon">⚡</div>
                                <div class="feature-text">
                                    <strong>技术先进</strong>
                                    <span>Spring Boot 3 后台，兼容《高级程序开发》课程</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-card>

            <!-- 实验要求卡片 -->
            <el-card class="feature-card requirements-card" shadow="hover">
                <template #header>
                    <div class="card-header">
                        <el-icon class="header-icon-small warning">
                            <Document />
                        </el-icon>
                        <span class="card-title">Web 技术项目实验和提交要求</span>
                    </div>
                </template>
                <div class="card-content">
                    <el-row :gutter="30">
                        <el-col :span="12">
                            <div class="requirement-section">
                                <h4 class="section-title">
                                    <el-icon class="title-icon">
                                        <Monitor />
                                    </el-icon>
                                    技术要求
                                </h4>
                                <div class="requirement-list">
                                    <div class="requirement-item">
                                        <div class="req-icon">💻</div>
                                        <div class="req-content">
                                            <strong>前端技术</strong>
                                            <span>HTML、CSS、JavaScript</span>
                                        </div>
                                    </div>
                                    <div class="requirement-item">
                                        <div class="req-icon">🚀</div>
                                        <div class="req-content">
                                            <strong>现代框架</strong>
                                            <span>Vue.js、React 等现代技术栈</span>
                                        </div>
                                    </div>
                                    <div class="requirement-item">
                                        <div class="req-icon">🛠️</div>
                                        <div class="req-content">
                                            <strong>开发工具</strong>
                                            <span>Visual Studio Code</span>
                                        </div>
                                    </div>
                                    <div class="requirement-item">
                                        <div class="req-icon">🗄️</div>
                                        <div class="req-content">
                                            <strong>数据库</strong>
                                            <span>课程提供的 MySQL 数据库</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="requirement-section">
                                <h4 class="section-title">
                                    <el-icon class="title-icon">
                                        <Upload />
                                    </el-icon>
                                    提交要求
                                </h4>
                                <div class="requirement-list">
                                    <div class="requirement-item">
                                        <div class="req-icon">📦</div>
                                        <div class="req-content">
                                            <strong>项目打包</strong>
                                            <span>前后端代码打包成完整项目</span>
                                        </div>
                                    </div>
                                    <div class="requirement-item">
                                        <div class="req-icon">🔐</div>
                                        <div class="req-content">
                                            <strong>登录功能</strong>
                                            <span>登录界面支持默认用户密码</span>
                                        </div>
                                    </div>
                                    <div class="requirement-item">
                                        <div class="req-icon">👤</div>
                                        <div class="req-content">
                                            <strong>角色管理</strong>
                                            <span>主界面包含角色切换功能</span>
                                        </div>
                                    </div>
                                    <div class="requirement-item">
                                        <div class="req-icon">📱</div>
                                        <div class="req-content">
                                            <strong>展示页面</strong>
                                            <span>系统介绍页面包含截图轮播</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-card>
        </div>
    </div>
</template>
<script setup lang="ts" name="SystemIntroduce">
import { Platform, Star, Setting, Document, Monitor, Upload, Picture } from '@element-plus/icons-vue';

const imageUrl = [
    { url: "/app/img1.jpg" },
    { url: "/app/img2.jpg" },
    { url: "/app/img3.jpg" },
    { url: "/app/img4.jpg" }
];
</script>

<style lang="scss" scoped>
/* 页面头部样式 */
.intro-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 40px 0;
    text-align: center;
    color: white;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="80" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="60" r="1" fill="rgba(255,255,255,0.1)"/></svg>');
        opacity: 0.3;
    }
}

.header-content {
    position: relative;
    z-index: 1;
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
}

.header-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    margin: 0 auto 15px;
    backdrop-filter: blur(10px);
    border: 3px solid rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;

    &:hover {
        transform: scale(1.1);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    }
}

.header-title {
    font-size: 36px;
    font-weight: 700;
    margin: 0 0 12px 0;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.header-subtitle {
    font-size: 18px;
    margin: 0;
    opacity: 0.9;
    font-weight: 300;
}

/* 内容包装器 */
.content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px 20px 40px;
}

/* 功能卡片样式 */
.feature-card {
    margin-bottom: 30px;
    border-radius: 16px;
    border: 1px solid rgba(102, 126, 234, 0.1);
    box-shadow: 0 8px 32px rgba(102, 126, 234, 0.1);
    transition: all 0.3s ease;
    overflow: hidden;

    &:hover {
        box-shadow: 0 12px 40px rgba(102, 126, 234, 0.2);
        transform: translateY(-4px);
    }

    :deep(.el-card__header) {
        background: linear-gradient(135deg, #f8f9ff 0%, #e8f4fd 100%);
        border-bottom: 1px solid #eef2f7;
        padding: 20px 24px;
    }

    :deep(.el-card__body) {
        padding: 30px;
    }
}

.welcome-card {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
}

.requirements-card {
    background: linear-gradient(135deg, #ffffff 0%, #fff8f0 100%);
}

/* 卡片头部样式 */
.card-header {
    display: flex;
    align-items: center;
    gap: 12px;
}

.header-icon-small {
    font-size: 20px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;

    &.success {
        background: linear-gradient(135deg, #67c23a, #85ce61);
    }

    &.warning {
        background: linear-gradient(135deg, #e6a23c, #f7ba2a);
    }
}

.card-title {
    font-size: 20px;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
}

/* 卡片内容样式 */
.card-content {
    line-height: 1.8;
    color: #5a6c7d;
}

.tech-tags {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.tech-tag {
    font-size: 14px;
    font-weight: 600;
    padding: 8px 16px;
    border-radius: 20px;
    border: 2px solid;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
}

.description {
    font-size: 16px;
    margin-bottom: 30px;
    color: #4a5568;
    font-weight: 400;
}

/* 功能特性部分 */
.features-section {
    margin-top: 20px;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    font-weight: 600;
    color: #409eff;
    margin: 0 0 20px 0;
}

.title-icon {
    font-size: 18px;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}

.feature-item {
    display: flex;
    align-items: flex-start;
    gap: 15px;
    padding: 20px;
    background: rgba(102, 126, 234, 0.03);
    border-radius: 12px;
    border: 1px solid rgba(102, 126, 234, 0.1);
    transition: all 0.3s ease;

    &:hover {
        background: rgba(102, 126, 234, 0.05);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
    }
}

.feature-icon {
    font-size: 24px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea, #764ba2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.feature-text {
    display: flex;
    flex-direction: column;
    gap: 4px;

    strong {
        color: #2c3e50;
        font-size: 16px;
    }

    span {
        color: #6c757d;
        font-size: 14px;
    }
}

/* 需求部分样式 */
.requirement-section {
    height: 100%;
}

.requirement-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.requirement-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
    background: rgba(230, 162, 60, 0.03);
    border-radius: 10px;
    border: 1px solid rgba(230, 162, 60, 0.1);
    transition: all 0.3s ease;

    &:hover {
        background: rgba(230, 162, 60, 0.05);
        transform: translateX(4px);
        border-color: rgba(230, 162, 60, 0.2);
    }
}

.req-icon {
    font-size: 20px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #e6a23c, #f7ba2a);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.req-content {
    display: flex;
    flex-direction: column;
    gap: 4px;

    strong {
        color: #2c3e50;
        font-size: 15px;
    }

    span {
        color: #6c757d;
        font-size: 13px;
    }
}

/* 媒体展示区域 */
.media-section {
    margin-top: 0;
    margin-bottom: 30px;
}

.media-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 24px;
    font-weight: 600;
    color: #2c3e50;
    margin: 0 0 30px 0;
    text-align: center;
    justify-content: center;
}

.media-card {
    background: white;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 8px 32px rgba(102, 126, 234, 0.1);
    border: 1px solid rgba(102, 126, 234, 0.1);
    transition: all 0.3s ease;
    height: auto;
    min-height: 420px;

    &:hover {
        box-shadow: 0 12px 40px rgba(102, 126, 234, 0.15);
        transform: translateY(-2px);
    }
}

.media-card-title {
    font-size: 18px;
    font-weight: 600;
    color: #2c3e50;
    margin: 0 0 20px 0;
    text-align: center;
}

/* 轮播图包装器 */
.carousel-wrapper {
    width: 100%;
    height: 350px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* 轮播图样式 */
.demo-carousel {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    width: 100%;
    height: 350px;

    :deep(.el-carousel__container) {
        border-radius: 12px;
        height: 350px;
    }

    :deep(.el-carousel__item) {
        height: 350px;
    }

    :deep(.el-carousel__indicator button) {
        background: rgba(102, 126, 234, 0.3);
        width: 12px;
        height: 4px;
        border-radius: 2px;
    }

    :deep(.el-carousel__indicator.is-active button) {
        background: #667eea;
    }

    :deep(.el-carousel__arrow) {
        background: rgba(255, 255, 255, 0.8);
        color: #667eea;

        &:hover {
            background: rgba(255, 255, 255, 0.9);
        }
    }
}

.carousel-item {
    width: 100%;
    height: 350px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8f9fa;
    border-radius: 12px;
    overflow: hidden;
}

.carousel-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    border-radius: 12px;
}

/* 视频样式 */
.video-wrapper {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    background: #000;
    width: 100%;
    height: 350px;
    position: relative;
}

.demo-video {
    width: 100%;
    height: 350px;
    display: block;
    object-fit: contain;
    border-radius: 12px;
    background: #000;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .header-title {
        font-size: 32px;
    }

    .header-subtitle {
        font-size: 16px;
    }

    .content-wrapper {
        padding: 20px 15px;
    }

    .features-grid {
        grid-template-columns: 1fr;
    }

    .tech-tags {
        justify-content: center;
    }

    .feature-item,
    .requirement-item {
        flex-direction: column;
        text-align: center;
        gap: 12px;
    }

    .media-card {
        padding: 16px;
        min-height: auto;
    }

    .demo-video,
    .demo-carousel,
    .video-wrapper,
    .carousel-wrapper {
        height: 250px;
    }

    .carousel-item {
        height: 250px;
    }

    :deep(.el-carousel__container) {
        height: 250px;
    }

    :deep(.el-carousel__item) {
        height: 250px;
    }

    .media-section {
        .el-col {
            margin-bottom: 20px;
        }
    }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
    .system-intro-container {
        background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
    }

    .feature-card {
        background: #34495e;
        border-color: rgba(255, 255, 255, 0.1);

        :deep(.el-card__header) {
            background: #2c3e50;
            border-bottom-color: rgba(255, 255, 255, 0.1);
        }
    }

    .media-card {
        background: #34495e;
        border-color: rgba(255, 255, 255, 0.1);
    }

    .card-title,
    .header-title,
    .media-title,
    .section-title {
        color: #ecf0f1;
    }

    .description,
    .card-content {
        color: #bdc3c7;
    }
}
</style>