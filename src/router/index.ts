// Composables
import path from "path";
import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import index from '~/components/Notice/index.vue';
//import { useUserStore } from '~/stores/app';
import Login from '@/components/Login/index.vue';
import NoPermission from '@/components/NoPermission/index.vue';
//import component from '../env';
//路由表
const routes = [
  //当路由为空时，重定向到登录页面
  {
    path: "/",
    redirect: "/Login",
  },
  {
    path: "/Login",
    name: "Login",
    component: () => import("~/Login.vue"),
  },
  {
    path: "/mainPage",
    name: "MainPage",
    component: () => import("~/components/MainPage/index.vue"),
  },
  {
    path: "/systemIntroduce",
    name: "SystemIntroduce",
    component: () => import("~/components/SystemIntroduce/index.vue"),
  },
  {
    path: "/password",
    name: "Password",
    component: () => import("~/components/Password/index.vue"),
  },
  {
    path: "/studentIntroduce",
    name: "StudentIntroduce",
    component: () => import("~/components/StudentIntroduce/index.vue"),
  },
  {
    path: "/teacherIntroduce",
    name: "TeacherIntroduce",
    component: () => import("~/components/TeacherIntroduce/index.vue"),
  },
  {
    path: "/menuManage",
    name: "MenuManage",
    component: () => import("~/components/MenuManage/index.vue"),
  },
  {
    path: "/dictionaryManage",
    name: "DictionaryManage",
    component: () => import("~/components/DictionaryManage/index.vue"),
  },

  {
    path: "/student",
    name: "Student",
    component: () => import("~/components/Student/index.vue"),
  },
  {
    path: "/teacher",
    name: "teacher",
    component: () => import("~/components/Teacher/index.vue"),
  },
  {
    path: "/course",
    name: "Course",
    component: () => import("~/components/Course/index.vue"),
  },
  {
    path: "/courseSectionManage",
    name: "CourseSectionManage",
    component: () => import("~/components/CourseSectionManage/index.vue")
  },
  {
    path: "/studentCourseSection",
    name: "StudnetCourseSection",
    component: () => import("~/components/StudentCourseSection/index.vue")
  },
  {
    path: "/score",
    name: "Score",
    component: () => import("~/components/Score/index.vue"),
  },
  {
    path: "/forgetpassword",
    name: "ForgetPassword",
    component: () => import("~/components/ForgetPassword/index.vue"),
  },
  {
    path: "/Absence",
    name: "Absence",
    component: () => import("~/components/Absence/index.vue"),
  },
  {
    path: "/notificationManage",
    name: "NotificationManage",
    component: () => import("~/components/NotificationManage/index.vue")
  },
  {
    path: "/honor",
    name: "Honor",
    component: () => import("~/components/Honor/index.vue"),
  },
  {
    path: "/volunteerHours",
    name: "VolunteerHours",
    component: () => import("~/components/VolunteerHours/index.vue"),
  },
  {
    path: "/studentCourseSection",
    name: "StudentCourseSection",
    component: () => import("~/components/StudentCourseSection/index.vue"),
  }
];
//路由创建
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});
//路由导出
export default router;
