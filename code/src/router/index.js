import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter)

import Index from "../components/index.vue";
import E1 from '../components/e1.vue'
import E2 from '../components/e2.vue'
import Eg12 from '../components/eg12.vue'
import Eg1301 from '../components/eg1301.vue'
import Eg1302 from '../components/eg1302.vue'
import Eg1401 from '../components/eg1401.vue'
import Rewrite1 from '../components/rewrite1.vue'
import Eg1901 from '../components/eg1901.vue'

const routes = [{
    path: '/',
    name: 'index',
    component: Index,
},
{
    path: '/e1',
    name: 'e1',
    component: E1,
},
{
    path: '/e2',
    name: 'e2',
    component: E2,
},
{
    path: '/eg12',
    name: 'eg12',
    component: Eg12,
},
{
    path: '/eg1301',
    name: 'eg1301',
    component: Eg1301,
},
{
    path: '/eg1302',
    name: 'eg1302',
    component: Eg1302,
},
{
    path: '/eg1401',
    name: 'eg1401',
    component: Eg1401, 
},
{
    path: '/rewrite1',
    name: 'rewrite1',
    component: Rewrite1, 
},
{
    path: '/eg1901',
    name: 'eg1901',
    component: Eg1901, 
}
]
const router = new VueRouter({
    routes,
    mode: "history",
})

export default router