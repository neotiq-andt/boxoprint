define([
    'Magento_Ui/js/grid/columns/column'
], function (Column) {
    'use strict';

    return Column.extend({
        defaults: {
            bodyTmpl: 'Neotiq_BoxprintAdmin/ui/grid/cells/productlink'
        },
        getName: function(row) {
            return row[this.index + '_name'];
        },
        getUrl: function(row) {
            return row[this.index + '_url'];
        }
    });
});
