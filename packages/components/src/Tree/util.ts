import {
  isArray as _isArray,
  forEach as _forEach,
  find as _find,
  map as _map,
  remove as _remove,
} from 'lodash';
import { FlatNode } from './types';

/**
 * 预处理传入的扁平化数据，按树的数据结构排序并增加一些节点属性
 * @param data
 */
const processingFlatData = (data: FlatNode[]): FlatNode[] => {
  if (!_isArray(data) || data.length === 0) return [];
  const res = [];
  const recursive = (parent = undefined, parentKey = [], isLasts = []) => {
    const childrenArray = [];
    let parentsKeyArray = [];
    let isLastsArray = [];
    const pk = parent ? parent.key : undefined;
    _forEach(data, (item: FlatNode) => {
      if (item.pKey === pk) {
        childrenArray.push(item);
      }
    });
    if (parent) {
      const p = _find(res, (item: FlatNode) => item.key === parent.key);
      if (p) {
        p.cKeys = childrenArray;
      }
      parentsKeyArray = [parent.key].concat(parentKey);
      isLastsArray = [parent.isLast].concat(isLasts);
    }
    _forEach(childrenArray, (item: FlatNode, index: number) => {
      const isLast = index === childrenArray.length - 1;
      const newItem = {
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
 * 删除某个节点的所有子节点，收紧node时调用
 * @param parent
 */
const deleteAllChildrenByNode = (tree: FlatNode[], resTree: FlatNode[], node: FlatNode) => {
  const recursive = (parent: FlatNode) => {
    const children = parent.cKeys;
    _forEach(children, (c: FlatNode) => {
      const temp = _find(tree, (i: FlatNode) => i.key === c.key);
      _remove(resTree, temp);
      if (temp.isExpand) {
        recursive(temp);
      }
    });
  };
  recursive(node);
  return resTree;
};

export { processingFlatData, deleteAllChildrenByNode };
