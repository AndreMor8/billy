import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/web-home.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/verify',
    name: 'request-verify',
    component: async function () {
      return await import("../views/request-verify.vue");
    }
  },
  {
    path: '/blacklist',
    name: 'request-blacklist',
    component: async function () {
      return await import("../views/request-blacklist.vue");
    }
  },
  {
    path: '/requests',
    name: 'request-list',
    component: async function () {
      return await import("../views/request-list.vue");
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
