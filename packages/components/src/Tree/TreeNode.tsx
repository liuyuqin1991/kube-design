import React from 'react';
import { TriangleRight, TriangleDown } from '@kubed/icons';
import { FlatNode } from './types';
import { DefaultProps } from '../theme';
import { TreeNodeBox, IconBox, ConnectLine, TitleBox, FillingLineBox } from './Tree.styles';
import forwardRef from '../utils/forwardRef';

export interface TreeProps extends DefaultProps {
  nodeData?: FlatNode;
  showLine?: boolean;
  onToggle?: (fn: FlatNode) => void;
}

const TreeNode = forwardRef<TreeProps, 'div'>(
  ({ className, nodeData, showLine, onToggle, ...others }, ref) => {
    const { title, cKeys, isExpand } = nodeData;

    const toggleNode = () => {
      onToggle(nodeData);
    };

    const renderIcon = () => {
      // 有子节点，显示icon
      if (isExpand) {
        return <TriangleDown size={14} />;
      }
      return <TriangleRight size={14} />;
    };

    return (
      <TreeNodeBox {...others} ref={ref}>
        {showLine ? <ConnectLine {...nodeData} /> : <FillingLineBox {...nodeData} />}
        {cKeys.length > 0 && <IconBox onClick={toggleNode}>{renderIcon()}</IconBox>}
        <TitleBox cKeys={cKeys}>{title}</TitleBox>
      </TreeNodeBox>
    );
  }
);

export default TreeNode;
