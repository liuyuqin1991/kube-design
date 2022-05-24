import styled, { css } from 'styled-components';
import { reverse as _reverse, forEach as _forEach } from 'lodash';

interface TreeNodeStyle {
  level?: number;
  isShowLine?: boolean;
  isLast?: boolean;
  isLasts?: boolean[];
  isExpand?: boolean;
  isDisabled?: boolean;
  haveChildren?: boolean;
  selected?: boolean;
}

const IconBox = styled.div<TreeNodeStyle>`
  display: flex;
  align-items: center;
  padding-left: 8px;
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
        width: 2px;
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

const TreeNodeTitleBox = styled.div<TreeNodeStyle>`
  min-width: 150px;
  height: 32px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  color: ${({ theme, isDisabled }) =>
    isDisabled ? theme.palette.accents_4 : theme.palette.accents_8};
  background-color: ${({ theme, selected }) =>
    selected ? theme.palette.accents_1 : theme.palette.background};
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
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

const TreeTitle = styled.li<TreeNodeStyle>`
  padding: 6px 0;
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.palette.accents_8};
`;

const CheckboxBox = styled.div`
  display: flex;
  align-items: center;
  padding: 0 5px 0 8px;
`;

export {
  TreeBox,
  TreeTitle,
  IconBox,
  TreeNodeTitleBox,
  FillingLineBox,
  TreeNodeBox,
  ConnectLine,
  CheckboxBox,
};
