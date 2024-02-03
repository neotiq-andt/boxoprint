<?php
/**
 * custom ducdevphp@gmail.com
 */
namespace Neotiq\Boxprint\Controller\Index;
use Magento\Framework\App\Action\HttpPostActionInterface as HttpPostActionInterface;
use Magento\Framework\Controller\ResultFactory;
class Checkcart extends \Magento\Framework\App\Action\Action
{
    protected $resultPageFactory;
    protected $neotiqBoxprintHelperData;
    protected $formKey;
    protected $request;
    protected $_checkoutSession;
    protected $cart;
    protected $cartHelper;
    public function __construct(
        \Magento\Framework\App\Action\Context $context,
        \Magento\Framework\View\Result\PageFactory $resultPageFactory,
        \Neotiq\Boxprint\Helper\Data $neotiqBoxprintHelperData,
        \Magento\Framework\Data\Form\FormKey $formKey,
        \Magento\Framework\App\Request\Http $request,
        \Magento\Checkout\Model\Session $checkoutSession,
        \Magento\Checkout\Model\Cart $cart,
        \Magento\Checkout\Helper\Cart $cartHelper
    )
    {
        $this->resultPageFactory = $resultPageFactory;
        $this->neotiqBoxprintHelperData = $neotiqBoxprintHelperData;
        $this->request = $request;
        $this->formKey = $formKey;
        $this->_checkoutSession = $checkoutSession;
        $this->cart = $cart;
        $this->cartHelper = $cartHelper;
        parent::__construct($context);
    }

    public function execute()
    {

        $data = $this->getRequest()->getParams();
        $res['check'] = false;
        if($this->cartHelper->getItemsCount() === 0) {
            $this->getResponse()->representJson(
                $this->_objectManager->get('Magento\Framework\Json\Helper\Data')->jsonEncode($res)
            );
        }
        /** $res['popup'] = $this->_view->getLayout()->createBlock('Magento\Framework\View\Element\Template')->setTemplate('Neotiq_Boxprint::html/popup_check.phtml')->setData($data)->toHtml(); */
        $allItems = $this->_checkoutSession->getQuote()->getAllVisibleItems();
        $arr = [];
        foreach ($allItems as $item) {
            if($item->getMdqWorkspaceid()){
                if(!$this->neotiqBoxprintHelperData->getWorkspaceById($item->getMdqWorkspaceid())){
                    $arr[] = $item->getName();
                }
            }else{
                $arr[] = $item->getName();
            }
        }
        if(count($arr) > 0) {
            $res['check'] = true;
        }
        $this->getResponse()->representJson(
            $this->_objectManager->get('Magento\Framework\Json\Helper\Data')->jsonEncode($res)
        );
    }
}
