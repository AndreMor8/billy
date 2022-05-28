import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/web-home.vue';
import web404 from '../views/web-404.vue';

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
  },
  {
    path: '/privacy-policy',
    name: 'privacy-policy',
    component: async function () {
      return await import("../views/web-privacy-policy.vue");
    }
  },
  {
    path: '/admin',
    name: 'admin-login',
    component: async function () {
      return await import("../views/admin-login.vue");
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'web-404',
    component: web404
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;