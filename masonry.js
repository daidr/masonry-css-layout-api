if ('layoutWorklet' in CSS) {
    CSS.registerProperty({
        name: '--masonry-column',
        syntax: '<number>',
        inherits: false,
        initialValue: 4
    });

    CSS.registerProperty({
        name: '--masonry-gap',
        syntax: '<length-percentage>',
        inherits: false,
        initialValue: '20px'
    });

    CSS.layoutWorklet.addModule('layout-masonry.js');
}