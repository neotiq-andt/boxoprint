<?php
/**
 * ducdevphp@gmail.com
 */
namespace Neotiq\Boxprint\Helper;

use Magento\Framework\App\Helper\AbstractHelper as MagentoAbstractHelper;
use Magento\Framework\App\Helper\Context;

class Account extends MagentoAbstractHelper
{

    protected $storeManager;

    protected $neotiqHelperData;

    protected $_productRepository;

    public function __construct(
        Context $context,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Neotiq\Neotiq\Helper\Data $neotiqHelperData,
        \Magento\Catalog\Model\ProductRepository $productRepository
    ) {
        parent::__construct($context);
        $this->storeManager = $storeManager;
        $this->neotiqHelperData = $neotiqHelperData;
        $this->_productRepository = $productRepository;
    }

    public function getProductById($id)
    {
        try {
            $product = $this->_productRepository->getById($id);
        } catch (\Magento\Framework\Exception\NoSuchEntityException $e){
            $product = false;
        }
       return $product;
    }
}
?>
