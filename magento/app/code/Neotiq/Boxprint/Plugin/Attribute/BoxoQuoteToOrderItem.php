<?php
/**
 * custom ducdevphp@gmail.com
 */
namespace  Neotiq\Boxprint\Plugin\Attribute;

use Magento\Framework\Serialize\SerializerInterface;


class BoxoQuoteToOrderItem
{


    public function aroundConvert(\Magento\Quote\Model\Quote\Item\ToOrderItem $subject, callable $proceed, $quoteItem, $data)
    {

        // get order item
        $orderItem = $proceed($quoteItem, $data);

        // get your custom attribute from quote_item .
        $quoteItemMdqWorkspaceId = $quoteItem->getMdqWorkspaceid();

        //set custom attribute to sales_order_item
        $orderItem->setMdqWorkspaceid($quoteItemMdqWorkspaceId);

        return $orderItem;
    }
}
