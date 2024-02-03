<?php
namespace Neotiq\BoxprintAdmin\Controller\Adminhtml\Template;

use Neotiq\BoxprintAdmin\Model\Template as TemplateModel;
use Magento\Framework\Controller\ResultFactory;
use Magento\Backend\App\Action\Context;
use Magento\Ui\Component\MassAction\Filter;
use Neotiq\BoxprintAdmin\Model\ResourceModel\Template\CollectionFactory;

class MassEnable extends \Magento\Backend\App\Action
{
    const SUCCESS_MESSAGE = 'A total of %1 template(s) have been enabled.';

    const ADMIN_RESOURCE = 'Neotiq_BoxprintAdmin::boxprint';

    const ID_FIELD = 'template_id';

    const REDIRECT_URL = '*/*/';

    protected $filter;

    protected $templateCollectionFactory;

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
