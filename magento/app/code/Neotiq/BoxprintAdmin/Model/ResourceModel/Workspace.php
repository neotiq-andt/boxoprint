<?php
/**
 * custom ducdevphp@gmail.com
 */
?>
<?php
namespace Neotiq\BoxprintAdmin\Model\ResourceModel;

class Workspace extends \Magento\Framework\Model\ResourceModel\Db\AbstractDb
{
    protected $_storeManager;
    public function __construct(
        \Magento\Framework\Model\ResourceModel\Db\Context $context,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        $connectionName = null
    ) {
        parent::__construct($context, $connectionName);
        $this->_storeManager = $storeManager;
    }

    protected function _construct(){
        $this->_init('boxoprint_workspace','workspace_id');
    }

//    protected function _beforeSave(\Magento\Framework\Model\AbstractModel $object)
//    {
//        if ($object->isObjectNew()) {
//            $object->setCreationTime($this->_date->gmtDate());
//        }
//
//    }
}
