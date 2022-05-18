import { ReactNode } from 'react';

type FlatDataNode = {
  // 参数数据中的属性
  key: string;
  title: string | ReactNode;
  pKey?: string;
  // 以下为组件内部需要的属性
  cKeys?: string[]; //子节点树
  level?: number; //所在层级
  isLast?: boolean; //是否为最后的兄弟节点
  pKeys?: string[]; //父节点冒泡树keys，一直冒泡到顶层
  isLasts?: boolean[]; //所在的父节点树的父节点是否为最后的兄弟节点
  isExpand?: boolean; //是否展开
  isShow?: boolean; //是否显示
};

type TreeDataNode = {
  // 参数数据中的属性
  key: string;
  title: string | ReactNode;
  children?: TreeDataNode[];
  // 以下为组件内部需要的属性
  cKeys?: string[]; //子节点树
  level?: number; //所在层级
  pKey?: string; //第一个父节点
  pKeys?: string[]; //所有父节点树，一直冒泡到顶层
  isLast?: boolean; //是否为最后的兄弟节点
  isLasts?: boolean[]; //所在的父节点树的父节点是否为最后的兄弟节点
  isExpand?: boolean; //是否展开
  isShow?: boolean; //是否显示
};

type CustomIcon = {
  open: ReactNode;
  close: ReactNode;
};

export { FlatDataNode, TreeDataNode, CustomIcon };
