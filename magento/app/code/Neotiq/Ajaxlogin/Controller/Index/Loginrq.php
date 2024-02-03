<?php
/**
 * custom ducdevphp@gmail.com
 */
namespace Neotiq\Ajaxlogin\Controller\Index;
use Magento\Framework\App\Action\HttpPostActionInterface as HttpPostActionInterface;
use Magento\Framework\Controller\ResultFactory;
use Magento\Framework\Exception\AuthenticationException;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\App\Request\InvalidRequestException;
use Magento\Framework\Data\Form\FormKey\Validator;
use Magento\Customer\Model\Session;
class Loginrq extends \Magento\Framework\App\Action\Action implements HttpPostActionInterface
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
    protected $_customerSessionFactory;
    protected $customerFactory;
    private $cookieMetadataManager;
    private $cookieMetadataFactory;
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
        \Magento\Customer\Model\SessionFactory $customerSessionFactory,
        \Magento\Customer\Model\CustomerFactory $customerFactory,
        \Magento\Framework\Stdlib\Cookie\PhpCookieManager $cookieManager,
        \Magento\Framework\Stdlib\Cookie\CookieMetadataFactory $cookieMetadataFactory
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
        $this->_customerSessionFactory = $customerSessionFactory;
        $this->customerFactory = $customerFactory;
        $this->cookieMetadataManager = $cookieManager;
        $this->cookieMetadataFactory = $cookieMetadataFactory;
        parent::__construct($context);
    }

    public function execute()
    {
        $resultJson = $this->resultJsonFactory->create();
        if ($this->httpContext->getValue(\Magento\Customer\Model\Context::CONTEXT_AUTH)) {
            $response = [
                'error' => false,
                'message' => 'the session is logged in or entered data is not valid',
                'flag' => true,
                'email' => $this->_customerSessionFactory->create()->getCustomer()->getEmail()
            ];
            return $resultJson->setData($response);
        }

        if (!$this->getRequest()->isPost()){
            $response = [
                'error' => true,
                'message' => __('Your account cannot be loggin'),
                'flag' => false
            ];
            return $resultJson->setData($response);
        }

        $params =  $this->requestapi->getBodyParams();
        $formKey = (isset($params["form_key"]) && !empty($params["form_key"]) ) ? $params["form_key"] : false;
        if(!$formKey){
            $response = [
                'error' => true,
                'message' => __('Your account cannot be loggin'),
                'flag' => false
            ];
            return $resultJson->setData($response);
        }

        if(\Magento\Framework\Encryption\Helper\Security::compareStrings($formKey, $this->formKey->getFormKey())==false){
            $response = [
                'error' => true,
                'message' => __('Your account cannot be loggin'),
                'flag' => false
            ];
            return $resultJson->setData($response);
        }

//        if (!$this->getRequest()->isPost() || !$this->formKeyValidator->validate($this->getRequest())){
//            $response = [
//                'errors' => true,
//                'message' => __('Your account cannot be loggin'),
//                'flag' => false
//            ];
//            return $resultJson->setData($response);
//        }


        $email = (isset($params["username"]) && !empty($params["username"]) ) ? $params["username"] : false;
        $password = (isset($params["password"]) && !empty($params["password"]) ) ? $params["password"] : false;
        if ($email && $password) {
            /* @var $customerAccountManagement \Magento\Customer\Api\AccountManagementInterface */
            $customerAccountManagement = $this->_objectManager->get('Magento\Customer\Api\AccountManagementInterface');
            $customerSession = $this->_objectManager->get('Magento\Customer\Model\Session');
            try {
                /* @var $customer \Magento\Customer\Api\Data\CustomerInterface */
                $customer = $customerAccountManagement->authenticate($email, $password);
                $websiteId = $customer->getWebsiteId();

                /* @var $_customer \Magento\Customer\Model\Customer */
                $_customer = $this->_objectManager
                    ->get('Magento\Customer\Model\Customer')
                    ->setWebsiteId($websiteId);
                //$_customer = $this->customerFactory->create()->setWebsiteId($websiteId);
                $this->session->setCustomerAsLoggedIn($_customer->loadByEmail($email));
                //force Magento 2 to reload Customer Data in frontend
                if ($this->cookieMetadataManager->getCookie('mage-cache-sessid')) {
                    $metadata = $this->cookieMetadataFactory->createCookieMetadata();
                    $metadata->setPath('/');
                    $this->cookieMetadataManager->deleteCookie('mage-cache-sessid', $metadata);
                }
                $response = [
                    'error' => false,
                    'message' =>  __('Connecté'),
                    'email' => $email,
                    'flag' => true
                ];
            } catch(\Magento\Framework\Exception\InvalidEmailOrPasswordException $ex) {
                $response = [
                    'error' => true,
                    'message' =>  'The Email is not confirmed yet, please check mail and confirm!'
                ];
            } catch (AuthenticationException $e) {
                $response = [
                    'error' => true,
                    'message' =>  'The account sign-in was incorrect or your account is disabled temporarily. '
                ];
            }catch (\Exception $e) {
                $response = [
                    'error' => true,
                    'message' =>  'An unspecified error occurred. Please contact us for assistance.'
                ];
            }
        }
        return $resultJson->setData($response);
    }
}