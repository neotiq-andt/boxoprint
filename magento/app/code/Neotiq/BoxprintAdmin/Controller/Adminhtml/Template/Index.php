<?php
/**
 * custom ducdevphp@gmail.com
 */


namespace Neotiq\BoxprintAdmin\Controller\Adminhtml\Template;

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
        $resultPage->setActiveMenu('Neotiq_BoxprintAdmin::template');
        $resultPage->getConfig()->getTitle()->prepend(__('Template'));
        $resultPage->addBreadcrumb(__('Template'), __('Template'));
        return $resultPage;
    }
}
