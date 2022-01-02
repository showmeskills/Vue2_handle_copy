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

// router.mathcer.addRoute([
//   {
//     path:"/xxx",
//     component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
//   }
// ])

//导航守卫 当从一个路由切换到另一个路由的时候
//组件要先离开 -> beforeRouteLeave
//切换到新的组件里 -> beforeEach
// A ? a=1 -> A? a=2 组件更新了 (beforeRouteUpdate)
// 不是更新 就要走路由中配置的钩子 beforeEnter
// 走组件的钩子 beforeRouteEnter
// 确认切换完毕
// 都走完了 afterEach
// 通过数组把钩子 保存起来 [beforeEach,(afterEach),beforeEach]

router.beforeEach((from,to,next)=>{
  setTimeout(()=>{
    console.log(1)
    next()
  },1000)
})

router.beforeEach((from,to,next)=>{
  setTimeout(()=>{
    console.log(2)
    next()
  },1000)
})

export default router
