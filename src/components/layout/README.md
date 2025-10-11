# Layout 组件总览

提供常用的布局原语与页面容器，统一导出、主题接入与安全区处理。本文档包含：快速使用、导入方式、以及各子组件的 README 文档链接。

## 快速开始

- 从聚合导出中直接引入布局组件
- 按需组合 `SafeAreaView`、`Container`、`Section`、`Header`、`Screen`、`Page`、`Card`

```tsx
import React from 'react';
import { SafeAreaView, Container, Section, Header, Screen, Page } from '@gaozh1024/rn-toolkit';

export default function LayoutExample() {
  return (
    <SafeAreaView>
      <Screen>
        <Header title="示例页面" />
        <Page>
          <Container padding={{ top: 16, bottom: 16, left: 16, right: 16 }}>
            <Section>
              {/* 你的内容 */}
            </Section>
          </Container>
        </Page>
      </Screen>
    </SafeAreaView>
  );
}
```

## 导入与主题

- 统一从 `src/components/layout/index.ts` 聚合导出引入
- 与主题系统协作：颜色/间距/圆角/阴影统一（详见主题文档）
- 安全区：通过 `SafeAreaView` 与 `SafeAreaContainer` 处理顶部/底部安全区

## 组件文档索引

以下链接指向本目录内的各组件详细 README 使用说明：

- [Card 卡片](./Card/README.md)

> 目前以下组件尚未提供独立 README：`Container`、`Header`、`Page`、`RefreshableList`、`SafeAreaView`、`Screen`、`Section`。如需补充我可以为你生成对应文档。

## 组件概览

- `SafeAreaView`/`SafeAreaContainer`：包裹页面根节点，自动处理 iOS/Android 安全区
- `Screen`：页面级容器（可用于统一背景、滚动策略等）
- `Header`：页面头部（标题/左/右操作）
- `Page`：页面内容容器（可与 `Screen` 搭配）
- `Container`：区块容器，支持统一 `padding/margin/backgroundColor/flex/scrollable`
- `Section`：页面内分节区块（标题/子内容）
- `Card`：卡片容器（阴影/圆角/内边距）
- `RefreshableList`：带下拉刷新/上拉加载的列表容器

## 最佳实践

- 统一使用 `SafeAreaView` 包裹页面，避免刘海/手势区域遮挡
- 页面结构建议采用 `Screen > Header > Page > Container/Section` 的分层方式
- 列表类页面优先考虑 `RefreshableList`，简化刷新与分页逻辑
- 主题联动：尽量通过组件 props 配合主题色，而非手写内联色值
