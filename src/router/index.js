import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/view/LoginView.vue'
import RegisterView from '@/view/RegisterView.vue'
import HomeView from '@/view/HomeView.vue'
import { getUserInfo } from '@/utils/auth'


const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: LoginView },
    { path: '/register', component: RegisterView },
    { path: '/home', component: HomeView }
]


const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const user = getUserInfo()
    const protectedPaths = ['/home']
    if (protectedPaths.includes(to.path) && !user?.id) {
        next('/login')
    } else {
        next()
    }
})

export default router