<?php
/**
 *  custom ducdevphp@gmail.com
 */

namespace Neotiq\BoxprintAdmin\Ui\Component\Listing\Column;

use Magento\Framework\Filter\FilterManager;
use Magento\Framework\View\Element\UiComponent\ContextInterface;
use Magento\Framework\View\Element\UiComponentFactory;

class ProductLink extends \Magento\Ui\Component\Listing\Columns\Column
{

    protected $_productloader;

    private $filterManager;


    public function __construct(
        \Magento\Catalog\Model\ProductFactory $_productloader,
        ContextInterface $context,
        UiComponentFactory $uiComponentFactory,
        FilterManager $filterManager,
        array $components = [],
        array $data = []
    ) {
        parent::__construct($context, $uiComponentFactory, $components, $data);
        $this->_productloader = $_productloader;
        $this->filterManager = $filterManager;
    }

    /**
     * @param array $dataSource
     * @return array
     */
    public function prepareDataSource(array $dataSource)
    {
        if (isset($dataSource['data']['items'])) {
            foreach ($dataSource['data']['items'] as &$item) {
                $productModel = $this->getProductModel($item);
                if($productModel->getId()){
                    $item['product_id_url'] = $this->getLink($item['product_id']);
                    $item['product_id_name'] = $productModel->getName();
                }else {
                    $item['product_id_url'] = '';
                    $item['product_id_name'] = 'N/A';
                }
            }
        }
        return $dataSource;
    }

    private function getLink($entityId)
    {
        return $this->context->getUrl('catalog/product/edit', ['id' => $entityId]);
    }

    public function getProductModel($item)
    {
        $product_id = $item['product_id'];
        $modelProduct = $this->_productloader->create()->load($product_id);
        return $modelProduct;
    }
}
