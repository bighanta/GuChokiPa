import { createRouter, createWebHistory } from "vue-router";
import HomeScreen from "./views/Home.vue";
import JoinScreen from "./views/JoinScreen.vue";
import WaitingScreen from "./views/WaitingScreen.vue";
import GameScreen from "./views/GameScreen.vue";
import ResultScreen from "./views/ResultScreen.vue";

const routes = [
  { path: "/", name: "HomeScreen", component: HomeScreen },
  { path: "/join", name: "JoinScreen", component: JoinScreen },
  { path: "/waiting/:sessionCode", name: "WaitingScreen", component: WaitingScreen, props: true },
  { path: "/game/:sessionCode", name: "GameScreen", component: GameScreen, props: true },
  { path: "/result", name: "ResultScreen", component: ResultScreen, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

