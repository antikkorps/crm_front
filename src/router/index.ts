import { createRouter, createWebHistory } from 'vue-router'
import About from '../views/AboutView.vue'
import Dashboard from '../views/Dashboard/DashboardIndexView.vue'
import Home from '../views/HomeView.vue'
import Login from '../views/LoginView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { layout: 'default' },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { layout: 'auth' },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { layout: 'dashboard' },
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: { layout: 'default' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // Force le scroll en haut de page pour chaque navigation
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
