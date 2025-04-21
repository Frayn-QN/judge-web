import { ProblemLevel, TaskStatus } from "@/entity/enums";

// 根据枚举项获取颜色值
export function getLevelColor(level) {
  const levelColorMap = {
    [ProblemLevel.lv1]: "#67C23A",
    [ProblemLevel.lv2]: "#409EFF",
    [ProblemLevel.lv3]: "#00CED1",
    [ProblemLevel.lv4]: "#E6A23C",
    [ProblemLevel.lv5]: "#F56C6C",
  };
  return levelColorMap[level] || "info";
}

export function getStatusType(status) {
  const statusColorMap = {
    [TaskStatus.AC]: "success",
    [TaskStatus.WA]: "danger",
    [TaskStatus.RE]: "warning",
    [TaskStatus.CE]: "warning",
    [TaskStatus.TLE]: "warning",
    default: "info",
  };
  return statusColorMap[status];
}

export function picSrc(picBase64) {
  return "data:image/png;base64," + picBase64;
}
