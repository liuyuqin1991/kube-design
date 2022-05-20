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

export interface TreeProps extends DefaultProps {
  nodeData?: FlatDataNode;
  isShowLine?: boolean;
  isMultiple?: boolean;
  // 节点是否点击
  selected?: boolean;
  // 多选框是否选中
  checked?: boolean;
  // 多选框是否不确定，用于存在子节点的父节点多选框
  indeterminate?: boolean;
  onToggle?: (fn: FlatDataNode) => void;
  onPick?: (fn: FlatDataNode) => void;
  onCheck?: (fn: FlatDataNode, c: boolean) => void;
  customIcon?: () => CustomIcon;
}

const TreeNode = forwardRef<TreeProps, 'div'>(
  (
    {
      nodeData,
      isShowLine = true,
      isMultiple,
      selected,
      checked,
      indeterminate,
      onToggle,
      onPick,
      onCheck,
      customIcon,
      ...others
    },
    ref
  ) => {
    const { key, title, cKeys, isExpand, level, isLast, isLasts, isShow, isDisabled } = nodeData;

    const toggleNode = () => {
      onToggle(nodeData);
    };

    const pickNode = () => {
      if (isDisabled) return;
      onPick(nodeData);
    };

    const checkNode = () => {
      if (isDisabled) return;
      onCheck(nodeData, !checked);
    };

    const renderIcon = useMemo(() => {
      if (_isFunction(customIcon)) {
        const iconNodes = customIcon();
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
          {cKeys.length > 0 && <IconBox onClick={toggleNode}>{renderIcon}</IconBox>}
          {isMultiple && (
            <CheckboxBox>
              <Checkbox
                disabled={isDisabled}
                checked={checked}
                indeterminate={indeterminate}
                onChange={checkNode}
              />
            </CheckboxBox>
          )}
          <TreeNodeTitleBox
            cKeys={cKeys}
            selected={selected}
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
