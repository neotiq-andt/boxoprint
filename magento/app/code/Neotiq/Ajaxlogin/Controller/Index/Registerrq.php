<?php
/**
 * custom ducdevphp@gmail.com
 */
namespace Neotiq\Ajaxlogin\Controller\Index;
use Magento\Framework\App\Action\HttpPostActionInterface as HttpPostActionInterface;
use Magento\Framework\Data\Form\FormKey\Validator;
use Magento\Customer\Model\Session;
use Magento\Framework\App\ObjectManager;
use Magento\Framework\Exception\InputException;
use Magento\Customer\Model\CustomerExtractor;
use Magento\Customer\Api\AccountManagementInterface;
use Magento\Customer\Model\Account\Redirect as AccountRedirect;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Customer\Model\Url as CustomerUrl;
use Magento\Framework\UrlFactory;
use Magento\Framework\Exception\StateException;
class Registerrq extends \Magento\Framework\App\Action\Action implements HttpPostActionInterface
{
    protected $resultPageFactory;
    protected $storeManager;
    protected $connection;
    protected $resource;
    protected $neotiqAjaxloginHelperPopup;
    protected $formKey;
    protected $request;
    protected $requestapi;
    protected $resultJsonFactory;
    protected $customerSession;
    protected $session;
    protected $formKeyValidator;
    private $httpContext;
    protected $customerExtractor;
    protected $accountManagement;
    private $accountRedirect;
    protected $scopeConfig;
    private $cookieMetadataManager;
    private $cookieMetadataFactory;
    protected $customerUrl;
    protected $urlModel;
    protected $_customerSessionFactory;
	protected $requestFactory;
	
    public function __construct(
        \Magento\Framework\App\Action\Context $context,
        \Magento\Framework\View\Result\PageFactory $resultPageFactory,
        \Magento\Framework\App\ResourceConnection $resourceConnection,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Neotiq\Ajaxlogin\Helper\Popup $neotiqAjaxloginHelperPopup,
        \Magento\Framework\Data\Form\FormKey $formKey,
        \Magento\Framework\App\Request\Http $request,
        \Magento\Framework\Webapi\Rest\Request $requestapi,
        \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory,
        Session $customerSession,
        Validator $formKeyValidator,
        \Magento\Framework\App\Http\Context $httpContext,
        UrlFactory $urlFactory,
        CustomerUrl $customerUrl,
        AccountRedirect $accountRedirect,
        ScopeConfigInterface $scopeConfig,
        CustomerExtractor $customerExtractor,
        AccountManagementInterface $accountManagement,
        \Magento\Customer\Model\SessionFactory $customerSessionFactory,
        \Magento\Framework\Stdlib\Cookie\PhpCookieManager $cookieManager,
        \Magento\Framework\Stdlib\Cookie\CookieMetadataFactory $cookieMetadataFactory,
		\Magento\Framework\App\RequestFactory $requestFactory
    )
    {
        $this->resultPageFactory = $resultPageFactory;
        $this->storeManager = $storeManager;
        $this->connection = $resourceConnection->getConnection();
        $this->resource = $resourceConnection;
        $this->neotiqAjaxloginHelperPopup = $neotiqAjaxloginHelperPopup;
        $this->request = $request;
        $this->formKey = $formKey;
        $this->requestapi = $requestapi;
        //$this->request->setParam('form_key', $this->formKey->getFormKey());
        $this->resultJsonFactory = $resultJsonFactory;
        $this->session = $customerSession;
        $this->httpContext = $httpContext;
        $this->formKeyValidator = $formKeyValidator;
        $this->customerExtractor = $customerExtractor;
        $this->accountManagement = $accountManagement;
        $this->accountRedirect = $accountRedirect;
        $this->scopeConfig = $scopeConfig;
        $this->customerUrl = $customerUrl;
        $this->urlModel = $urlFactory->create();
        $this->_customerSessionFactory = $customerSessionFactory;
        $this->cookieMetadataManager = $cookieManager;
        $this->cookieMetadataFactory = $cookieMetadataFactory;
		$this->requestFactory = $requestFactory;
        parent::__construct($context);
    }

    private function getCookieManager()
    {
        if (!$this->cookieMetadataManager) {
            $this->cookieMetadataManager = ObjectManager::getInstance()->get(
                \Magento\Framework\Stdlib\Cookie\PhpCookieManager::class
            );
        }
        return $this->cookieMetadataManager;
    }

    private function getCookieMetadataFactory()
    {
        if (!$this->cookieMetadataFactory) {
            $this->cookieMetadataFactory = ObjectManager::getInstance()->get(
                \Magento\Framework\Stdlib\Cookie\CookieMetadataFactory::class
            );
        }
        return $this->cookieMetadataFactory;
    }

    public function execute()
    {
        $resultJson = $this->resultJsonFactory->create();
        if ($this->httpContext->getValue(\Magento\Customer\Model\Context::CONTEXT_AUTH)) {
            $response = [
                'error' => false,
                'message' => __('la session est connectée ou les données saisies ne sont pas valides'),
                'email' => $this->_customerSessionFactory->create()->getCustomer()->getEmail()
            ];
            return $resultJson->setData($response);
        }
        /* if (!$this->getRequest()->isPost() || !$this->formKeyValidator->validate($this->getRequest())){
            $response = [
                'errors' => true,
                'message' => __('Your account cannot be created')
            ];
            return $resultJson->setData($response);
        } */
		
		$params =  $this->requestapi->getBodyParams();
		$this->request->setParams($params);
		/* $request = $this->requestFactory->create();
        $request->setParams($params); */
        $formKey = (isset($params["form_key"]) && !empty($params["form_key"]) ) ? $params["form_key"] : false;
        if(!$formKey){
            $response = [
                'error' => true,
                'message' => __('Votre compte ne peut pas être créé'),
                'flag' => false
            ];
            return $resultJson->setData($response);
        }

        if(\Magento\Framework\Encryption\Helper\Security::compareStrings($formKey, $this->formKey->getFormKey())==false){
            $response = [
                'error' => true,
                'message' => __('Votre compte ne peut pas être créé'),
                'flag' => false
            ];
            return $resultJson->setData($response);
        }
		
        try {
            $resultRedirect = $this->resultRedirectFactory->create();
            $customer = $this->customerExtractor->extract('customer_account_create', $this->request);
            $password = isset($params['password']) ? $params['password'] : '';
            $confirmation = isset($params['password_confirmation']) ? $params['password_confirmation'] : '';
			
			if(!$password || !$confirmation){
				throw new InputException(__('Error input.'));
			}
            if ($password != $confirmation) {
                throw new InputException(__('Merci de vérifier que vos mots de passe correspondent.'));
            }
            $customer = $this->accountManagement->createAccount($customer, $password);
            $this->_eventManager->dispatch(
                'customer_register_success',
                ['account_controller' => $this, 'customer' => $customer]
            );
            $confirmationStatus = $this->accountManagement->getConfirmationStatus($customer->getId());
            if ($confirmationStatus === AccountManagementInterface::ACCOUNT_CONFIRMATION_REQUIRED) {
                $response = [
                    'error' => false,
                    'message' => __("Votre compte n'est pas encore confirmé, vérifiez votre courrier !")
                ];
                $this->messageManager->addComplexSuccessMessage(
                    'confirmAccountSuccessMessage',
                    [
                        'url' => $this->customerUrl->getEmailConfirmationUrl($customer->getEmail()),
                    ]
                );
                $url = $this->urlModel->getUrl('*/*/index', ['_secure' => true]);
                $resultRedirect->setUrl($this->_redirect->success($url));
            }
            else{
                $this->session->setCustomerDataAsLoggedIn($customer);
                $requestedRedirect = $this->accountRedirect->getRedirectCookie();
                if (!$this->scopeConfig->getValue('customer/startup/redirect_dashboard') && $requestedRedirect) {
                    $resultRedirect->setUrl($this->_redirect->success($requestedRedirect));
                    $this->accountRedirect->clearRedirectCookie();
                    return $resultRedirect;
                }
                $response = [
                    'error' => false,
                    'email' =>  $customer->getEmail(),
					'message' => __('Votre compte a été créé'),
                ];
                $resultRedirect = $this->accountRedirect->getRedirect();

            }
//            if ($this->getCookieManager()->getCookie('mage-cache-sessid')) {
//                $metadata = $this->getCookieMetadataFactory()->createCookieMetadata();
//                $metadata->setPath('/');
//                $this->getCookieManager()->deleteCookie('mage-cache-sessid', $metadata);
//            }
            //force Magento 2 to reload Customer Data in frontend
            if ($this->cookieMetadataManager->getCookie('mage-cache-sessid')) {
                $metadata = $this->cookieMetadataFactory->createCookieMetadata();
                $metadata->setPath('/');
                $this->cookieMetadataManager->deleteCookie('mage-cache-sessid', $metadata);
            }
        } catch (StateException $e) {
            $url = $this->urlModel->getUrl('customer/account/forgotpassword');
            $response = [
                'error' => true,
                'message' => __(
                    'There is already an account with this email address. If you are sure that it is your email address, <a href="%1">click here</a> to get your password and access your account.',
                    $url
                )
            ];
        } catch (InputException $e) {
            $response = [
                'error' => true,
                'message' => __("le mot de passe ne correspond pas à la confirmation du mot de passe !!")
            ];
        } catch (\Exception $e) {
            $response = [
                'error' => true,
                'message' => __("Nous ne pouvons pas sauver le client")
            ];
        }
        return $resultJson->setData($response);
    }
}