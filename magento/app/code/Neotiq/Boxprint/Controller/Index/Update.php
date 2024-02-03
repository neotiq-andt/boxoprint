<?php
/**
 * ducdq@gmail.com
 */
namespace Neotiq\Boxprint\Controller\Index;

use Magento\Framework\App\Action\Action;
use Magento\Framework\App\Action\Context;
use Magento\Framework\App\ResponseInterface;
use Magento\Framework\View\Result\PageFactory;

class Update extends Action
{
    protected $_resultPageFactory;

    public function __construct(Context $context, PageFactory $resultPageFactory)
    {
        parent::__construct($context);
        $this->_resultPageFactory = $resultPageFactory;
    }


    public function execute()
    {
        $this->_view->loadLayout();
        $params = $this->getRequest()->getParams();
        $res = [];
        $error = false;
        //if (!$this->getRequest()->isAjax() || empty($params)) {
         //   $error= true;
       // }else {
            $data = ['product'=>'111'];
            $error = false;
            $res['html'] = $this->_view->getLayout()->createBlock('Magento\Catalog\Block\Product\View')->setTemplate('Neotiq_Boxprint::catalog/product/box_update.phtml')->setData($data)->toHtml();
       // }
        $res['error'] = $error;
        $this->getResponse()->representJson(
            $this->_objectManager->get('Magento\Framework\Json\Helper\Data')->jsonEncode($res)
        );

    }
}
