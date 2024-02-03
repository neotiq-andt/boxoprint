<?php
/**
 * custom ducdevphp@gmail.com
 */
namespace Neotiq\Boxprint\Controller\Index;
use Magento\Framework\App\Action\HttpPostActionInterface as HttpPostActionInterface;
class Cookie extends \Magento\Framework\App\Action\Action implements HttpPostActionInterface
{
    protected $resultPageFactory;
    protected $storeManager;
    protected $connection;
    protected $resource;
    protected $neotiqBoxprintHelperData;
    protected $neotiqBoxprintHelperCookie;
    protected $formKey;
    protected $request;
    public function __construct(
        \Magento\Framework\App\Action\Context $context,
        \Magento\Framework\View\Result\PageFactory $resultPageFactory,
        \Magento\Framework\App\ResourceConnection $resourceConnection,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Neotiq\Boxprint\Helper\Data $neotiqBoxprintHelperData,
        \Neotiq\Boxprint\Helper\Cookie $neotiqBoxprintHelperCookie,
        \Magento\Framework\Data\Form\FormKey $formKey,
        \Magento\Framework\App\Request\Http $request
    )
    {
        $this->resultPageFactory = $resultPageFactory;
        $this->storeManager = $storeManager;
        $this->connection = $resourceConnection->getConnection();
        $this->resource = $resourceConnection;
        $this->neotiqBoxprintHelperData = $neotiqBoxprintHelperData;
        $this->neotiqBoxprintHelperCookie =$neotiqBoxprintHelperCookie;
        $this->request = $request;
        $this->formKey = $formKey;
        $this->request->setParam('form_key', $this->formKey->getFormKey());
        parent::__construct($context);
    }

    public function execute()
    {
        //$this->_view->loadLayout();
        $params = $this->getRequest()->getContent();
        //$params = $this->getRequest()->getPostValue();
       // $params = $this->getRequest()->getParams();
        $params_c = json_decode($params,true);
        $res = ['error'=> true];
        $this->neotiqBoxprintHelperCookie->setValueCookie($params_c);
        //if ($this->getRequest()->isAjax() && !empty($params)) {
            if($this->neotiqBoxprintHelperCookie->get()) {
               $cookie = $this->neotiqBoxprintHelperCookie->get();
               var_dump($cookie);die();
            }else {

            }
            $res = ['error'=> false];
        //}
//        $this->getResponse()->representJson(
//            $this->_objectManager->get('Magento\Framework\Json\Helper\Data')->jsonEncode($res)
//        );
    }
}
