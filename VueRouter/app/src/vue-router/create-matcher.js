import {createRouteMap} from "./create-route-map"

export default function createMatcher(routes){
    //创建映射表
    let {pathMap} = createRouteMap(routes);
    function addRoutes(routes){ // 动态添加路由
        createRouteMap(routes,pathMap);
    }
    function addRoute(route){
        createRouteMap([route],pathMap);
    }
    function match(loaction){
        return pathMap[loaction]
    }

    return{
        addRoutes, //添加多个路由
        addRoute, //添加一个路由
        match,//稍后给我个路径返回给你对应的路由
    }
}