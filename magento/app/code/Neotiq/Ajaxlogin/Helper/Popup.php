<?php
/**
 * ducdevphp@gmail.com
 */
namespace Neotiq\Ajaxlogin\Helper;

use Magento\Framework\App\Helper\AbstractHelper as MagentoAbstractHelper;
use Magento\Framework\App\Helper\Context;

class Popup extends MagentoAbstractHelper
{

    protected $storeManager;

    public function __construct(
        Context $context,
        \Magento\Store\Model\StoreManagerInterface $storeManager
    ) {
        parent::__construct($context);
        $this->storeManager = $storeManager;
    }
}
?>
