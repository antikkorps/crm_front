import { createRouter, createWebHistory } from 'vue-router'
import About from '../views/AboutView.vue'
import CompaniesListView from '../views/Companies/CompaniesListView.vue'
import CompanyDetailsView from '../views/Companies/CompanyDetailsView.vue'
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
  // Page de test des activités
  {
    path: '/activities/test',
    name: 'activities-test',
    component: () => import('../views/Activities/ActivitiesTestView.vue'),
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
    path: '/settings/status',
    name: 'status-list',
    component: () => import('../views/Settings/StatusListView.vue'),
    meta: { layout: 'dashboard', requiresAuth: true },
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

export default router
