import React, { useState } from 'react';
import {
  map as _map,
  filter as _filter,
  findIndex as _findIndex,
  forEach as _forEach,
  includes as _includes,
} from 'lodash';
import { DefaultProps } from '../theme';
import forwardRef from '../utils/forwardRef';
import TreeNode from './TreeNode';
import { FlatDataNode, TreeDataNode, CustomIcon } from './types';
import { processingFlatData, processingTreeData, deleteAllChildrenByNode } from './util';
import { TreeBox, TreeTitle } from './Tree.styles';

export interface TreeProps extends DefaultProps {
  /**
   * 扁平化数据
   */
  flatData?: FlatDataNode[];
  /**
   * 树形化数据
   */
  treeData?: TreeDataNode[];
  /**
   * 是否显示连接线
   * @default true
   */
  isShowLine?: boolean;
  /**
   * 是否展开所有
   * @default false
   */
  isExpandAll?: boolean;
  /**
   * 树标题
   */
  treeTitle?: string;
  /**
   * 自定义渲染展开/收紧Icon Function
   */
  customIcon?: () => CustomIcon;
  /**
   * 是否多选
   * @default false
   */
  isMultiple?: boolean;
  /**
   * 展开指定的节点 // TODO 实现很麻烦，需求场景不明确，待开发
   */
  expandKeys?: string[];
  /**
   * 展开到树层级
   * @default 0
   */
  expandLevel?: number;
  /**
   * 点击节点时触发事件
   */
  onClick?: (selectedKeys: string[]) => void;
}

export const Tree = forwardRef<TreeProps, 'div'>((props: TreeProps, ref) => {
  const {
    flatData,
    treeData,
    isExpandAll = false,
    isMultiple = false,
    treeTitle,
    expandKeys,
    expandLevel = 0,
    onClick,
    ...others
  } = props;
  // 完整的树数据
  const initFullData = () => {
    if (flatData) {
      return processingFlatData(flatData);
    }
    if (treeData) {
      return processingTreeData(treeData);
    }
    return [];
  };
  const [fullData] = useState<FlatDataNode[]>(initFullData());
  // 显示的树数据
  const initDisplayData = () => {
    if (isExpandAll) {
      return _map(fullData, (fn: FlatDataNode) => {
        return {
          isExpand: fn.cKeys.length > 0,
          ...fn,
        };
      });
    }
    return _map(
      _filter(fullData, (f: FlatDataNode) => f.level <= expandLevel),
      (fn: FlatDataNode) => {
        return {
          isExpand: fn.level < expandLevel && fn.cKeys.length > 0,
          ...fn,
        };
      }
    );
  };
  const [displayData, setDisplayData] = useState<FlatDataNode[]>(() => initDisplayData());
  const [selected, setSelected] = useState<string[]>([]);

  const toggleNode = (fn: FlatDataNode) => {
    const resTree = [].concat(displayData);
    const index = _findIndex(displayData, (item) => item.key === fn.key);
    // 收紧
    if (fn.isExpand) {
      deleteAllChildrenByNode(displayData, resTree, fn);
    }
    // 展开
    else {
      const addNode = [];
      _forEach(fullData, (f: FlatDataNode) => {
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

  const checkNode = (f: FlatDataNode) => {
    // 单选
    if (!isMultiple && f.key !== selected[0]) {
      setSelected([f.key]);
    }
    onClick(selected);
  };

  return (
    <TreeBox {...others} ref={ref}>
      {treeTitle && <TreeTitle>{treeTitle}</TreeTitle>}
      {_map(displayData, (t: FlatDataNode) => {
        return (
          <TreeNode
            nodeData={t}
            {...others}
            onToggle={toggleNode}
            onCheck={checkNode}
            checked={_includes(selected, t.key)}
          />
        );
      })}
    </TreeBox>
  );
});

Tree.displayName = '@kubed/components/Tree';
