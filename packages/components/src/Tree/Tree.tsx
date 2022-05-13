import React, { useState } from 'react';
import {
  map as _map,
  filter as _filter,
  findIndex as _findIndex,
  forEach as _forEach,
} from 'lodash';
import { DefaultProps } from '../theme';
import forwardRef from '../utils/forwardRef';
import TreeNode from './TreeNode';
import { FlatNode } from './types';
import { processingFlatData, deleteAllChildrenByNode } from './util';
import { TreeBox, TreeTitle } from './Tree.styles';

export interface TreeProps extends DefaultProps {
  flatData?: FlatNode[];
  showLine?: boolean;
  isExpandAll?: boolean;
  treeTitle?: string;
}

export const Tree = forwardRef<TreeProps, 'div'>((props: TreeProps, ref) => {
  const { flatData, isExpandAll = false, treeTitle, ...others } = props;
  // 完整的树数据
  const [fullData] = useState<FlatNode[]>(() => processingFlatData(flatData));
  // 显示的树数据
  const initDisplayData = () => {
    if (isExpandAll) {
      return _map(fullData, (fn: FlatNode) => {
        return {
          isExpand: fn.cKeys.length > 0,
          ...fn,
        };
      });
    }
    return _map(
      _filter(fullData, (f: FlatNode) => f.level === 0),
      (fn: FlatNode) => {
        return {
          isExpand: false,
          ...fn,
        };
      }
    );
  };
  const [displayData, setDisplayData] = useState<FlatNode[]>(() => initDisplayData());

  const toggleNode = (fn: FlatNode) => {
    const resTree = [].concat(displayData);
    const index = _findIndex(displayData, (item) => item.key === fn.key);
    // 收紧
    if (fn.isExpand) {
      deleteAllChildrenByNode(displayData, resTree, fn);
    }
    // 展开
    else {
      const addNode = [];
      _forEach(fullData, (f: FlatNode) => {
        if (f.pKey === fn.key) {
          addNode.push({
            isExpand: false,
            ...f,
          });
        }
      });
      resTree.splice(index + 1, 0, ...addNode);
    }
    resTree[index].isExpand = !resTree[index].isExpand;
    setDisplayData(resTree);
  };

  return (
    <TreeBox {...others} ref={ref}>
      {treeTitle && <TreeTitle>{treeTitle}</TreeTitle>}
      {_map(displayData, (t: FlatNode) => {
        return <TreeNode nodeData={t} {...others} onToggle={toggleNode} />;
      })}
    </TreeBox>
  );
});

Tree.displayName = '@kubed/components/Tree';
