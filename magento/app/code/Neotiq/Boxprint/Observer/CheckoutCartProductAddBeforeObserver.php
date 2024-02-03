<?php

namespace Neotiq\Boxprint\Observer;
use Magento\Framework\Event\Observer as EventObserver;
use Magento\Framework\Event\ObserverInterface;
use Magento\Framework\Serialize\SerializerInterface;

class CheckoutCartProductAddBeforeObserver implements ObserverInterface
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
        $info = $observer->getInfo();
        $product = $observer->getProduct();
        $check = false;
        $workspaceId = $this->_request->getParam('mddqprint_workspace');
        $formKey = $this->_request->getParam('form_key');
        if($formKey && $workspaceId && is_numeric($workspaceId)) {
            $workspace = $this->neotiqBoxprintHelperData->getWorkspaceById($workspaceId);
            if($workspace) {
                if($workspace->getData('form_key') && $workspace->getData('type_defined')==\Neotiq\BoxprintAdmin\Model\Config\Source\Defined::GUEST){
                    if(\Magento\Framework\Encryption\Helper\Security::compareStrings($formKey, $workspace->getData('form_key'))==true){
                        $check = true;
                    }
                }
            }
        }
        if($check){
            return;
        }else{
            throw new \Magento\Framework\Exception\LocalizedException(__("Une erreur s'est produite lors de l'ajout du produit. Veuillez réessayer !"));
        }
    }
}
