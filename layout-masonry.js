function calc(obj, inlineSize) {
    if (obj instanceof CSSUnitValue && obj.unit == 'px') {
        return obj.value;
    } else if (obj instanceof CSSMathNegate) {
        return -obj.value;
    } else if (obj instanceof CSSUnitValue && obj.unit == 'percent') {
        return obj.value * inlineSize / 100;
    } else if (obj instanceof CSSMathSum) {
        return Array.from(obj.values).reduce((total, item) => total + calc(item, inlineSize), 0);
    } else if (obj instanceof CSSMathProduct) {
        return Array.from(obj.values).reduce((total, item) => total * calc(item, inlineSize), 0);
    } else if (obj instanceof CSSMathMax) {
        let temp = Array.from(obj.values).map((item) => calc(item, inlineSize));
        return Math.max(...temp);
    } else if (obj instanceof CSSMathMin) {
        let temp = Array.from(obj.values).map((item) => calc(item, inlineSize));
        return Math.min(...temp);
    } else {
        throw new TypeError('Unsupported expression or unit.')
    }
}

registerLayout('masonry', class {
    static get inputProperties() {
        return ['--masonry-gap', '--masonry-column'];
    }
    static get layoutOptions() {
        return {
            childDisplay: 'normal',
            sizing: 'block-like'
        };
    }

    async intrinsicSizes(children, edges, styleMap) { }

    async layout(children, edges, constraints, styleMap) {
        // 获取容器的可用宽度（水平尺寸 - 左右内边距之和）
        const availableInlineSize = constraints.fixedInlineSize - edges.inline;

        //获取定义的瀑布流列数
        const column = styleMap.get('--masonry-column').value;

        // 获取定义的瀑布流间距
        let gap = styleMap.get('--masonry-gap');
        // 将计算属性和百分比处理成像素值
        gap = calc(gap, availableInlineSize);

        // 计算子元素的宽度
        const childAvailableInlineSize = (availableInlineSize - ((column + 1) * gap)) / column;

        // 设定子元素宽度，获取fragments
        let childFragments = await Promise.all(children.map((child) => {
            return child.layoutNextFragment({ availableInlineSize: childAvailableInlineSize });
        }));

        let autoBlockSize = 0; //初始化容器高度
        const columnHeightList = Array(column).fill(edges.blockStart); //初始化每列的高度，用容器的上边距填充
        for (let childFragment of childFragments) {
            // 得到当前高度最小的列
            const shortestColumn = columnHeightList.reduce((curShortestColumn, curValue, curIndex) => {
                if (curValue < curShortestColumn.value) {
                    return { value: curValue, index: curIndex };
                }

                return curShortestColumn;
            }, { value: Number.MAX_SAFE_INTEGER, index: -1 });

            // 计算子元素的位置
            childFragment.inlineOffset = gap + shortestColumn.index * (childAvailableInlineSize + gap) + edges.inlineStart;
            childFragment.blockOffset = gap + shortestColumn.value;

            // 更新当前列的高度（原高度 + 子元素高度）
            columnHeightList[shortestColumn.index] = childFragment.blockOffset + childFragment.blockSize;

            // 更新容器高度（若最短列的高度没有超过容器原高度，则容器高度保持不变）
            autoBlockSize = Math.max(autoBlockSize, columnHeightList[shortestColumn.index] + gap);
        }

        // 固定返回一个包含autoBlockSize和childFragments的对象
        return { autoBlockSize, childFragments };
    }
});