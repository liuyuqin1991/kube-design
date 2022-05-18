import React from 'react';
import { TriangleRight, TriangleDown } from '@kubed/icons';
import { isFunction as _isFunction } from 'lodash';
import { FlatDataNode, CustomIcon } from './types';
import { DefaultProps } from '../theme';
import { TreeNodeBox, IconBox, ConnectLine, TreeNodeTitleBox, FillingLineBox } from './Tree.styles';
import forwardRef from '../utils/forwardRef';

export interface TreeProps extends DefaultProps {
  nodeData?: FlatDataNode;
  isShowLine?: boolean;
  onToggle: (fn: FlatDataNode) => void;
  onCheck: (fn: FlatDataNode) => void;
  customIcon?: () => CustomIcon;
  checked: boolean;
}

const TreeNode = forwardRef<TreeProps, 'div'>(
  (
    { className, nodeData, isShowLine = true, checked, onToggle, onCheck, customIcon, ...others },
    ref
  ) => {
    const { title, cKeys, isExpand, level, isLast, isLasts } = nodeData;

    const toggleNode = () => {
      onToggle(nodeData);
    };

    const checkNode = () => {
      onCheck(nodeData);
    };

    const renderIcon = () => {
      if (_isFunction(customIcon)) {
        const iconNodes = customIcon();
        return isExpand ? iconNodes.open : iconNodes.close;
      }
      return isExpand ? <TriangleDown size={14} /> : <TriangleRight size={14} />;
    };

    return (
      <TreeNodeBox {...others} ref={ref}>
        {isShowLine ? (
          <ConnectLine level={level} isLast={isLast} isLasts={isLasts} />
        ) : (
          <FillingLineBox level={level} />
        )}
        {cKeys.length > 0 && <IconBox onClick={toggleNode}>{renderIcon()}</IconBox>}
        <TreeNodeTitleBox cKeys={cKeys} checked={checked} onClick={checkNode}>
          {title}
        </TreeNodeTitleBox>
      </TreeNodeBox>
    );
  }
);

export default TreeNode;
