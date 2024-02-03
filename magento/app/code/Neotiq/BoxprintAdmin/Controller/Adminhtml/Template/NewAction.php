<?php
namespace Neotiq\BoxprintAdmin\Controller\Adminhtml\Template;

class NewAction extends \Magento\Backend\App\Action
{

    const ADMIN_RESOURCE = 'Neotiq_BoxprintAdmin::boxprint';

    protected $resultForwardFactory;

    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\Backend\Model\View\Result\ForwardFactory $resultForwardFactory
    ) {
        $this->resultForwardFactory = $resultForwardFactory;
        parent::__construct($context);
    }

    public function execute()
    {
        $resultForward = $this->resultForwardFactory->create();
        return $resultForward->forward('edit');
    }

    public function _isAllowed()
    {
        return $this->_authorization->isAllowed('Neotiq_BoxprintAdmin::boxprint');
    }
}
