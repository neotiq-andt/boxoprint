<?php
/**
 * custom ducdevphp@gmail.com
 */
namespace Neotiq\Ajaxlogin\Controller\Index;
use Magento\Framework\App\Action\HttpPostActionInterface as HttpPostActionInterface;
use Magento\Framework\Controller\ResultFactory;
class Popup extends \Magento\Framework\App\Action\Action implements HttpPostActionInterface
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

        //$this->_view->loadLayout();
       // $params = $this->getRequest()->getContent();
        $data = $this->getRequest()->getParams();
        //return $this->resultFactory->create(ResultFactory::TYPE_LAYOUT);
        $res['popup'] = $this->_view->getLayout()->createBlock('Neotiq\Ajaxlogin\Block\Login')->setTemplate('Neotiq_Ajaxlogin::login.phtml')->setData($data)->toHtml();
        $res['popup'].= $this->_view->getLayout()->createBlock('Neotiq\Ajaxlogin\Block\Register')->setTemplate('Neotiq_Ajaxlogin::register.phtml')->setData($data)->toHtml();
        //$params = $this->getRequest()->getPostValue();
        // $params = $this->getRequest()->getParams();
        $this->getResponse()->representJson(
            $this->_objectManager->get('Magento\Framework\Json\Helper\Data')->jsonEncode($res)
        );
    }
}
