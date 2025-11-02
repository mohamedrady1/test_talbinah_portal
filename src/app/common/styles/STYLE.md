# SCSS Folder Structure and Best Practices

## Table of Contents

- [Introduction](#introduction)
- [SCSS Folder Structure](#scss-folder-structure)
  - [Abstracts](#abstracts)
    - [_variables.scss](#_variablesscss)
    - [_mixins.scss](#_mixinsscss)
    - [_functions.scss](#_functionsscss)
    - [_placeholders.scss](#_placeholdersscss)
  - [Base](#base)
    - [_reset.scss](#_resetscss)
    - [_typography.scss](#_typographyscss)
    - [_base.scss](#_basescss)
  - [Utils](#utils)
    - [_helpers.scss](#_helpersscss)
    - [_grid.scss](#_gridscss)
    - [_visibility.scss](#_visibilityscss)
  - [Themes](#themes)
    - [_default.scss](#_defaultscss)
    - [_dark.scss](#_darkscss)
    - [_custom.scss](#_customscss)
  - [Main File](#main-file)
  - [Folder Structure Visualization](#folder-structure-visualization)
- [Bem (Block Element Modifier)](#bem-block-element-modifier)
    - [BEM Overview](#bem-overview)
    - [BEM Structure](#bem-structure)
    - [BEM Examples](#bem-examples)
    - [Benifits of BEM](#bem-block-element-modifier)
- [7-1 Architecture](#7-1-architecture)
    - [Overview](#7-1-overview)
    - [Folder Structure](#7-1-structure)
      - [Folder Descriptions](#7-1-folder-descriptions)
    - [Purpose](#7-1-purpose)
- [Minification and Production Build](#minification-and-production-build)
- [Benefits](#benefits)
- [Git Commands for README Updates](#git-commands-for-readme-updates)

---

## Introduction

This document outlines the best practices for structuring SCSS files in an Angular project. The folder structure and methodology are designed to ensure maintainability, scalability, and adherence to the BEM (Block Element Modifier) methodology.

## SCSS Folder Structure

### Abstracts

Stores reusable settings and tools for SCSS, such as variables, mixins, functions, and placeholders.

#### _variables.scss
```scss
// Colors
$primary-color: #007bff;
$secondary-color: #6c757d;
$success-color: #28a745;

// Spacing
$spacer: 1rem;
$spacers: (
  0: 0,
  1: $spacer * 0.25,
  2: $spacer * 0.5,
  3: $spacer,
  4: $spacer * 1.5,
  5: $spacer * 3,
);

// Typography
$font-family: 'Helvetica Neue', Arial, sans-serif;
$font-size-base: 1rem;
```

#### _mixins.scss
```scss
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin responsive($breakpoint) {
  @media (max-width: $breakpoint) {
    @content;
  }
}
```

#### _functions.scss
```scss
@function rem($px) {
  @return $px / 16 * 1rem;
}
```

#### _placeholders.scss
```scss
%hidden {
  display: none !important;
}

%clearfix {
  &::after {
    content: '';
    display: table;
    clear: both;
  }
}
```

### Base

Defines global reset, typography, and base styles.

#### _reset.scss
```scss
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

#### _typography.scss
```scss
body {
  font-family: $font-family;
  font-size: $font-size-base;
  line-height: 1.5;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: bold;
  margin-bottom: $spacer;
}
```

#### _base.scss
```scss
body {
  color: $secondary-color;
  background-color: $light-color;
}

a {
  color: $primary-color;
  text-decoration: none;

  &:hover {
    color: darken($primary-color, 10%);
  }
}
```

### Utils

Contains utility classes for layout and styling adjustments.

#### _helpers.scss
```scss
.text-center {
  text-align: center !important;
}

.float-left {
  float: left !important;
}

.float-right {
  float: right !important;
}
```

#### _grid.scss
```scss
.container {
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
}

.col {
  flex: 1;
  padding: 15px;
}
```

#### _visibility.scss
```scss
.hidden {
  display: none !important;
}

.visible {
  display: block !important;
}
```

### Themes

Defines styles for themes such as light and dark modes.

#### _default.scss
```scss
body {
  background-color: $light-color;
  color: $dark-color;
}
```

#### _dark.scss
```scss
body {
  background-color: $dark-color;
  color: $light-color;
}
```

#### _custom.scss
Define additional custom themes as needed.

### Components

Individual UI components, such as buttons, modals, and cards.

#### _button.scss
```scss
.button {
  padding: $spacer;
  background-color: $primary-color;
  color: $light-color;

  &--primary {
    background-color: $success-color;
  }

  &--secondary {
    background-color: $secondary-color;
  }
}
```

### Layout

Defines layout-specific styles, such as grids, headers, and footers.

#### _header.scss
```scss
.header {
  background-color: $primary-color;
  color: $light-color;
  padding: $spacer;
}
```

#### _footer.scss
```scss
.footer {
  background-color: $secondary-color;
  color: $light-color;
  padding: $spacer;
}
```

### Pages

Page-specific styles.

#### _home.scss
```scss
.home {
  .hero {
    background-color: $light-color;
    color: $dark-color;
    padding: $spacer * 2;
  }
}
```

### Vendors

Third-party libraries or frameworks.

#### _bootstrap-overrides.scss
```scss
// Override Bootstrap styles
.container {
  max-width: 1200px;
}
```

### Main File

The main entry point for importing all SCSS files.

#### main.scss
```scss
// Abstracts
@import './abstracts/variables';
@import './abstracts/mixins';
@import './abstracts/functions';
@import './abstracts/placeholders';

// Base
@import './base/reset';
@import './base/typography';
@import './base/base';

// Utils
@import './utils/helpers';
@import './utils/grid';
@import './utils/visibility';

// Themes
@import './themes/default';
@import './themes/dark';

// Components
@import './components/button';

// Layout
@import './layout/header';
@import './layout/footer';

// Pages
@import './pages/home';

// Vendors
@import './vendors/bootstrap-overrides';
```

### Folder Structure Visualization

```bash
src/
└── app/
    └── common/
        └── styles/
            ├── abstracts/          # Sass tools and mixins, variables, functions
            ├── base/               # Base styles such as resets and typography
            ├── components/         # Individual UI components (buttons, modals, etc.)
            ├── layout/             # Layout-related styles (header, footer, grid)
            ├── pages/              # Page-specific styles
            ├── themes/             # Theme styles (color schemes, etc.)
            └── vendors/            # 3rd-party libraries and frameworks
```

### BEM (Block Element Modifier)

#### BEM Overview

BEM (Block Element Modifier) is a naming convention for classes in HTML and CSS. It is used to create reusable and modular components. The idea is to make the class names meaningful, readable, and maintainable. It follows the structure of Block__Element--Modifier.

#### BEM Structure

- Block: The outermost component. It represents a distinct entity in your UI, e.g., button, menu, form.
- Element: A part of the block that depends on it and cannot function independently, e.g., button__icon, menu__item.
- Modifier: A flag that defines the variations of the block or element, e.g., button--primary, menu__item--active.

#### BEM Examples

```html
<div class="button button--primary">
  <span class="button__text">Click me</span>
</div>
```

In this example:

- `button` is the Block.
- `button__text` is the Element.
- `button--primary` is the Modifier that changes the appearance of the button.

#### Benefits of BEM

- Clarity: The class names clearly define the structure of the components.
- Reusability: Since the components are independent, they can be reused across different sections of the app.
- Maintainability: It's easy to identify and modify components without affecting others.

### 7-1 Architecture

#### 7-1 Overview

The 7-1 architecture is a scalable and maintainable CSS architecture for large projects. It divides the stylesheets into multiple layers, each serving a different purpose. The structure is based on 7 folders, each serving specific roles to maintain a clean separation of concerns.

#### 7-1 Structure

```bash
sass/
├── abstracts/          # Sass tools and mixins, variables, functions
├── base/               # Base styles such as resets and typography
├── components/         # Individual UI components (buttons, modals, etc.)
├── layout/             # Layout-related styles (header, footer, grid)
├── pages/              # Page-specific styles
├── themes/             # Theme styles (color schemes, etc.)
└── vendors/            # 3rd-party libraries and frameworks
```

##### 7-1 Folder Descriptions

- abstracts: This folder contains all Sass tools and helpers, such as mixins, functions, and variables.
- base: Holds global styles and base settings like resets, typography, and general styles that are applied globally.
- components: Defines individual UI components (buttons, cards, etc.) as reusable modules that can be imported wherever needed.
- layout: Contains styles that structure the layout of the page, like grids, headers, footers, sidebars, etc.
- pages: Includes styles specific to individual pages. If there are any custom styles or overrides for a page, they belong here.
- themes: Stores themes or color schemes. Useful for applying different themes throughout the app.
- vendors: For any third-party libraries or frameworks, like Bootstrap or jQuery UI.

#### 7-1 Purpose

This architecture allows you to manage your Sass files in a way that is easy to scale and maintain. It provides separation of concerns, meaning each folder has its defined responsibility.

## Minification and Production Build

To minify SCSS files, build the project in production mode:

```bash
ng build --configuration production
```

Angular CLI automatically minifies CSS in production builds.

## Benefits

- **Maintainability**: Well-structured and modular codebase.
- **Scalability**: Easy to add new features or themes.
- **Readability**: Clear naming conventions using BEM.
- **Optimization**: Minified CSS for production.

## Git Commands for README Updates

Use the following commands to manage README updates in the repository:

```bash
# Add the README file to staging
git add README.md

# Commit the changes
git commit -m "Updated README with SCSS structure and best practices"

# Push to the repository
git push origin <branch-name>
```

### Example Box Code

```scss
// Example SCSS Box
.box {
  padding: 1rem;
  border: 1px solid $primary-color;
  background-color: $light-color;

  &--shadow {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
}
```

