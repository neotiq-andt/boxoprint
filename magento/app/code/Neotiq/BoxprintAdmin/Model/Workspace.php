<?php

/**
 * custom ducdevphp@gmail.com
 */
namespace Neotiq\BoxprintAdmin\Model;

use Magento\Framework\Model\AbstractModel;

class Workspace extends AbstractModel
{

    protected function _construct()
    {
        $this->_init('Neotiq\BoxprintAdmin\Model\ResourceModel\Workspace');
    }
}
