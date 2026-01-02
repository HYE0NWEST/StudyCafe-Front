import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SeatView from '../views/SeatView.vue'
import DashboardView from '../views/DashboardView.vue' 
import SignupView from '../views/SignupView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/dashboard', component: DashboardView }, // 2. 대시보드 경로 추가
    { path: '/seats', component: SeatView },
    {path: '/signup', component: SignupView}
  ]
})

export default router