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
  processingLazyLoadData,
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
  customIconFn?: () => CustomIcon;
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
  onSelect?: (selectedKeys: string) => void;
  /**
   * 点击复选框触发事件
   */
  onCheck?: (selectedKeys: string[]) => void;
  /**
   * 懒加载子节点，必须节点上isLazy为true才能触发
   */
  onLoad?: (selectedKeys: string) => Promise<FlatDataNode[]>;
}

export const Tree = forwardRef<TreeProps, 'div'>((props: TreeProps, ref) => {
  const {
    flatData,
    treeData,
    isExpandAll = false,
    isMultiple = false,
    treeTitle,
    defaultExpandLevel = 0,
    onSelect,
    onCheck,
    onLoad,
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
      _forEach(resTree, (f: FlatDataNode) => {
        if (f.cKeys.length > 0 && !f.isLazy) {
          f.isExpand = true;
        }
      });
    } else {
      _forEach(resTree, (f: FlatDataNode) => {
        if (f.level <= defaultExpandLevel) {
          if (f.level < defaultExpandLevel && f.cKeys.length > 0 && !f.isLazy) {
            f.isExpand = true;
          }
        } else {
          f.isShow = false;
        }
      });
    }
    return resTree;
  };
  const [tree, setTree] = useState<FlatDataNode[]>(initTree());
  // pick相关
  const [selectNodeKey, setSelectNodeKey] = useState<string>();
  // 多选复选框相关
  const [checkList, setCheckList] = useState<string[]>([]);
  const [indeterminateList, setIndeterminateList] = useState<string[]>([]);

  const toggle = (f: FlatDataNode) => {
    // 收紧
    if (f.isExpand) {
      setTree(changeAllChildrenHiddenByNode(tree, f));
    }
    // 展开
    else {
      setTree(changeChildrenShowByNode(tree, f));
    }
  };

  const select = (f: FlatDataNode) => {
    setSelectNodeKey(f.key);
    if (_isFunction(onSelect)) {
      onSelect(selectNodeKey);
    }
  };

  const check = (f: FlatDataNode, c: boolean) => {
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

  const load = async (f: FlatDataNode): Promise<void> => {
    if (_isFunction(onLoad) && f.cKeys.length === 0) {
      await onLoad(f.key)
        .then((data: FlatDataNode[]) => {
          if (data && data.length > 0) {
            setTree(processingLazyLoadData(data, tree, f, !!flatData));
          }
        })
        .finally(() => {
          return new Promise((resolve) => resolve());
        });
    }
  };

  return (
    <TreeBox {...others} ref={ref}>
      {treeTitle && <TreeTitle>{treeTitle}</TreeTitle>}
      {_map(tree, (f: FlatDataNode) => {
        return (
          <TreeNode
            key={f.key}
            nodeData={f}
            onToggle={toggle}
            onSelect={select}
            onCheck={check}
            onLoad={load}
            isSelected={selectNodeKey === f.key}
            isChecked={_includes(checkList, f.key)}
            isIndeterminate={_includes(indeterminateList, f.key)}
            isMultiple={isMultiple}
            haveChildren={f.cKeys.length > 0}
            {...others}
          />
        );
      })}
    </TreeBox>
  );
});

Tree.displayName = '@kubed/components/Tree';
