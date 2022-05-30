import {
  isArray as _isArray,
  forEach as _forEach,
  find as _find,
  map as _map,
  findIndex as _findIndex,
} from 'lodash';
import { FlatDataNode, TreeDataNode } from './types';

/**
 * 预处理传入的扁平化数据，扁平化，按树的数据结构排序并增加一些节点属性
 * @param data
 */
const processingFlatData = (data: FlatDataNode[], f?: FlatDataNode): FlatDataNode[] => {
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
        isShow: true,
      };
      res.push(newItem);
      recursive(newItem, parentsKeyArray, isLastsArray);
    });
  };
  if (f) {
    recursive(f, f.pKeys, f.isLasts);
  } else recursive();
  return res;
};

/**
 * 预处理传入的树形化数据，扁平化，按树的数据结构排序并增加一些节点属性
 * @param data
 */
const processingTreeData = (data: TreeDataNode[], f?: FlatDataNode): TreeDataNode[] => {
  if (!_isArray(data) || data.length === 0) return [];
  const res = [];
  const recursive = (
    children: TreeDataNode[],
    parent = undefined,
    parentKeys = [],
    isLasts = []
  ) => {
    const l = Number((parent ? parent.level : -1) + 1);
    let parentsKeyArray: string[] = parent ? [parent.key] : [];
    let isLastsArray: boolean[] = parent ? [parent.isLast] : [];
    isLastsArray = isLastsArray.concat(isLasts);
    parentsKeyArray = parentsKeyArray.concat(parentKeys);
    _forEach(children, (item: TreeDataNode, index: number) => {
      const isLast = index === children.length - 1;
      const hasChildren = item.children && item.children.length > 0;
      const newItem: TreeDataNode = {
        ...item,
        isLast,
        level: l,
        isLasts: isLastsArray,
        pKeys: parentsKeyArray,
        pKey: parentsKeyArray[0],
        isShow: true,
      };
      if (hasChildren) {
        newItem.cKeys = _map(item.children, (n: TreeDataNode) => n.key);
      } else {
        newItem.cKeys = [];
      }
      res.push(newItem);
      if (hasChildren) {
        recursive(newItem.children, newItem, parentsKeyArray, isLastsArray);
      }
    });
  };
  if (f) {
    recursive(data, f, f.pKeys, f.isLasts);
  } else recursive(data);
  return res;
};

/**
 * 预处理传入的异步加载的数据，并扁平化，按树的数据结构排序并增加一些节点属性
 * @param data
 */
const processingLazyLoadData = (
  loadData: FlatDataNode[],
  tree: FlatDataNode[],
  f: FlatDataNode,
  isFlat: boolean
): FlatDataNode[] => {
  let resLoadData = [];
  const cKeys = [];
  const resTree = [].concat(tree);
  if (isFlat) {
    resLoadData = processingFlatData(loadData, f);
  } else resLoadData = processingTreeData(loadData, f);
  const index = _findIndex(resTree, f);
  const nodeTemp = resTree[index];
  nodeTemp.isExpand = true;
  _forEach(resLoadData, (n: FlatDataNode, i: number) => {
    if (n.pKey === nodeTemp.key) {
      cKeys.push(n.key);
    }
    if (n.cKeys.length > 0) {
      resLoadData[i].isExpand = true;
    }
  });
  nodeTemp.cKeys = cKeys;
  delete nodeTemp.isLazy;
  resTree.splice(index + 1, 0, ...resLoadData);
  return resTree;
};

/**
 * 显示某个节点下的子节点，展开node时调用
 *
 */
const changeChildrenShowByNode = (tree: FlatDataNode[], f: FlatDataNode) => {
  const resTree = [].concat(tree);
  const parent = _find(resTree, (i: FlatDataNode) => i.key === f.key);
  const children = parent.cKeys;
  parent.isExpand = true;
  _forEach(children, (c: string) => {
    const child = _find(resTree, (i: FlatDataNode) => i.key === c);
    child.isShow = true;
  });
  return resTree;
};

/**
 * 隐藏某个节点下的所有子节点，收紧node时调用
 *
 */
const changeAllChildrenHiddenByNode = (tree: FlatDataNode[], f: FlatDataNode) => {
  const resTree = [].concat(tree);
  const parent = _find(resTree, (i: FlatDataNode) => i.key === f.key);
  parent.isExpand = false;
  const recursive = (p: FlatDataNode) => {
    const children = p.cKeys;
    _forEach(children, (c: string) => {
      const child = _find(resTree, (i: FlatDataNode) => i.key === c);
      child.isShow = false;
      if (child.isExpand) {
        child.isExpand = false;
        recursive(child);
      }
    });
  };
  recursive(f);
  return resTree;
};

/**
 * 找到某个节点的所有子节点key，返回这个key数组
 */
const findAllCKeysByNode = (tree: FlatDataNode[], f: FlatDataNode) => {
  const resCKeys = [];
  const { cKeys } = f;
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

export {
  processingFlatData,
  processingTreeData,
  processingLazyLoadData,
  changeAllChildrenHiddenByNode,
  changeChildrenShowByNode,
  findAllCKeysByNode,
};
