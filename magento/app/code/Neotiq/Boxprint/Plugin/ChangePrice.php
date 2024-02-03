<?php
/**
 * custom ducdevphp@gmail.com
 */
namespace Neotiq\Boxprint\Plugin;

class ChangePrice
{
    protected $request;

    protected $neotiqBoxprintHelperData;

    protected $productRepository;

    public function __construct(
        \Magento\Framework\App\Request\Http $request,
        \Neotiq\Boxprint\Helper\Data $neotiqBoxprintHelperData,
        \Magento\Catalog\Api\ProductRepositoryInterface $productRepository

    ) {
        $this->request = $request;
        $this->neotiqBoxprintHelperData = $neotiqBoxprintHelperData;
        $this->productRepository = $productRepository;
    }

    public function afterToHtml($subject, $result)
    {
        $page=$this->request->getFullActionName();
        $workspace_id = $this->request->getParam('boxo');
        if ($page=="catalog_product_view" && $workspace_id) {
            $objectManager = \Magento\Framework\App\ObjectManager::getInstance();
            $customerSession = $objectManager->create('Magento\Customer\Model\Session');
            if($customerSession->isLoggedIn()) {
                $workspace = $this->neotiqBoxprintHelperData->getWorkspaceById($workspace_id);
                if ($customerSession->getCustomer()->getEmail() == $workspace->getCustomerEmail()) {
                    if ($workspace->getWorkspacePrice()) {
                        $product = $subject->getSaleableItem();
                        $sku = $product->getSku();
                        $product = $this->productRepository->get($sku);
                        $price = $this->neotiqBoxprintHelperData->createModel('Magento\Framework\Pricing\Helper\Data')->currency($workspace->getWorkspacePrice(), true, false);
                        $button = '<div class="mdq-box-final-price mdq-box-final-'.$product->getId().'"><div class="price-box"><span class="price-container "><span class="price">'. $price .'</span></span></div></div>
                            <script type="text/x-magento-init">
                                {
                                    ".mdq-box-final-'.$product->getId().'": {
                                        "Neotiq_Boxprint/js/mdq-price": {
                              
                                        }
                                    }
                                }
                            </script>';
                        return $result.$button;
                    }
                }
            }
        }
        return $result;
    }
}
