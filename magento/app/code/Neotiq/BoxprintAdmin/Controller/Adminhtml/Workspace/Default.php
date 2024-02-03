<?php
/**
 * custom ducdevphp@gmail.com
 */


namespace Neotiq\BoxprintAdmin\Controller\Adminhtml\Workspace;

class Default extends \Magento\Backend\App\Action
{
	const ADMIN_RESOURCE = 'Neotiq_BoxprintAdmin::boxprint';
	
    /**
     * @return \Magento\Backend\Model\View\Result\Page
     */
    public function execute()
    {
        /**
         * @var \Magento\Backend\Model\View\Result\Page $resultPage
         */
        $resultPage = $this->resultFactory->create(\Magento\Framework\Controller\ResultFactory::TYPE_PAGE);
        $resultPage->setActiveMenu('Neotiq_BoxprintAdmin::workspace');
        $resultPage->getConfig()->getTitle()->prepend(__('Workspace Default'));
        $resultPage->addBreadcrumb(__('Workspace'), __('Workspace Default'));
        return $resultPage;
    }
	
	 public function _isAllowed()
    {
        return $this->_authorization->isAllowed('Neotiq_BoxprintAdmin::boxprint');
    }
}
