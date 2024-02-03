var config = {
    map: {
        '*': {
            slick: 'js/slick.min',
            owlslider : 'js/owlcarousel/owl.carousel.min'
        }
    },
    shim: {
        slick: {
            deps: ['jquery']
        },
        owlslider: {
            deps: ['jquery']
        }
    }
};
