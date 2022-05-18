import React, { useMemo } from 'react';
import { TriangleRight, TriangleDown } from '@kubed/icons';
import { isFunction as _isFunction } from 'lodash';
import { FlatDataNode, CustomIcon } from './types';
import { DefaultProps } from '../theme';
import { TreeNodeBox, IconBox, ConnectLine, TreeNodeTitleBox, FillingLineBox } from './Tree.styles';
import forwardRef from '../utils/forwardRef';

export interface TreeProps extends DefaultProps {
  nodeData?: FlatDataNode;
  isShowLine?: boolean;
  onToggle?: (fn: FlatDataNode) => void;
  onPick?: (fn: FlatDataNode) => void;
  customIcon?: () => CustomIcon;
  selected?: boolean;
}

const TreeNode = forwardRef<TreeProps, 'div'>(
  ({ nodeData, isShowLine = true, selected, onToggle, onPick, customIcon, ...others }, ref) => {
    const { title, cKeys, isExpand, level, isLast, isLasts, isShow } = nodeData;

    const toggleNode = () => {
      onToggle(nodeData);
    };

    const pickNode = () => {
      onPick(nodeData);
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
          <TreeNodeTitleBox cKeys={cKeys} selected={selected} onClick={pickNode}>
            {title}
          </TreeNodeTitleBox>
        </TreeNodeBox>
      )
    );
  }
);

export default TreeNode;
