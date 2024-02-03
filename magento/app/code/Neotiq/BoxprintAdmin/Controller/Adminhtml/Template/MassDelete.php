<?php
namespace Neotiq\BoxprintAdmin\Controller\Adminhtml\Template;

use Magento\Framework\Controller\ResultFactory;
use Magento\Backend\App\Action\Context;
use Magento\Ui\Component\MassAction\Filter;
use Neotiq\BoxprintAdmin\Model\ResourceModel\Template\CollectionFactory;

class MassDelete extends \Magento\Backend\App\Action
{
    const ADMIN_RESOURCE = 'Neotiq_BoxprintAdmin::boxprint';

    protected $filter;

    protected $collectionFactory;

    public function __construct(Context $context, Filter $filter, CollectionFactory $collectionFactory)
    {
        $this->filter = $filter;
        $this->collectionFactory = $collectionFactory;
        parent::__construct($context);
    }

    public function execute()
    {
        $collection = $this->filter->getCollection($this->collectionFactory->create());
        $collectionSize = $collection->getSize();

        foreach ($collection as $block) {
            $block->delete();
        }

        $this->messageManager->addSuccess(__('A total of %1 template(s) have been deleted.', $collectionSize));

        $resultRedirect = $this->resultFactory->create(ResultFactory::TYPE_REDIRECT);
        return $resultRedirect->setPath('*/*/');
    }
}
