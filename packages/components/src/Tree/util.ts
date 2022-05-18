import {
  isArray as _isArray,
  forEach as _forEach,
  find as _find,
  map as _map,
  remove as _remove,
  filter as _filter,
  last as _last,
} from 'lodash';
import { FlatDataNode, TreeDataNode } from './types';

/**
 * 预处理传入的扁平化数据，扁平化，按树的数据结构排序并增加一些节点属性
 * @param data
 */
const processingFlatData = (data: FlatDataNode[]): FlatDataNode[] => {
  if (!_isArray(data) || data.length === 0) return [];
  const res = [];
  const recursive = (parent = undefined, parentsKey = [], isLasts = []) => {
    const childrenArray = [];
    let parentsKeyArray = [];
    let isLastsArray = [];
    const pk = parent ? parent.key : undefined;
    _forEach(data, (item: FlatDataNode) => {
      if (item.pKey === pk) {
        childrenArray.push(item);
      }
    });
    if (parent) {
      const p = _find(res, (item: FlatDataNode) => item.key === parent.key);
      if (p) {
        p.cKeys = _map(childrenArray, (n: FlatDataNode) => n.key);
      }
      parentsKeyArray = [parent.key].concat(parentsKey);
      isLastsArray = [parent.isLast].concat(isLasts);
    }
    _forEach(childrenArray, (item: FlatDataNode, index: number) => {
      const isLast = index === childrenArray.length - 1;
      const newItem: FlatDataNode = {
        ...item,
        isLast,
        pKeys: parentsKeyArray,
        isLasts: isLastsArray,
        level: (parent ? parent.level : -1) + 1,
      };
      res.push(newItem);
      recursive(newItem, parentsKeyArray, isLastsArray);
    });
  };
  recursive();
  return res;
};

/**
 * 预处理传入的树形化数据，扁平化，按树的数据结构排序并增加一些节点属性
 * @param data
 */
const processingTreeData = (data: TreeDataNode[]): TreeDataNode[] => {
  if (!_isArray(data) || data.length === 0) return [];
  const res = [];
  const recursive = (
    children: TreeDataNode[],
    level: number,
    parentsKey: string[] = [],
    isLasts: boolean[] = []
  ) => {
    const l = Number(level + 1);
    let parentsKeyArray = [];
    let isLastsArray = [];
    _forEach(children, (item: TreeDataNode, index: number) => {
      const isLast = index === children.length - 1;
      const hasChildren = item.children && item.children.length > 0;
      const newItem: TreeDataNode = {
        key: item.key,
        title: item.title,
        isLast,
        level: l,
        isLasts,
        pKeys: parentsKey,
        pKey: parentsKey[0],
      };
      if (hasChildren) {
        newItem.cKeys = _map(item.children, (n: TreeDataNode) => n.key);
      } else {
        newItem.cKeys = [];
      }
      res.push(newItem);
      if (hasChildren) {
        isLastsArray = [isLast].concat(isLasts);
        parentsKeyArray = [item.key].concat(parentsKey);
        recursive(item.children, l, parentsKeyArray, isLastsArray);
      }
    });
  };
  recursive(data, -1);
  return res;
};

/**
 * 删除某个节点的所有子节点，收紧node时调用
 * @param parent
 */
const deleteAllChildrenByNode = (
  tree: FlatDataNode[],
  resTree: FlatDataNode[],
  node: FlatDataNode
) => {
  const recursive = (parent: FlatDataNode) => {
    const children = parent.cKeys;
    _forEach(children, (c: string) => {
      const temp = _find(tree, (i: FlatDataNode) => i.key === c);
      _remove(resTree, temp);
      if (temp.isExpand) {
        recursive(temp);
      }
    });
  };
  recursive(node);
  return resTree;
};

/**
 * 找到某个节点的所有子节点key，返回这个key数组
 */
const findAllCKeysByNode = (tree: FlatDataNode[], node: FlatDataNode) => {
  const resCKeys = [];
  const { cKeys } = node;
  const recursive = (parentKeys: string[]) => {
    if (parentKeys && parentKeys.length > 0) {
      _forEach(parentKeys, (key: string) => {
        resCKeys.push(key);
        const temp = _find(tree, (i: FlatDataNode) => i.key === key);
        recursive(temp.cKeys);
      });
    }
  };
  recursive(cKeys);
  return resCKeys;
};

export { processingFlatData, processingTreeData, deleteAllChildrenByNode, findAllCKeysByNode };
