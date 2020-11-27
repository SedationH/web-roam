import createRouteMap from "./create-route-map";
import createRoute from "./utils/route";

export default function createMatcher(routes) {
  // createRouteMap 解析路由表
  // pathMap -->   { 路由地址：record对象(path, component, parent) }
  const { pathList, pathMap } = createRouteMap(routes);
  function match(path) {
    return createRoute(pathMap[path], path);
  }

  console.log(match("/music"));
  console.log(match("/music/pop"));
  console.log(match("/foo"));

  function addRoutes(routes) {
    createRouteMap(routes, pathList, pathMap);
  }

  return {
    match,
    addRoutes
  };
}
