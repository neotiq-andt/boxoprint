<?php
namespace Neotiq\Ajaxlogin\Block;

class Login extends \Magento\Framework\View\Element\Template
{

    protected $customerSession;

    protected $httpContext;

    protected $registration;

    protected $_customerUrl;

    protected $neotiqHelperData;

    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \Magento\Customer\Model\Session $customerSession,
        \Magento\Framework\App\Http\Context $httpContext,
        \Magento\Customer\Model\Registration $registration,
        \Magento\Customer\Model\Url $customerUrl,
        \Neotiq\Neotiq\Helper\Data $neotiqHelperData,
        array $data = []
    ) {
        parent::__construct($context, $data);
        $this->customerSession = $customerSession;
        $this->httpContext = $httpContext;
        $this->neotiqHelperData = $neotiqHelperData;
        $this->registration = $registration;
        $this->_customerUrl = $customerUrl;
    }

    public function isLoggedIn()
    {
        return $this->customerSession->isLoggedIn();
    }

    public function getRegistration()
    {
        return $this->registration;
    }


    public function isAutocompleteDisabled()
    {
        return (bool)!$this->_scopeConfig->getValue(
            \Magento\Customer\Model\Form::XML_PATH_ENABLE_AUTOCOMPLETE,
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE
        );
    }

    public function customerIsAlreadyLoggedIn()
    {
        return (bool)$this->httpContext->getValue(\Magento\Customer\Model\Context::CONTEXT_AUTH);
    }

    public function getForgotPasswordUrl()
    {
        return $this->_customerUrl->getForgotPasswordUrl();
    }
    public function isEnable() {
        return $this->neotiqHelperData->getConfig('neotiq_ajaxlogin/general/enabled');
    }
}