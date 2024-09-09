import { createWebHistory, createRouter } from "vue-router";

const routes =  [
  {
    path: "/",
    name: "game",
    component: () => import("./components/Game.vue")
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

