# CSS Layout API实现瀑布流

[博客](https://daidr.me/?p=856) | [DEMO](https://masonry.daidr.me)

## 提示

* 代码在 Edge 99.0.1134.0 测试可用
* 你需要使用edge/chrome canary浏览器并在flags中将Experimental Web Platform features启用。

## 使用方法

1. 在网页中引入 `masonry.js`
2. 准备一个容器元素，添加样式 `display: layout(masonry);`
3. 完成🎉

## 可选的样式

| 属性               | 属性值                | 默认值   | 说明               |
|--------------------|-----------------------|----------|--------------------|
| `--masonry-gap`    | `<length-percentage>` | `'20px'` | 每个子元素间的间距 |
| `--masonry-column` | `<number>`            | `4`      | 瀑布流的列数       |

## 限制
* 修改子元素的上下外边距（margin）无法增加间隔
* 子元素的左右外边距有效，但是不会发生**塌陷**。你也可以通过使用`fixedInlineSize` 使得左右外边距无效，但这会导致子元素尺寸完全受脚本控制。