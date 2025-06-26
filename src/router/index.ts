import { createRouter, createWebHistory } from 'vue-router'
import About from '../views/AboutView.vue'
import CompaniesListView from '../views/Companies/CompaniesListView.vue'
import CompanyDetailsView from '../views/Companies/CompanyDetailsView.vue'
import Dashboard from '../views/Dashboard/DashboardIndexView.vue'
import Home from '../views/HomeView.vue'
import Login from '../views/LoginView.vue'
import { mainGuard } from './guards'

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
    name: 'dashboard',
    component: Dashboard,
    meta: { layout: 'dashboard' },
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: { layout: 'default' },
  },
  {
    path: '/companies',
    name: 'companies',
    component: CompaniesListView,
    meta: { layout: 'dashboard' },
  },
  {
    path: '/companies/:id',
    name: 'company-detail',
    component: CompanyDetailsView,
    props: true,
    meta: { layout: 'dashboard' },
  },
  // Pages paramètres
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/Settings/SettingsIndexView.vue'),
    meta: { layout: 'dashboard', requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/Profile/ProfileView.vue'),
    meta: { layout: 'dashboard', requiresAuth: true },
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/Admin/AdminIndexView.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, requiresAdmin: true },
  },
  // Pour le futur
  {
    path: '/settings/segments',
    name: 'segments',
    component: () => import('../views/Settings/SettingsIndexView.vue'),
    meta: { layout: 'dashboard', requiresAuth: true },
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

// Appliquer le guard principal
router.beforeEach(mainGuard)

export default router
