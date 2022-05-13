import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { Group } from '../Group/Group';
import { Tree } from './Tree';

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

storiesOf('Components/Tree', module)
  .addParameters({ component: Tree })
  .add('Basic', () => (
    <Group spacing="xl">
      <Tree flatData={data} isExpandAll treeTitle="优帆科技" showLine />
    </Group>
  ));
