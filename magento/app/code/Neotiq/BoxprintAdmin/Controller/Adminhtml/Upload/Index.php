<?php
namespace Neotiq\BoxprintAdmin\Controller\Adminhtml\Upload;

class Index extends \Magento\Backend\App\Action
{

    protected $_coreRegistry = null;

    protected $resultPageFactory;

    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\Framework\View\Result\PageFactory $resultPageFactory,
        \Magento\Framework\Registry $registry
    ) {
        $this->resultPageFactory = $resultPageFactory;
        $this->_coreRegistry = $registry;
        parent::__construct($context);
    }

    public function execute()
    {
        $resultPage = $this->resultPageFactory->create();
        $resultPage->setActiveMenu('Neotiq_BoxprintAdmin::upload')
            ->addBreadcrumb(__('Upload File'), __('Upload File'))
            ->addBreadcrumb(__('Upload File'), __('Upload File'));
        return $resultPage;
    }
}
