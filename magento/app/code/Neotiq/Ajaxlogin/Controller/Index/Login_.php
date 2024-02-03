<?php
/**
 * custom ducdevphp@gmail.com
 */
namespace Neotiq\Ajaxlogin\Controller\Index;
use Magento\Framework\App\Action\HttpPostActionInterface as HttpPostActionInterface;
use Magento\Framework\Controller\ResultFactory;
class Login extends \Magento\Framework\App\Action\Action implements HttpPostActionInterface
{
    protected $resultPageFactory;
    protected $storeManager;
    protected $connection;
    protected $resource;
    protected $neotiqBoxprintHelperData;
    protected $formKey;
    protected $request;
    public function __construct(
        \Magento\Framework\App\Action\Context $context,
        \Magento\Framework\View\Result\PageFactory $resultPageFactory,
        \Magento\Framework\App\ResourceConnection $resourceConnection,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Neotiq\Boxprint\Helper\Data $neotiqBoxprintHelperData,
        \Magento\Framework\Data\Form\FormKey $formKey,
        \Magento\Framework\App\Request\Http $request
    )
    {
        $this->resultPageFactory = $resultPageFactory;
        $this->storeManager = $storeManager;
        $this->connection = $resourceConnection->getConnection();
        $this->resource = $resourceConnection;
        $this->neotiqBoxprintHelperData = $neotiqBoxprintHelperData;
        $this->request = $request;
        $this->formKey = $formKey;
        $this->request->setParam('form_key', $this->formKey->getFormKey());
        parent::__construct($context);
    }

    public function execute()
    {
        $params =  $this->getRequest()->getParams();
        $email = (isset($params["username"]) && !empty($params["username"]) ) ? $params["username"] : false;
        $password = (isset($params["password"]) && !empty($params["password"]) ) ? $params["password"] : false;
        if ($email && $password) {
            /* @var $customerAccountManagement \Magento\Customer\Api\AccountManagementInterface */
            $customerAccountManagement = $this->objectManager->get('Magento\Customer\Api\AccountManagementInterface');
            $customerSession = $this->objectManager->get('Magento\Customer\Model\Session');
            try {
                /* @var $customer \Magento\Customer\Api\Data\CustomerInterface */
                $customer = $customerAccountManagement->authenticate($email, $password);
                $websiteId = $customer->getWebsiteId();

                /* @var $_customer \Magento\Customer\Model\Customer */
                $_customer = $this->objectManager
                    ->get('Magento\Customer\Model\Customer')
                    ->setWebsiteId($websiteId);

                $customerSession->setCustomerAsLoggedIn($_customer->loadByEmail($email));

            } catch(\Magento\Framework\Exception\InvalidEmailOrPasswordException $ex) {

            }
        }
    }
}