/**
 * custom ducdevphp@gmail.com
 */
define([
    'jquery'
], function ($) {
    "use strict";
    return function (config, element) {
        $(element).parents('.product-info-main').find('.price-box.price-final_price').remove();
        $(element).appendTo('.product-info-main .product-info-price');
    }
});
