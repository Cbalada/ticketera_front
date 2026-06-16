const fs = require('fs');
const file = 'src/app/globals.css';
let content = fs.readFileSync(file, 'utf-8');

const themeInlineAdditions = `
  /* Ticketera custom colors */
  --color-surface: #131315;
  --color-on-error-container: #ffdad6;
  --color-primary-fixed: #c3f400;
  --color-tertiary-fixed: #63f7ff;
  --color-secondary-container: #7701d0;
  --color-on-tertiary: #003739;
  --color-on-secondary: #480081;
  --color-inverse-primary: #506600;
  --color-on-error: #690005;
  --color-tertiary: #ffffff;
  --color-secondary-fixed: #efdbff;
  --color-primary-container: #c3f400;
  --color-surface-container-high: #2a2a2c;
  --color-tertiary-fixed-dim: #00dce5;
  --color-on-secondary-container: #dcb7ff;
  --color-on-tertiary-fixed: #002021;
  --color-surface-container-lowest: #0e0e10;
  --color-on-tertiary-fixed-variant: #004f53;
  --color-on-secondary-fixed-variant: #6700b5;
  --color-surface-container: #201f21;
  --color-surface-bright: #39393b;
  --color-on-primary-fixed-variant: #3c4d00;
  --color-primary-fixed-dim: #abd600;
  --color-inverse-surface: #e5e1e4;
  --color-error-container: #93000a;
  --color-surface-container-low: #1c1b1d;
  --color-surface-variant: #353437;
  --color-secondary: #dcb8ff;
  --color-surface-container-highest: #353437;
  --color-on-background: #e5e1e4;
  --color-on-surface-variant: #c4c9ac;
  --color-inverse-on-surface: #313032;
  --color-on-primary-container: #556d00;
  --color-on-primary: #283500;
  --color-on-surface: #e5e1e4;
  --color-outline: #8e9379;
  --color-on-secondary-fixed: #2c0051;
  --color-on-primary-fixed: #161e00;
  --color-error: #ffb4ab;
  --color-surface-tint: #abd600;
  --color-outline-variant: #444933;
  --color-tertiary-container: #63f7ff;
  --color-on-tertiary-container: #007075;
  --color-secondary-fixed-dim: #dcb8ff;
  --color-surface-dim: #131315;

  /* Custom Spacing */
  --spacing-margin-desktop: 80px;
  --spacing-gutter: 24px;
  --spacing-margin-mobile: 16px;
  --spacing-base: 8px;
  --spacing-container-max: 1280px;

  /* Custom Fonts */
  --font-display: var(--font-sora);
  --font-headline-lg: var(--font-sora);
  --font-headline-md: var(--font-sora);
  --font-headline-lg-mobile: var(--font-sora);
  --font-label-md: var(--font-sora);
  --font-body-lg: var(--font-hanken);
  --font-body-md: var(--font-hanken);

  /* Text Sizes */
  --text-display: 64px;
  --text-display--line-height: 1.1;
  --text-display--letter-spacing: -0.04em;
  --text-display--font-weight: 800;

  --text-headline-lg: 40px;
  --text-headline-lg--line-height: 1.2;
  --text-headline-lg--letter-spacing: -0.02em;
  --text-headline-lg--font-weight: 700;

  --text-headline-md: 24px;
  --text-headline-md--line-height: 1.3;
  --text-headline-md--font-weight: 600;

  --text-headline-lg-mobile: 32px;
  --text-headline-lg-mobile--line-height: 1.2;
  --text-headline-lg-mobile--font-weight: 700;

  --text-label-md: 14px;
  --text-label-md--line-height: 1.0;
  --text-label-md--letter-spacing: 0.05em;
  --text-label-md--font-weight: 600;

  --text-body-lg: 18px;
  --text-body-lg--line-height: 1.6;
  --text-body-lg--font-weight: 400;

  --text-body-md: 16px;
  --text-body-md--line-height: 1.6;
  --text-body-md--font-weight: 400;
`;

content = content.replace(/@theme inline \{/, '@theme inline {\n' + themeInlineAdditions);

const utilitiesAdditions = `
@layer utilities {
  .glass-panel {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.15);
  }
  .primary-glow:hover {
      box-shadow: 0 0 20px rgba(195, 244, 0, 0.4);
  }
  .proton-glow:hover {
      box-shadow: 0 0 20px rgba(119, 1, 208, 0.4);
  }
  .pulse-dot {
      animation: pulse 2s infinite;
  }
  @keyframes pulse {
      0% { transform: scale(0.95); opacity: 0.8; }
      50% { transform: scale(1.1); opacity: 1; }
      100% { transform: scale(0.95); opacity: 0.8; }
  }
  .scrolling-text {
      white-space: nowrap;
      animation: scroll 20s linear infinite;
  }
  @keyframes scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
  }
}
`;

content = content + '\n' + utilitiesAdditions;

fs.writeFileSync(file, content);
