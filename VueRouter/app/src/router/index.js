import Vue from 'vue'
import VueRouter from '../vue-router'
//import VueRouter from "vue-router"
//Vue.use 如果放一个函数默认会执行
Vue.use(VueRouter) //VueRouter 会调用插件的install方法

// {'/':Home,'/a':HomeA,'/b':HomeB,'/about':About}
const routes = [
  
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    children: [
      {
        path: 'a', // children中路径不能增加/
        component: {
          render: (h) => <h1>a</h1>
        }
      },
      {
        path: 'b',
        component: {
          render: (h) => <h1>b</h1>
        }
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    children:[
      {
        path:"a",
        component:{
          render:(h)=><div>about a</div>
        }
      },
      {
        path:"b",
        component:{
          render:(h)=><div>about b</div>
        }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

router.mathcer.addRoute([
  {
    path:"/xxx",
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  }
])

export default router
