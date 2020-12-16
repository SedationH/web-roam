export default function createRoute(record, path) {
  // 存储跟当前path 相关的所有record
  // path --> /music/path
  const matched = [];

  while (record) {
    matched.unshift(record);
    record = record.parentRecord;
  }

  return {
    matched,
    path
  };
}
