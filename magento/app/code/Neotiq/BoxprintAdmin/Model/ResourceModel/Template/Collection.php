<?php

/**
 * custom ducdevphp@gmail.com
 */
namespace Neotiq\BoxprintAdmin\Model\ResourceModel\Template;

use Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection;

class Collection extends AbstractCollection
{

    protected $_idFieldName = 'template_id';

    protected function _construct()
    {
        $this->_init(
            'Neotiq\BoxprintAdmin\Model\Template',
            'Neotiq\BoxprintAdmin\Model\ResourceModel\Template'
        );
    }
}
