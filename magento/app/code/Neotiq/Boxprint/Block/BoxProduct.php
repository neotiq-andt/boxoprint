<?php
/**
 * ducdevphp@gmail.com
 */
namespace Neotiq\Boxprint\Block;

use Magento\Catalog\Api\CategoryRepositoryInterface;
use Magento\Catalog\Model\Category;
use Magento\Catalog\Model\Product;
use Magento\Eav\Model\Entity\Collection\AbstractCollection;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\DataObject\IdentityInterface;

class BoxProduct extends \Magento\Catalog\Block\Product\AbstractProduct
{

    protected $_catalogProductVisibility;

    protected $_productCollectionFactory;

    protected $_categoryFactory;

    protected $urlHelper;

    public function __construct(
        \Magento\Catalog\Block\Product\Context $context,
        \Magento\Catalog\Model\ResourceModel\Product\CollectionFactory $productCollectionFactory,
        \Magento\Catalog\Model\Product\Visibility $catalogProductVisibility,
        \Magento\Catalog\Model\CategoryFactory $categoryFactory,
        \Magento\Framework\Url\Helper\Data $urlHelper,
        array $data = []
    ) {
        $this->_categoryFactory = $categoryFactory;
        $this->_productCollectionFactory = $productCollectionFactory;
        $this->_catalogProductVisibility = $catalogProductVisibility;
        $this->urlHelper = $urlHelper;
        parent::__construct($context, $data);
    }

    public function getConfig($key, $default = '')
    {
        if($this->hasData($key) && $this->getData($key))
        {
            return $this->getData($key);
        }
        return $default;
    }

    public function getConfigBoxProduct($value = '') {
        $config =  $this->_scopeConfig->getValue('neotiq_boxproduct/general/'.$value, \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
        return $config;
    }

    public function getProducts() {

        $collection = $this->_productCollectionFactory->create();
        $collection->setVisibility($this->_catalogProductVisibility->getVisibleInCatalogIds());

        $collection = $this->_addProductAttributesAndPrices($collection)->addStoreFilter();

        $collection->addMinimalPrice()
            ->addFinalPrice()
            ->addTaxPercents()
            ->addAttributeToSelect('name')
            ->addAttributeToSelect('sku')
            ->addAttributeToSelect('image')
            ->addAttributeToSelect('small_image')
            ->addAttributeToSelect('thumbnail')
            ->addAttributeToSelect($this->_catalogConfig->getProductAttributes())
            ->addUrlRewrite();

        $skus = $this->getConfigBoxProduct('skus');
        if($skus) {
            $skus = "'" . str_replace(",", "','", $skus) . "'";
            $collection->addAttributeToFilter('sku', array('in' => explode(',',$this->getConfigBoxProduct('skus'))));
            $collection->getSelect()->order(new \Zend_Db_Expr("FIELD(sku,$skus)"));
        }
        //$collection->setPageSize(4);
        return $collection;
    }
	
	public function getTitleCf(){
		return $this->getConfigBoxProduct('title') ? $this->getConfigBoxProduct('title') : '';
	}

    public function getAddToCartPostParams(\Magento\Catalog\Model\Product $product)
    {
        $url = $this->getAddToCartUrl($product);
        return [
            'action' => $url,
            'data' => [
                'product' => $product->getEntityId(),
                \Magento\Framework\App\Action\Action::PARAM_NAME_URL_ENCODED =>
                    $this->urlHelper->getEncodedUrl($url),
            ]
        ];
    }

    public function getLoadedProductCollection() {
        return $this->getProducts();
    }

    public  function getBoxAddUrl(){
        return $this->getUrl('mdqboxprint/index/addtocart');
    }

}
