<?php
namespace Neotiq\BoxprintAdmin\Ui\DataProvider\Form;

use Magento\Ui\DataProvider\AbstractDataProvider;
use Magento\Framework\App\Request\DataPersistorInterface;
use Neotiq\BoxprintAdmin\Model\ResourceModel\Workspace\Collection;
use Neotiq\BoxprintAdmin\Model\ResourceModel\Workspace\CollectionFactory;
use Magento\Store\Model\StoreManagerInterface;

class WorkspaceDataProvider extends AbstractDataProvider
{

    protected $collection;

    protected $dataPersistor;

    protected $loadedData;

    public function __construct(
        $name,
        $primaryFieldName,
        $requestFieldName,
        CollectionFactory $collectionFactory,
        DataPersistorInterface $dataPersistor,
        StoreManagerInterface $storeManager,
        array $meta = [],
        array $data = []
    ) {
        $this->collection = $collectionFactory->create();
        $this->dataPersistor = $dataPersistor;
        $this->storeManager = $storeManager;
        parent::__construct($name, $primaryFieldName, $requestFieldName, $meta, $data);
    }

    public function getData()
    {
        if (isset($this->loadedData)) {
            return $this->loadedData;
        }
        $items = $this->collection->getItems();
        foreach ($items as $model) {
            //$this->loadedData[$model->getId()] = $model->getData();
            $rec = $model->getData();
            $rec['mdq_edit'] = true;
            $this->loadedData[$model->getId()] = $rec;
            if ($model->getImage()) {
                $m['image'][0]['name'] = $model->getImage();
                $m['image'][0]['url'] = $this->getMediaUrl().$model->getImage();
                $fullData = $this->loadedData;
                $this->loadedData[$model->getId()] = array_merge($fullData[$model->getId()], $m);
            }
        }
        $data = $this->dataPersistor->get('boxoprint_workspace_data');

        if (!empty($data)) {
            $model = $this->collection->getNewEmptyItem();
            $model->setData($data);
            $this->loadedData[$model->getId()] = $model->getData();
            $this->dataPersistor->clear('boxoprint_workspace_data');
        }

        return $this->loadedData;
    }

    public function getMediaUrl()
    {
        $mediaUrl = $this->storeManager->getStore()
                ->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA).'boxoprint/image/';
        return $mediaUrl;
    }
}
