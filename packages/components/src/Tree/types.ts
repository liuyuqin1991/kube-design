export type FlatNode = {
  key: string;
  title: string;
  pKey?: string;
  // 以下为组件内部需要的属性
  // 下面为结构属性，fullData使用
  cKeys?: FlatNode[]; //子节点树
  level?: number; //所在层级
  isLast?: boolean; //是否为最后的兄弟节点
  pKeys?: string[]; //父节点冒泡树keys，一直冒泡到顶层
  isLasts?: boolean[]; //所在的父节点树的父节点是否为最后的兄弟节点
  // 下面为显示属性，displayData使用
  isExpand?: boolean; //是否展开
};

export type TreeDataType = {
  key: string;
  title: string;
  children?: TreeDataType;
};
