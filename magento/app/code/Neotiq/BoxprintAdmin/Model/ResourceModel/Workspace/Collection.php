<?php

/**
 * custom ducdevphp@gmail.com
 */
namespace Neotiq\BoxprintAdmin\Model\ResourceModel\Workspace;

use Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection;

class Collection extends AbstractCollection
{

    protected $_idFieldName = 'workspace_id';

    protected function _construct()
    {
        $this->_init(
            'Neotiq\BoxprintAdmin\Model\Workspace',
            'Neotiq\BoxprintAdmin\Model\ResourceModel\Workspace'
        );
    }
}
