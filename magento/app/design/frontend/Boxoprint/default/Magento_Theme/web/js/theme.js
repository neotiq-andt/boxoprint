/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'jquery',
    'mage/smart-keyboard-handler',
    'mage/mage',
    'mage/ie-class-fixer',
    'matchMedia',
    'mage/translate',
    'domReady!'
], function ($, keyboardHandler) {
    'use strict';

    $('.cart-summary').mage('sticky', {
        container: '#maincontent'
    });

    $('.panel.header > .header.links').clone().appendTo('#store\\.links');
    $('#store\\.links li a').each(function () {
        var id = $(this).attr('id');

        if (id !== undefined) {
            $(this).attr('id', id + '_mobile');
        }
    });

    if ($('#back-top').length == 0) {
        $('<div id="back-top" class="back-top" data-role="back_top"><a title="Top" href="#top">Top</a></div>').appendTo('body');
    }
    $('[data-role="back_top"]').each(function() {
        var $bt = $(this);
        $bt.click(function(e) {
            e.preventDefault();
            $('html, body').animate({'scrollTop':0},800);
        });
        function toggleButton(hide) {
            if(hide){
                $bt.fadeOut(300);
            }else{
                $bt.fadeIn(300);
            }
        }
        var hide = ($(window).scrollTop() < 100);
        toggleButton(hide);
        $(window).scroll(function() {
            var newState = ($(window).scrollTop() < 100);
            if(newState != hide){
                hide = newState;
                toggleButton(hide);
            }
        });
    });

    if($('.block-collapsible-nav').length > 0) {
        mediaCheck({
            media: '(max-width: 767px)',
            entry: $.proxy(function () {
                $('.block-collapsible-nav .nav.item.current strong').insertBefore('.block-collapsible-nav-title span');
            }, this),
            exit: $.proxy(function () {
                $('.block-collapsible-nav-title strong').prependTo('.block-collapsible-nav .nav.item.current');
            }, this)
        });
    }

    keyboardHandler.apply();
});
