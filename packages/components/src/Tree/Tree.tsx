/* eslint-disable no-param-reassign */
import React, { useState } from 'react';
import {
  map as _map,
  forEach as _forEach,
  includes as _includes,
  every as _every,
  some as _some,
  find as _find,
  remove as _remove,
  isFunction as _isFunction,
} from 'lodash';
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
  defaultExpandKeys?: string[];
  /**
   * 展开到树层级
   * @default 0
   */
  defaultExpandLevel?: number;
  /**
   * 勾选指定的节点 // TODO 实现很麻烦，需求场景不明确，待开发
   */
  defaultCheckedKeys?: string[];
  /**
   * 点击节点时触发事件
   */
  onClick?: (selectedKeys: string) => void;
  /**
   * 点击复选框触发事件
   */
  onCheck?: (selectedKeys: string[]) => void;
}

export const Tree = forwardRef<TreeProps, 'div'>((props: TreeProps, ref) => {
  const {
    flatData,
    treeData,
    isExpandAll = false,
    isMultiple = false,
    treeTitle,
    defaultExpandLevel = 0,
    onClick,
    onCheck,
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
    // 根据props参数设置显隐展缩及多选
    if (isExpandAll) {
      _forEach(resTree, (n: FlatDataNode) => {
        n.isShow = true;
        if (n.cKeys.length > 0) {
          n.isExpand = true;
        }
      });
    } else {
      _forEach(resTree, (n: FlatDataNode) => {
        if (n.level <= defaultExpandLevel) {
          n.isShow = true;
          if (n.level < defaultExpandLevel && n.cKeys.length > 0) {
            n.isExpand = true;
          }
        }
      });
    }
    return resTree;
  };
  const [tree, setTree] = useState<FlatDataNode[]>(initTree());
  const [selectList, setSelectList] = useState<string>();
  const [checkList, setCheckList] = useState<string[]>([]);
  const [indeterminateList, setIndeterminateList] = useState<string[]>([]);

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
    if (!isMultiple && f.key !== selectList[0]) {
      setSelectList(f.key);
    }
    if (_isFunction(onClick)) {
      onClick(selectList);
    }
  };

  const checkNode = (f: FlatDataNode, c: boolean) => {
    const checkListTemp = [].concat(checkList);
    const indeterminateListTemp = [].concat(indeterminateList);
    // check
    if (c) {
      // 无子节点
      if (f.cKeys.length === 0) {
        checkListTemp.push(f.key);
      }
      // 有子节点
      else {
        // 节点是不确定节点
        _remove(indeterminateListTemp, (x: string) => x === f.key);
        checkListTemp.push(f.key);
        // 递归check子节点
        const recursive = (parent: FlatDataNode) => {
          _forEach(parent.cKeys, (k: string) => {
            if (!_includes(checkListTemp, k)) {
              _remove(indeterminateListTemp, (x: string) => x === k);
              checkListTemp.push(k);
            }
            const child = _find(tree, (n: FlatDataNode) => n.key === k);
            if (child.cKeys.length > 0) {
              recursive(child);
            }
          });
        };
        recursive(f);
      }
      // 同步父节点
      _forEach(f.pKeys, (k: string) => {
        const temp = _find(tree, (n: FlatDataNode) => n.key === k);
        if (_every(temp.cKeys, (ck: string) => _includes(checkListTemp, ck))) {
          checkListTemp.push(k);
          _remove(indeterminateListTemp, (x: string) => x === k);
        } else if (!_includes(indeterminateListTemp, k)) {
          indeterminateListTemp.push(k);
        }
      });
    }
    // uncheck
    else {
      // 无子节点
      if (f.cKeys.length === 0) {
        _remove(checkListTemp, (x: string) => x === f.key);
      }
      // 有子节点，递归uncheck子节点
      else {
        const recursive = (parent: FlatDataNode) => {
          _remove(checkListTemp, (x: string) => x === f.key);
          _forEach(parent.cKeys, (k: string) => {
            _remove(checkListTemp, (x: string) => x === k);
            const child = _find(tree, (n: FlatDataNode) => n.key === k);
            if (child.cKeys.length > 0) {
              recursive(child);
            }
          });
        };
        recursive(f);
      }
      // 同步父节点
      _forEach(f.pKeys, (k: string) => {
        const temp = _find(tree, (n: FlatDataNode) => n.key === k);
        _remove(checkListTemp, (x: string) => x === k);
        if (
          _some(temp.cKeys, (ck: string) => _includes(checkListTemp, ck)) &&
          !_includes(indeterminateListTemp, k)
        ) {
          indeterminateListTemp.push(k);
        }
        if (
          !_some(temp.cKeys, (ck: string) => _includes(checkListTemp, ck)) &&
          !_some(temp.cKeys, (ck: string) => _includes(indeterminateListTemp, ck))
        ) {
          _remove(indeterminateListTemp, (x: string) => x === k);
        }
      });
    }
    setCheckList(checkListTemp);
    setIndeterminateList(indeterminateListTemp);
    if (_isFunction(onCheck)) {
      onCheck(checkListTemp);
    }
  };

  return (
    <TreeBox {...others} ref={ref}>
      {treeTitle && <TreeTitle>{treeTitle}</TreeTitle>}
      {_map(tree, (n: FlatDataNode) => {
        return (
          <TreeNode
            key={n.key}
            nodeData={n}
            onToggle={toggleNode}
            onPick={pickNode}
            onCheck={checkNode}
            selected={_includes(selectList, n.key)}
            checked={_includes(checkList, n.key)}
            indeterminate={_includes(indeterminateList, n.key)}
            isMultiple={isMultiple}
            {...others}
          />
        );
      })}
    </TreeBox>
  );
});

Tree.displayName = '@kubed/components/Tree';
