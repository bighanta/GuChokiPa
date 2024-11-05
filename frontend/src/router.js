import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import WaitingScreen from './views/WaitingScreen.vue';
import GameScreen from './views/GameScreen.vue';
import ResultScreen from './views/ResultScreen.vue'; // Import the ResultScreen
import JoinSession from './views/JoinSession.vue'; // Import the ResultScreen

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/waiting',
    name: 'waiting',
    component: WaitingScreen,
  },
  {
    path: '/join',
    name: 'join',
    component: JoinSession,
  },
  {
    path: '/game',
    name: 'game',
    component: GameScreen,
  },
  {
    path: '/result',
    name: 'result',
    component: ResultScreen, // Add the ResultScreen route
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

