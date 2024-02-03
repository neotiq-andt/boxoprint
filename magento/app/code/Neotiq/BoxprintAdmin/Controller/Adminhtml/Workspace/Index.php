<?php
/**
 * custom ducdevphp@gmail.com
 */


namespace Neotiq\BoxprintAdmin\Controller\Adminhtml\Workspace;

class Index extends \Magento\Backend\App\Action
{
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
        $resultPage->getConfig()->getTitle()->prepend(__('Workspace'));
        $resultPage->addBreadcrumb(__('Workspace'), __('Workspace'));
        return $resultPage;
    }
}
