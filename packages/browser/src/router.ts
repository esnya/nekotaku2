/* eslint @typescript-eslint/no-explicit-any: off */

import Vue from 'vue';
import Router from 'vue-router';
import Loading from './views/Loading.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => ({
        component: import(/* webpackChunkName: "Home" */ './views/Home.vue') as any,
        loading: Loading,
      }),
    },
    {
      path: '/rooms/:roomId',
      name: 'room',
      component: () => ({
        component: import(/* webpackChunkName: "Room" */ './views/Room.vue') as any,
        loading: Loading,
      }),
    },
    {
      path: '*',
      name: 'not-found',
      component: () => ({
        component: import(/* webpackChunkName: "NotFound" */ './views/NotFound.vue') as any,
        loading: Loading,
      }),
    },
  ],
});
