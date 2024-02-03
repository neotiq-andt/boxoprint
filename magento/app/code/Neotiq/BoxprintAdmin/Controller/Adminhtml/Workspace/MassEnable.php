<?php
namespace Neotiq\BoxprintAdmin\Controller\Adminhtml\Workspace;

use Neotiq\BoxprintAdmin\Model\Template as TemplateModel;
use Magento\Framework\Controller\ResultFactory;
use Magento\Backend\App\Action\Context;
use Magento\Ui\Component\MassAction\Filter;
use Neotiq\BoxprintAdmin\Model\ResourceModel\Workspace\CollectionFactory;

class MassEnable extends \Magento\Backend\App\Action
{
    const SUCCESS_MESSAGE = 'A total of %1 workspace(s) have been enabled.';

    const ADMIN_RESOURCE = 'Neotiq_BoxprintAdmin::boxprint';

    const ID_FIELD = 'workspace_id';

    const REDIRECT_URL = '*/*/';

    protected $filter;

    protected $workspaceCollectionFactory;

    protected $status = 1;

    public function __construct(Context $context, Filter $filter, CollectionFactory $collectionFactory)
    {
        $this->filter = $filter;
        $this->collectionFactory = $collectionFactory;
        parent::__construct($context);
    }

    public function execute()
    {
        $collection = $this->filter->getCollection($this->collectionFactory->create());

        foreach ($collection as $item) {
            $item->setStatus($this->status);
            $item->save();
        }

        $this->messageManager->addSuccess(__(static::SUCCESS_MESSAGE, $collection->getSize()));

        $resultRedirect = $this->resultFactory->create(ResultFactory::TYPE_REDIRECT);

        return $resultRedirect->setPath(self::REDIRECT_URL);
    }
}
