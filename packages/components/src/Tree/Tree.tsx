/* eslint-disable no-param-reassign */
import React, { useState } from 'react';
import { map as _map, forEach as _forEach, includes as _includes } from 'lodash';
import { DefaultProps } from '../theme';
import forwardRef from '../utils/forwardRef';
import TreeNode from './TreeNode';
import { FlatDataNode, TreeDataNode, CustomIcon } from './types';
import {
  processingFlatData,
  processingTreeData,
  changeChildrenShowByNode,
  changeAllChildrenHiddenByNode,
} from './util';
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
  const initTree = () => {
    let resTree = [];
    // 预处理数据
    if (flatData) {
      resTree = processingFlatData(flatData);
    }
    if (treeData) {
      resTree = processingTreeData(treeData);
    }
    // 根据props参数设置显隐展缩
    if (isExpandAll) {
      _forEach(resTree, (n: FlatDataNode) => {
        n.isShow = true;
        if (n.cKeys.length > 0) {
          n.isExpand = true;
        }
      });
    } else {
      _forEach(resTree, (n: FlatDataNode) => {
        if (n.level <= expandLevel) {
          n.isShow = true;
          if (n.level < expandLevel && n.cKeys.length > 0) {
            n.isExpand = true;
          }
        }
      });
    }
    return resTree;
  };
  const [tree, setTree] = useState<FlatDataNode[]>(initTree());
  const [selected, setSelected] = useState<string[]>([]);

  const toggleNode = (n: FlatDataNode) => {
    // 收紧
    if (n.isExpand) {
      setTree(changeAllChildrenHiddenByNode(tree, n));
    }
    // 展开
    else {
      setTree(changeChildrenShowByNode(tree, n));
    }
  };

  const pickNode = (f: FlatDataNode) => {
    // 单选
    if (!isMultiple && f.key !== selected[0]) {
      setSelected([f.key]);
    }
    onClick(selected);
  };

  return (
    <TreeBox {...others} ref={ref}>
      {treeTitle && <TreeTitle>{treeTitle}</TreeTitle>}
      {_map(tree, (t: FlatDataNode) => {
        return (
          <TreeNode
            key={t.key}
            nodeData={t}
            {...others}
            onToggle={toggleNode}
            onPick={pickNode}
            selected={_includes(selected, t.key)}
          />
        );
      })}
    </TreeBox>
  );
});

Tree.displayName = '@kubed/components/Tree';
