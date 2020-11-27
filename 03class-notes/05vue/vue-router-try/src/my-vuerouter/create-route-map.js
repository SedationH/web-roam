export default function createRouteMap(
  routes,
  oldPathList,
  oldPathMap
) {
  const pathList = oldPathList || [];
  const pathMap = oldPathMap || {};
  routes.forEach(route => {
    addRouteRecord(route, pathList, pathMap);
  });

  return {
    pathList,
    pathMap
  };
}

function addRouteRecord(
  route,
  pathList,
  pathMap,
  parentRecord
) {
  // 进行拼接 子组件 pop -> /music/pop
  const path = parentRecord
    ? `${parentRecord.path}/${route.path}`
    : route.path;

  // pathMap 的属性是 path ，值是record对象（path， component，parent）
  const record = {
    path: path,
    component: route.component,
    parentRecord: parentRecord
  };

  // 判断当前的路由表中是否已经存在对应的路径
  if (!pathMap[path]) {
    pathList.push(path);
    pathMap[path] = record;
  }

  // 判断当前的的route是否有子路由
  if (route.children) {
    route.children.forEach(subRoute => {
      addRouteRecord(subRoute, pathList, pathMap, record);
    });
  }
}
