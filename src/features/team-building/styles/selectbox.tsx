import { css } from '@emotion/react';

import { colors } from '../../../styles/constants/colors';

export const selectBoxWrapperCss = css`
  position: relative;
  width: 100%;
`;

export const selectBoxHeaderCss = css`
  width: 100%;
  height: 3rem;
  padding: 0.75rem 1rem;
  background-color: white;
  border: 0.0625rem solid #e0e0e0;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: border-color 0.2s ease;
  box-sizing: border-box;

  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    border-color: ${colors.gdscBlue};
  }

  &.open {
    border-color: ${colors.gdscBlue};
  }
`;

export const selectBoxPlaceholderCss = css`
  color: #9e9e9e;
  font-size: 1rem;
`;

export const selectBoxSelectedCss = css`
  display: flex;
  flex-wrap: nowrap;
  gap: 0.5rem;
  align-items: center;
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;

  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const selectBoxArrowCss = css`
  width: 1rem;
  height: 1rem;
  transition: transform 0.2s ease;
  margin-left: 0.5rem;
  flex-shrink: 0;

  &.open {
    transform: rotate(180deg);
  }
`;

export const selectBoxDropdownCss = css`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background-color: white;
  border: 0.0625rem solid #e0e0e0;
  border-radius: 0.5rem;
  max-height: 20rem;
  overflow-y: auto;
  z-index: 1000;
`;

export const selectBoxSearchCss = css`
  width: 100%;
  height: 3rem;
  padding: 0 1rem;
  border: none;
  border-bottom: 0.0625rem solid #e0e0e0;
  outline: none;
  font-size: 1rem;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  box-sizing: border-box;

  &::placeholder {
    color: #9e9e9e;
  }

  &:focus {
    border-bottom-color: ${colors.gdscBlue};
  }
`;

export const selectBoxListCss = css`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const selectBoxItemCss = css`
  height: 3rem;
  padding: 0 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  margin: 0.4rem;
  border-radius: 0.3rem;

  &:hover {
    background-color: #ededef;
  }

  &.selected {
    background-color: #d9e7fd;
  }

`;

export const checkIconCss = css`
  width: 1rem;
  color: ${colors.gdscBlue};
`;

export const selectBoxSelectedTextCss = css`
  color: #000;
  font-size: 1rem;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
