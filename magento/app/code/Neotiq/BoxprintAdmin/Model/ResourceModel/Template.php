<?php
/**
 * custom ducdevphp@gmail.com
 */
?>
<?php
namespace Neotiq\BoxprintAdmin\Model\ResourceModel;

class Template extends \Magento\Framework\Model\ResourceModel\Db\AbstractDb
{
    protected $_storeManager;

    protected  $neotiqBoxprintAdminHelper;

    protected  $workspaceFactory;

    public function __construct(
        \Magento\Framework\Model\ResourceModel\Db\Context $context,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Neotiq\BoxprintAdmin\Helper\Data $neotiqBoxprintAdminHelper,
        \Neotiq\BoxprintAdmin\Model\TemplateFactory $workspaceFactory,
        $connectionName = null
    ) {
        parent::__construct($context, $connectionName);
        $this->_storeManager = $storeManager;
        $this->neotiqBoxprintAdminHelper = $neotiqBoxprintAdminHelper;
        $this->workspaceFactory = $workspaceFactory;
    }

    protected function _construct(){
        $this->_init('boxoprint_template','template_id');
    }

    protected function _afterSave(\Magento\Framework\Model\AbstractModel $object)
    {
        if($this->neotiqBoxprintAdminHelper->checkEnableAuto()){
            $path = $object->getData('path');
			$m_path = $object->getData('m_path');
            $length = $object->getData('length');
            $width = $object->getData('width');
            $height = $object->getData('height');
            $name = $object->getData('name');
            try {
                $table = $this->getTable('boxoprint_workspace');
                if($this->neotiqBoxprintAdminHelper->getDataFileJson($path,$m_path,$length,$width,$height,$name)){
                    $data['base'] = $this->neotiqBoxprintAdminHelper->getDataFileJson($path,$m_path,$length,$width,$height,$name);
                    $data['config'] = $this->neotiqBoxprintAdminHelper->getConfigWorkspae();
                    $data['template_id'] = $object->getId();
                    $data['status'] = 1;
                    $data['label'] = $name;
                    $data['type_defined'] = 1;
					$data['name_project'] = $object->getData('name_project');
					$data['date'] = $this->neotiqBoxprintAdminHelper->getGmtDate();
                    $this->getConnection()->insertMultiple($table, $data);
                }
            } catch (\Exception $e) {
                    throw $e;
            }
        }

        return parent::_afterSave($object);
    }
}
