import styled, { css } from 'styled-components';
import { reverse as _reverse, forEach as _forEach } from 'lodash';
import { FlatNode } from './types';

interface TreeNodeStyle {
  level?: number;
  showLine?: boolean;
  isLast?: boolean;
  isLasts?: boolean[];
  isExpand?: boolean;
  cKeys?: FlatNode[]; //子节点树
}

const IconBox = styled.div<TreeNodeStyle>`
  display: flex;
  align-items: center;
  padding: 0 8px;
  cursor: pointer;
`;

/**
 * 画出每个节点的连接线
 * @param level
 * @param isLasts
 */
const getLineCss = (level, isLasts, theme) => {
  const lineColor = theme.palette.accents_3;
  const whiteColor = theme.palette.background;
  if (level === 0) return css``;
  // 处理数组，反转 + 去掉最上层父节点
  const resArray = _reverse([].concat(isLasts));
  resArray.shift();
  let str = 'linear-gradient(90deg, ';
  let len = 0;
  if (level === 1) {
    str += `${whiteColor} 0, ${whiteColor} 15px, ${lineColor} 15px, ${lineColor} 16px, ${whiteColor} 16px, ${whiteColor} 32px)`;
  } else {
    _forEach(resArray, (isLast: boolean) => {
      if (isLast) {
        str += `${whiteColor} ${len}px, ${whiteColor} ${(len += 32)}px, `;
      } else {
        str += `${whiteColor} ${len}px, ${whiteColor} ${(len += 15)}px, ${lineColor} ${len}px, ${lineColor} ${(len += 1)}px, ${whiteColor} ${len}px, ${whiteColor} ${(len += 16)}px, `;
      }
    });
    str += `${whiteColor} ${len}px, ${whiteColor} ${(len += 15)}px, ${lineColor} ${len}px, ${lineColor} ${(len += 1)}px, ${whiteColor} ${len}px, ${whiteColor} ${(len += 16)}px)`;
  }
  return css`
    background-image: ${str};
    background-size: ${level * 32}px 100%;
  `;
};

/**
 * 增加短横线及隐藏末位兄弟节点突出来的竖线
 * @param level
 * @param isLast
 */
const modifyLineCss = (level, isLast, theme) => {
  const lineColor = theme.palette.accents_3;
  const whiteColor = theme.palette.background;
  if (level === 0) return css``;
  if (isLast) {
    return css`
      &:before {
        content: '';
        position: absolute;
        top: 15px;
        right: 8px;
        width: 8px;
        height: 1px;
        background-color: ${lineColor};
      }
      &:after {
        content: '';
        position: absolute;
        top: 16px;
        right: 16px;
        width: 1px;
        height: 16px;
        background-color: ${whiteColor};
      }
    `;
  }
  return css`
    &:before {
      content: '';
      position: absolute;
      top: 15px;
      right: 8px;
      width: 8px;
      height: 1px;
      background-color: ${lineColor};
    }
  `;
};

const ConnectLine = styled.div<TreeNodeStyle>`
  width: ${({ level }) => `${level * 32}px`};
  height: 32px;
  position: relative;
  ${({ level, isLasts, theme }) => getLineCss(level, isLasts, theme)}
  ${({ level, isLast, theme }) => modifyLineCss(level, isLast, theme)}
`;

const FillingLineBox = styled.div<TreeNodeStyle>`
  width: ${({ level }) => `${level * 32}px`};
  height: 32px;
`;

const TitleBox = styled.div<TreeNodeStyle>`
  height: 32px;
  display: flex;
  align-items: center;
  ${({ cKeys }) =>
    cKeys.length > 0
      ? css``
      : css`
          padding: 0 8px;
        `};
`;

const TreeBox = styled.ul`
  position: relative;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
`;

const TreeNodeBox = styled.li`
  margin-bottom: 0;
  display: flex;
  align-items: center;
`;

const TreeTitle = styled.li`
  padding: 6px 0;
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.palette.accents_8};
`;

export { TreeBox, TreeTitle, IconBox, TitleBox, FillingLineBox, TreeNodeBox, ConnectLine };
