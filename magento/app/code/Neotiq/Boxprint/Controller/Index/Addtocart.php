<?php
/**
 *  ducdevphp@gmail.com
 */
namespace Neotiq\Boxprint\Controller\Index;

use Magento\Framework\Controller\ResultFactory;
use Magento\Framework\App\Action\Action;
use Magento\Framework\App\Action\Context;

class Addtocart extends \Magento\Framework\App\Action\Action
{

    protected $formKey;
    protected $cart;
    protected $product;
    protected $json;
    public function __construct(
        \Magento\Framework\App\Action\Context $context,
        \Magento\Framework\Data\Form\FormKey $formKey,
        \Magento\Checkout\Model\Cart $cart,
        \Magento\Catalog\Model\ProductFactory $product,
        \Magento\Framework\Serialize\Serializer\Json $json,
        array $data = []
    ) {
        $this->formKey = $formKey;
        $this->cart = $cart;
        $this->product = $product;
        $this->json = $json;
        parent::__construct($context);
    }

    public function execute() {

        $result = [];
        if($mddqboxproduct = $this->getRequest()->getPost('mddqboxproduct')) {
            $jsonDecode = $this->json->unserialize($mddqboxproduct);
        };

        try {
            if($jsonDecode) {
                foreach ($jsonDecode as $md) {
                    $params = array(
                        'form_key' => $this->formKey->getFormKey(),
                        'product_id' => $md['mddqboxid'],
                        'qty' => $md['mddqboxqty']
                    );
                    $_product = $this->product->create()->load($md['mddqboxid']);
                    $this->cart->addProduct($_product, $params);
                }
                $this->cart->save();
                $status = 1;
            }
        } catch (\Magento\Framework\Exception\LocalizedException $e) {
            $this->messageManager->addException($e,__('%1', $e->getMessage()));
            $status = 0;
        } catch (\Exception $e) {
            $this->messageManager->addException($e, __('error.'));
            $status = 0;
        }

        $result['redirectUrl'] = $this->_url->getUrl('checkout/cart');
        $result['status'] = $status;
        $resultJson = $this->resultFactory->create(ResultFactory::TYPE_JSON);
        $resultJson->setData($result);
        return $resultJson;
    }
}
