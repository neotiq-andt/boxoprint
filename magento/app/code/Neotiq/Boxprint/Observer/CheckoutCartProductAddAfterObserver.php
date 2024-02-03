<?php

namespace Neotiq\Boxprint\Observer;
use Magento\Framework\Event\Observer as EventObserver;
use Magento\Framework\Event\ObserverInterface;
use Magento\Framework\Serialize\SerializerInterface;

class CheckoutCartProductAddAfterObserver implements ObserverInterface
{
    /**
     * @var \Magento\Framework\View\LayoutInterface
     */
    protected $_layout;
    /**
     * @var \Magento\Store\Model\StoreManagerInterface
     */
    protected $_storeManager;
    protected $_request;
    /**
     * @param \Magento\Store\Model\StoreManagerInterface $storeManager
     * @param \Magento\Framework\View\LayoutInterface $layout
     */
    private $serializer;

    protected $neotiqBoxprintHelperData;

    public function __construct(
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Magento\Framework\View\LayoutInterface $layout,
        \Magento\Framework\App\RequestInterface $request,
        \Neotiq\Boxprint\Helper\Data $neotiqBoxprintHelperData,
        SerializerInterface $serializer
    )
    {
        $this->_layout = $layout;
        $this->_storeManager = $storeManager;
        $this->_request = $request;
        $this->serializer = $serializer;
        $this->neotiqBoxprintHelperData = $neotiqBoxprintHelperData;
    }
    /**
     * Add order information into GA block to render on checkout success pages
     *
     * @param EventObserver $observer
     * @return void
     */
    public function execute(EventObserver $observer)
    {
        /* @var \Magento\Quote\Model\Quote\Item $item */
       $item = $observer->getQuoteItem();
        //$item = $observer->getEvent()->getData('quote_item');
        $product = $item->getProduct();
        $additionalOptions = array();
        if ($additionalOption = $item->getOptionByCode('additional_options')){
            $additionalOptions = $this->serializer->unserialize($additionalOption->getValue());
        }
        $post = $this->_request->getParam('mddqprint');
        $workspaceId = $this->_request->getParam('mddqprint_workspace');
        if($workspaceId && is_numeric($workspaceId)) {
            $workspace = $this->neotiqBoxprintHelperData->getWorkspaceById($workspaceId);
            if($workspace) {
                $additionalOptions[] = [
                    'label' => __('Design'),
                    'value' => $workspace->getNameProject()
                ];
                $additionalOptions[] = [
                    'label' => __('Réf'),
                    'value' => $product->getSku()
                ];
                $post_price = $this->_request->getParam('mddqprint_price');
                //if(!$this->neotiqBoxprintHelperData->checkWorkspaceIsDefault($workspace->getWorkspaceId())) {
                    /* if ($post_price && $post_price != 0) {
                        if (!$workspace->getWorkspacePrice() || strval($workspace->getWorkspacePrice() == strval('0.0000'))) {
                            $workspace->setData('workspace_price', $post_price);
                        }
                    } */
					if($workspace->getWorkspacePrice()){
                        $item = ( $item->getParentItem() ? $item->getParentItem() : $item );
                        $item->setCustomPrice($workspace->getWorkspacePrice());
                        $item->setOriginalCustomPrice($workspace->getWorkspacePrice());
                        $item->getProduct()->setIsSuperMode(true);
                    }
                    $workspace->setData('product_id', $item->getProductId());
                    $workspace->save();
                //}else{
                //    $workspace->setData('workspace_price', $product->getPrice());
                //    $workspace->save();
                //}
            }
        }
        /**if(is_array($post))
        {
            foreach($post as $key => $value)
            {
                if($key == '' || $value == '')
                {
                    continue;
                }
                $additionalOptions[] = [
                    'label' => $workspace->getLabel(),
                    'value' => $value
                ];
            }
        } */
        if(count($additionalOptions) > 0)
        {
            $item->addOption(array(
                'product_id' => $item->getProductId(),
                'code' => 'additional_options',
                'value' => $this->serializer->serialize($additionalOptions)
            ));
        }

        /* $post_price = $this->_request->getParam('mddqprint_price');
        if($post_price && $post_price!=0) {
            //$item = $observer->getEvent()->getData('quote_item');
            $item = ( $item->getParentItem() ? $item->getParentItem() : $item );
            //$product = $observer->getEvent()->getData('product');
           // $itemProId = $item->getProduct()->getId();
            //$custom_price = $product->getPrice() + 10;
            $item->setCustomPrice($post_price);
            $item->setOriginalCustomPrice($post_price);
            $item->getProduct()->setIsSuperMode(true);
            //return $this;
        } */

        $mddqprint_workspace = $this->_request->getParam('mddqprint_workspace');
        if($mddqprint_workspace && is_numeric($mddqprint_workspace)) {
            $item = ( $item->getParentItem() ? $item->getParentItem() : $item );
            $item->setMdqWorkspaceid($mddqprint_workspace);
        }
        /* To Do */
        // Edit Cart - May need to remove option and readd them
        // Pre-fill remarks on product edit pages
        // Check for comparability with custom option
    }
}
