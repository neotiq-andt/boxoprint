<?php
namespace Neotiq\BoxprintAdmin\Block\Adminhtml\Upload;

class Edit extends \Magento\Backend\Block\Widget\Form\Container
{

    protected $_coreRegistry = null;

    public function __construct(
        \Magento\Backend\Block\Widget\Context $context,
        \Magento\Framework\Registry $registry,
        array $data = []
    ) {
        $this->_coreRegistry = $registry;
        parent::__construct($context, $data);
    }

    protected function _construct()
    {
        parent::_construct();
        $this->_blockGroup = 'Neotiq_BoxprintAdmin';
        $this->_controller = 'adminhtml_upload';
        $this->updateButton('save', 'label', __('Upload Data'));
    }

    public function getHeaderText()
    {
        return __('Upload File');
    }

    protected function _isAllowedAction($resourceId)
    {
        return $this->_authorization->isAllowed($resourceId);
    }

    protected function _prepareLayout()
    {
        return parent::_prepareLayout();
    }
}