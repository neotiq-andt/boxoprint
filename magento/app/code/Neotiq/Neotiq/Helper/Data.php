<?php
/**
 * ducdevphp@gmail.com
 */
namespace Neotiq\Neotiq\Helper;

use Magento\Framework\Registry;

class Data extends \Magento\Framework\App\Helper\AbstractHelper
{

    protected $_objectManager;
    protected $_registry;
    protected $_filterProvider;
    protected $_session;
    protected $moduleManager;
	protected $sessionFactory;

    public function __construct(
        \Magento\Framework\App\Helper\Context $context,
        \Magento\Framework\ObjectManagerInterface $objectManager,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Magento\Cms\Model\Template\FilterProvider $filterProvider,
        \Magento\Customer\Model\Session $session,
        \Magento\Framework\Module\Manager $moduleManager,
        Registry $registry,
		\Magento\Customer\Model\SessionFactory $sessionFactory
    ) {
        $this->_storeManager = $storeManager;
        $this->_objectManager = $objectManager;
        $this->_filterProvider = $filterProvider;
        $this->_registry = $registry;
        $this->_session = $session;
        $this->moduleManager = $moduleManager;
		$this->sessionFactory = $sessionFactory;

        parent::__construct($context);
    }
    public function getBaseUrl()
    {
        return $this->_storeManager->getStore()->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA);
    }
    public function getConfig($config_path)
    {
        return $this->scopeConfig->getValue(
            $config_path,
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE
        );
    }
    public function getCurrentStore()
    {
        return $this->_storeManager->getStore();
    }
    public function filterContent($content)
    {
        return $this->_filterProvider->getPageFilter()->filter($content);
    }
    public function isCustomerLoggedIn()
    {
        return $this->getCustomerSession()->isLoggedIn();
    }
    public function getCurrentUrls()
    {
        return $this->_urlBuilder->getCurrentUrl();
    }
    public function getCurrentCategory()
    {
        return $this->_registry->registry('current_category');
    }
    public function checkProductInStock($product) {
        if ($product->isSaleable()){
            return true;
        }
        return false;
    }
    public function getCurrentProduct() {
        return $this->_registry->registry('current_product');
    }

    public function getSymbol() {
        return  $this->_storeManager->getStore()->getCurrentCurrency()->getCurrencySymbol();
    }

    public function getCustomer() {
        if($this->isCustomerLoggedIn()){
            return $this->getCustomerSession()->getCustomer();
        }
        return null;
    }

    public function getCustomerId() {
        if($this->isCustomerLoggedIn()){
            return $this->getCustomerSession()->getCustomer()->getId();
        }
        return '';
    }

    public function checkModuleEnable($name){
        if ($this->moduleManager->isEnabled($name)) {
            return true;
        }else{
            return false;
        }
    }
	
	public function getCustomerSession()
    {
        return $this->sessionFactory->create();
    }
}
