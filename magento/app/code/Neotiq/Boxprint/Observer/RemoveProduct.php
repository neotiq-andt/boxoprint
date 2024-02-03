<?php

namespace Neotiq\Boxprint\Observer;

use Magento\Framework\Event\Observer as EventObserver;
use Magento\Framework\Event\ObserverInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Checkout\Model\Session;
use Magento\Framework\Serialize\Serializer\Json as JsonSerializer;
use Magento\Checkout\Model\Cart as CustomerCart;

class RemoveProduct implements ObserverInterface
{
    /**
     * @var RequestInterface
     */
    protected $_request;

    /**
     * Json Serializer
     *
     * @var JsonSerializer
     */
    protected $jsonSerializer;

    protected $cart;
    /**
     * Set payment fee to order
     *
     * @param EventObserver $observer
     * @return $this
     */

    protected  $neotiqBoxprintHelperData;

    protected $neotiqHelperData;

    public function __construct(
        JsonSerializer $jsonSerializer,
        RequestInterface $request,
        Session $checkoutSession,
        \Magento\Quote\Model\Quote\ItemFactory $quoteItemFactory,
        \Magento\Quote\Model\ResourceModel\Quote\Item $itemResourceModel,
        \Magento\Quote\Model\QuoteFactory $quoteFactory,
        \Magento\Quote\Api\CartRepositoryInterface $itemRepository,
        CustomerCart $cart,
        \Psr\Log\LoggerInterface $logger,
        \Neotiq\Boxprint\Helper\Data $neotiqBoxprintHelperData,
        \Neotiq\Neotiq\Helper\Data $neotiqHelperData
    ) {
        $this->_request = $request;
        $this->jsonSerializer = $jsonSerializer;
        $this->_checkoutSession = $checkoutSession;
        $this->quoteItemFactory = $quoteItemFactory;
        $this->itemResourceModel = $itemResourceModel;
        $this->quoteFactory = $quoteFactory;
        $this->itemRepository = $itemRepository;
        $this->cart = $cart;
        $this->_logger = $logger;
        $this->neotiqBoxprintHelperData = $neotiqBoxprintHelperData;
        $this->neotiqHelperData = $neotiqHelperData;
    }

    /**
     * @param \Magento\Framework\Event\Observer $observer
     */
    public function execute(\Magento\Framework\Event\Observer $observer)
    {
        if(!$this->neotiqHelperData->getConfig('neotiq_boxprint_config/neotiq_cart/auto_remove')){
            return;
        }
            $quoteItem = $observer->getQuoteItem();
            $quote = $quoteItem->getQuote();
            $remove= false;
            if($quoteItem->getMdqWorkspaceid()){
                if($this->neotiqBoxprintHelperData->getWorkspaceById($quoteItem->getMdqWorkspaceid())){
                    $remove = true;
                } else{
                    $remove = false;
                }
            }else{
                $remove = false;
            }
            if($remove) {
                $workspace = $this->neotiqBoxprintHelperData->getWorkspaceById($quoteItem->getMdqWorkspaceid());
                if(!$this->neotiqBoxprintHelperData->checkWorkspaceIsDefault($workspace->getWorkspaceId())){
                    if(!$workspace->getData('customer_email') && !$workspace->getData('increment_id')){
                        $workspace->delete();
                    }
                }
//                $itemId = $item->getItemId();
//                $this->cart->removeItem($itemId)->save();
            }
    }
}