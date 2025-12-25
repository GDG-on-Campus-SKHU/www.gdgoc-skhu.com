import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle` @import url('https://fonts.googleapis.com/css2?family=Pretendard:ital,wght@0,400;0,500;0,700&display=swap');

body {
  margin: 0; line-height: normal;
}
:root {

/* Common Style Variables */

/* Color */
--body-b2-b2: #fff;
--color-black: #000;
--grayscale-100: #f9f9fa;
--grayscale-200: #ededef;
--grayscale-300: #e0e2e5;
--grayscale-600: #7e8590;
--grayscale-700: #626873;
--grayscale-800: #454b54;
--grayscale-1000: #040405;
--primary-600main: #4285f4;

/* Gap */
--gap-4: 4px;
--gap-20: 20px;

/* Padding */
--padding-0: 0px;
--padding-8: 8px;
--padding-12: 12px;
--padding-20: 20px;
--padding-28: 28px;

/* BorderRadius */
--br-8: 8px;

/* Font */
--font-pretendard: Pretendard;

/* FontSize */
--fs-16: 16px;
--fs-18: 18px;
--fs-20: 20px;

/* Borders */
--border-1: 1px solid var(--grayscale-700);
--border-2: 1px solid var(--grayscale-300);

/* Gradients */
--grayscale-900: linear-gradient(#353a40, #353a40), #25282c;

/* WidthHeights */
--height-40: 40px;
--height-80: 80px;
--width-40: 40px;
--width-200: 200px;

}


`;
