<?php
namespace Neotiq\BoxprintAdmin\Ui\DataProvider\Form;

use Magento\Ui\DataProvider\AbstractDataProvider;
use Magento\Framework\App\Request\DataPersistorInterface;
use Neotiq\BoxprintAdmin\Model\ResourceModel\Template\Collection;
use Neotiq\BoxprintAdmin\Model\ResourceModel\Template\CollectionFactory;

class TemplateDataProvider extends AbstractDataProvider
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
        array $meta = [],
        array $data = []
    ) {
        $this->collection = $collectionFactory->create();
        $this->dataPersistor = $dataPersistor;
        parent::__construct($name, $primaryFieldName, $requestFieldName, $meta, $data);
    }

    public function getData()
    {
        if (isset($this->loadedData)) {
            return $this->loadedData;
        }
        $items = $this->collection->getItems();
        foreach ($items as $model) {
            $this->loadedData[$model->getId()] = $model->getData();
        }
        $data = $this->dataPersistor->get('boxoprint_template_data');

        if (!empty($data)) {
            $model = $this->collection->getNewEmptyItem();
            $model->setData($data);
            $this->loadedData[$model->getId()] = $model->getData();
            $this->dataPersistor->clear('boxoprint_template_data');
        }

        return $this->loadedData;
    }
}
