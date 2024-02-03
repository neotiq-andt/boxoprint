<?php
namespace Neotiq\Ajaxlogin\Block;

use Magento\Customer\Helper\Address;
use Magento\Customer\Model\AccountManagement;
use Magento\Framework\App\ObjectManager;
use Magento\Newsletter\Model\Config;
use Magento\Store\Model\ScopeInterface;
use Magento\Framework\UrlInterface;

class Register extends \Magento\Framework\View\Element\Template
{

    protected $_customerSession;

    protected $urlBuilder;

    protected $_moduleManager;

    protected $_customerUrl;

    private $newsLetterConfig;

    protected $neotiqHelperData;

    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \Magento\Framework\Module\Manager $moduleManager,
        \Magento\Customer\Model\Session $customerSession,
        \Magento\Customer\Model\Url $customerUrl,
        UrlInterface $urlBuilder,
        array $data = [],
        Config $newsLetterConfig = null,
        \Neotiq\Neotiq\Helper\Data $neotiqHelperData
    ) {
        $this->_customerUrl = $customerUrl;
        $this->_moduleManager = $moduleManager;
        $this->urlBuilder = $urlBuilder;
        $this->_customerSession = $customerSession;
        $this->newsLetterConfig = $newsLetterConfig ?: ObjectManager::getInstance()->get(Config::class);
        parent::__construct(
            $context,
            $data
        );
        $this->_isScopePrivate = false;
        $this->neotiqHelperData = $neotiqHelperData;
    }

    public function getConfig($path)
    {
        return $this->_scopeConfig->getValue($path, \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
    }
    public function isLoggedIn()
    {
        return $this->_customerSession->isLoggedIn();
    }

    public function getPostActionUrl()
    {
        return $this->urlBuilder->getUrl('mdqajaxlogin/index/create');
    }

    public function getBackUrl()
    {
        $url = $this->getData('back_url');
        if ($url === null) {
            $url = $this->_customerUrl->getLoginUrl();
        }
        return $url;
    }

    public function getFormData()
    {
        $data = $this->getData('form_data');
        if ($data === null) {
            $formData = $this->_customerSession->getCustomerFormData(true);
            $data = new \Magento\Framework\DataObject();
            if ($formData) {
                $data->addData($formData);
                $data->setCustomerData(1);
            }
            if (isset($data['region_id'])) {
                $data['region_id'] = (int)$data['region_id'];
            }
            $this->setData('form_data', $data);
        }
        return $data;
    }


    public function getCountryId()
    {
        $countryId = $this->getFormData()->getCountryId();
        if ($countryId) {
            return $countryId;
        }
        return parent::getCountryId();
    }

    public function getRegion()
    {
        if (null !== ($region = $this->getFormData()->getRegion())) {
            return $region;
        } elseif (null !== ($region = $this->getFormData()->getRegionId())) {
            return $region;
        }
        return null;
    }

    public function isNewsletterEnabled()
    {
        return $this->_moduleManager->isOutputEnabled('Magento_Newsletter')
            && $this->newsLetterConfig->isActive(ScopeInterface::SCOPE_STORE);
    }

    public function restoreSessionData(\Magento\Customer\Model\Metadata\Form $form, $scope = null)
    {
        if ($this->getFormData()->getCustomerData()) {
            $request = $form->prepareRequest($this->getFormData()->getData());
            $data = $form->extractData($request, $scope, false);
            $form->restoreData($data);
        }

        return $this;
    }

    public function getMinimumPasswordLength()
    {
        return $this->_scopeConfig->getValue(AccountManagement::XML_PATH_MINIMUM_PASSWORD_LENGTH);
    }

    public function getRequiredCharacterClassesNumber()
    {
        return $this->_scopeConfig->getValue(AccountManagement::XML_PATH_REQUIRED_CHARACTER_CLASSES_NUMBER);
    }

    public function isEnable() {
        return $this->neotiqHelperData->getConfig('neotiq_ajaxlogin/general/enabled');
    }
}
