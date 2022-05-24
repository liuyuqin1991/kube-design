import React, { useMemo } from 'react';
import { TriangleRight, TriangleDown } from '@kubed/icons';
import { isFunction as _isFunction } from 'lodash';
import { Checkbox } from '../index';
import { FlatDataNode, CustomIcon } from './types';
import { DefaultProps } from '../theme';
import {
  TreeNodeBox,
  IconBox,
  ConnectLine,
  TreeNodeTitleBox,
  FillingLineBox,
  CheckboxBox,
} from './Tree.styles';
import forwardRef from '../utils/forwardRef';

export interface TreeNodeProps extends DefaultProps {
  nodeData?: FlatDataNode;
  isShowLine?: boolean;
  isMultiple?: boolean;
  // 节点是否点击
  isSelected?: boolean;
  // 多选框是否选中
  isChecked?: boolean;
  // 多选框是否不确定，用于存在子节点的父节点多选框
  isIndeterminate?: boolean;
  // 是否有子节点
  haveChildren: boolean;
  onToggle?: (fn: FlatDataNode) => void;
  onPick?: (fn: FlatDataNode) => void;
  onCheck?: (fn: FlatDataNode, c: boolean) => void;
  customIconFn?: () => CustomIcon;
}

const TreeNode = forwardRef<TreeNodeProps, 'div'>(
  (
    {
      nodeData,
      isShowLine = true,
      isMultiple,
      isSelected,
      isChecked,
      haveChildren,
      isIndeterminate,
      onToggle,
      onPick,
      onCheck,
      customIconFn,
      ...others
    },
    ref
  ) => {
    const { key, title, isExpand, level, isLast, isLasts, isShow, isDisabled } = nodeData;

    const toggleNode = () => {
      onToggle(nodeData);
    };

    const pickNode = () => {
      if (isDisabled) return;
      onPick(nodeData);
    };

    const checkNode = () => {
      if (isDisabled) return;
      onCheck(nodeData, !isChecked);
    };

    const renderIcon = useMemo(() => {
      if (_isFunction(customIconFn)) {
        const iconNodes = customIconFn();
        return isExpand ? iconNodes.open : iconNodes.close;
      }
      return isExpand ? <TriangleDown size={14} /> : <TriangleRight size={14} />;
    }, [nodeData.isExpand]);

    return (
      isShow && (
        <TreeNodeBox {...others} ref={ref}>
          {isShowLine ? (
            <ConnectLine level={level} isLast={isLast} isLasts={isLasts} />
          ) : (
            <FillingLineBox level={level} />
          )}
          {haveChildren && <IconBox onClick={toggleNode}>{renderIcon}</IconBox>}
          {isMultiple && (
            <CheckboxBox>
              <Checkbox
                disabled={isDisabled}
                checked={isChecked}
                indeterminate={isIndeterminate}
                onChange={checkNode}
              />
            </CheckboxBox>
          )}
          <TreeNodeTitleBox
            selected={isSelected}
            isDisabled={isDisabled}
            onClick={pickNode}
            data-key={key}
          >
            {title}
          </TreeNodeTitleBox>
        </TreeNodeBox>
      )
    );
  }
);

export default TreeNode;
