<?php
/**
 * custom ducdevphp@gmail.com
 */
namespace Neotiq\Boxprint\Controller\Index;
use Magento\Framework\App\Action\HttpPostActionInterface as HttpPostActionInterface;
use Magento\Framework\Controller\ResultFactory;
class RemoveCart extends \Magento\Framework\App\Action\Action
{
    protected $resultPageFactory;
    protected $neotiqBoxprintHelperData;
    protected $formKey;
    protected $request;
    Protected $_checkoutSession;
    protected $quoteRepository;
    protected $quoteItem;
    private $formKeyValidator;
    protected $cartHelper;
    protected $cart;
    public function __construct(
        \Magento\Framework\App\Action\Context $context,
        \Magento\Framework\View\Result\PageFactory $resultPageFactory,
        \Neotiq\Boxprint\Helper\Data $neotiqBoxprintHelperData,
        \Magento\Framework\Data\Form\FormKey $formKey,
        \Magento\Framework\App\Request\Http $request,
        \Magento\Checkout\Model\Session $checkoutSession,
        \Magento\Quote\Api\CartRepositoryInterface $quoteRepository,
        \Magento\Quote\Model\Quote\Item $quoteItem,
        \Magento\Checkout\Helper\Cart $cartHelper,
        \Magento\Framework\Data\Form\FormKey\Validator $formKeyValidator,
        \Magento\Checkout\Model\Cart $cart
    )
    {
        $this->resultPageFactory = $resultPageFactory;
        $this->neotiqBoxprintHelperData = $neotiqBoxprintHelperData;
        $this->request = $request;
        $this->formKey = $formKey;
        $this->_checkoutSession = $checkoutSession;
        $this->quoteRepository = $quoteRepository;
        $this->quoteItem = $quoteItem;
        $this->cartHelper = $cartHelper;
        $this->formKeyValidator = $formKeyValidator;
        $this->cart = $cart;
        parent::__construct($context);
    }

    public function execute()
    {
        $res['remove'] = false;
        $res['message'] = __('');
        $data = $this->getRequest()->getParams();
        if (!$this->formKeyValidator->validate($this->getRequest())) {
            $this->getResponse()->representJson(
                $this->_objectManager->get('Magento\Framework\Json\Helper\Data')->jsonEncode($res)
            );;
        }
        if($this->cartHelper->getItemsCount() === 0) {
            $this->getResponse()->representJson(
                $this->_objectManager->get('Magento\Framework\Json\Helper\Data')->jsonEncode($res)
            );
        }
        try {
            $quoteId = $this->_checkoutSession->getQuote()->getId();
            $allItems = $this->_checkoutSession->getQuote()->getAllVisibleItems();
            $arr = [];
            foreach ($allItems as $item) {
                if($item->getMdqWorkspaceid()) {
                    if($this->neotiqBoxprintHelperData->getWorkspaceById($item->getMdqWorkspaceid())){
                        $remove = false;
                    } else{
                        $remove = true;
                        $arr[] = $item->getName();
                    }
                } else {
                    $remove = true;
                    $arr[] = $item->getName();
                }

                if($remove) {
                    $itemId = $item->getItemId();
                    $this->cart->removeItem($itemId)->save();
                    //$quoteItem= $this->quoteItem->load($itemId);
                    //$quoteItem->delete();
                    //$quote = $this->quoteRepository->get($quoteId);
                    //$this->quoteRepository->save($quote);
                }
            }
            if(count($arr) > 0) {
                $res['remove'] = true;
            }
        } catch (\Exception $e) {
            $res['remove'] = false;
        }
        $this->getResponse()->representJson(
            $this->_objectManager->get('Magento\Framework\Json\Helper\Data')->jsonEncode($res)
        );
    }
}
