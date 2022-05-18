import * as React from 'react';
import { ChevronRight, ChevronDown } from '@kubed/icons';
// import { storiesOf } from '@storybook/react';
import { Tree } from './Tree';

export default {
  title: 'Components/Tree',
  component: Tree,
};

export const FlatData = () => {
  const data = [
    { key: '16', title: '火车报销', pKey: '9' },
    { key: '1', title: '办公管理' },
    { key: '2', title: '请假申请', pKey: '1' },
    { key: '13', title: '厨师管理', pKey: '7' },
    { key: '3', title: '出差申请', pKey: '1' },
    { key: '11', title: '开始', pKey: '8' },
    { key: '12', title: '结束', pKey: '8' },
    { key: '14', title: '什么时候结束', pKey: '12' },
    { key: '15', title: '在哪里结束', pKey: '12' },
    { key: '4', title: '请假记录', pKey: '2' },
    { key: '10', title: '后勤管理', pKey: '7' },
    { key: '5', title: '系统设置' },
    { key: '6', title: '权限管理', pKey: '5' },
    { key: '7', title: '用户角色', pKey: '6' },
    { key: '8', title: '菜单设置', pKey: '6' },
    { key: '9', title: '报销管理' },
    { key: '17', title: '订单管理' },
    { key: '18', title: '运维管理', pKey: '5' },
  ];
  return <Tree flatData={data} isExpandAll treeTitle="青云科技" isShowLine />;
};

export const TreeData = () => {
  const data = [
    {
      key: '1',
      title: '办公管理',
      children: [
        {
          key: '2',
          title: '请假申请',
          children: [
            {
              key: '4',
              title: '请假记录',
            },
          ],
        },
        {
          key: '3',
          title: '出差申请',
        },
      ],
    },
    {
      key: '5',
      title: '系统设置',
      children: [
        {
          key: '6',
          title: '权限管理',
          children: [
            {
              key: '7',
              title: '用户角色',
              children: [
                { key: '13', title: '厨师管理' },
                { key: '10', title: '后勤管理' },
              ],
            },
            {
              key: '8',
              title: '菜单设置',
              children: [
                { key: '11', title: '开始' },
                {
                  key: '12',
                  title: '结束',
                  children: [
                    { key: '14', title: '什么时候结束' },
                    { key: '15', title: '在哪里结束' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      key: '9',
      title: '报销管理',
      children: [{ key: '16', title: '火车报销' }],
    },
    {
      key: '17',
      title: '订单管理',
    },
  ];
  return <Tree treeData={data} isExpandAll treeTitle="青云科技" />;
};

export const CustomIcon = () => {
  const data = [
    { key: '16', title: '火车报销', pKey: '9' },
    { key: '1', title: '办公管理' },
    { key: '2', title: '请假申请', pKey: '1' },
    { key: '13', title: '厨师管理', pKey: '7' },
    { key: '3', title: '出差申请', pKey: '1' },
    { key: '11', title: '开始', pKey: '8' },
    { key: '12', title: '结束', pKey: '8' },
    { key: '14', title: '什么时候结束', pKey: '12' },
    { key: '15', title: '在哪里结束', pKey: '12' },
    { key: '4', title: '请假记录', pKey: '2' },
    { key: '10', title: '后勤管理', pKey: '7' },
    { key: '5', title: '系统设置' },
    { key: '6', title: '权限管理', pKey: '5' },
    { key: '7', title: '用户角色', pKey: '6' },
    { key: '8', title: '菜单设置', pKey: '6' },
    { key: '9', title: '报销管理' },
    { key: '17', title: '订单管理' },
  ];
  const renderIcon = () => {
    return {
      open: <ChevronDown size={14} />,
      close: <ChevronRight size={14} />,
    };
  };
  return <Tree flatData={data} treeTitle="青云科技" isShowLine customIcon={renderIcon} />;
};

export const CustomTitle = () => {
  const data = [
    { key: '1', title: <div>办公管理</div> },
    { key: '2', title: '请假申请', pKey: '1' },
    { key: '5', title: <div style={{ color: '#55bc8a', fontWeight: 500 }}>系统设置</div> },
    {
      key: '9',
      title: (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div>报销管理</div>
          <div style={{ padding: '0 4px', backgroundColor: '#f5a623', borderRadius: '3px' }}>
            +2
          </div>
        </div>
      ),
    },
  ];
  return <Tree flatData={data} treeTitle="青云科技" isShowLine />;
};

export const ExpandLevel = () => {
  const data = [
    { key: '16', title: '火车报销', pKey: '9' },
    { key: '1', title: '办公管理' },
    { key: '2', title: '请假申请', pKey: '1' },
    { key: '13', title: '厨师管理', pKey: '7' },
    { key: '3', title: '出差申请', pKey: '1' },
    { key: '11', title: '开始', pKey: '8' },
    { key: '12', title: '结束', pKey: '8' },
    { key: '14', title: '什么时候结束', pKey: '12' },
    { key: '15', title: '在哪里结束', pKey: '12' },
    { key: '4', title: '请假记录', pKey: '2' },
    { key: '10', title: '后勤管理', pKey: '7' },
    { key: '5', title: '系统设置' },
    { key: '6', title: '权限管理', pKey: '5' },
    { key: '7', title: '用户角色', pKey: '6' },
    { key: '8', title: '菜单设置', pKey: '6' },
    { key: '9', title: '报销管理' },
    { key: '17', title: '订单管理' },
    { key: '18', title: '运维管理', pKey: '5' },
  ];
  return <Tree flatData={data} treeTitle="青云科技" isShowLine expandLevel={1} />;
};
