<?php
/**
 * custom ducdevphp@gmail.com
 */
namespace Neotiq\Boxprint\Controller\Index;

class Info extends \Magento\Framework\App\Action\Action
{
    protected $resultPageFactory;
    protected $storeManager;
    protected $connection;
    protected $resource;
    protected $neotiqBoxprintHelperData;
    public function __construct(
        \Magento\Framework\App\Action\Context $context,
        \Magento\Framework\View\Result\PageFactory $resultPageFactory,
        \Magento\Framework\App\ResourceConnection $resourceConnection,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Neotiq\Boxprint\Helper\Data $neotiqBoxprintHelperData
    )
    {
        $this->resultPageFactory = $resultPageFactory;
        $this->storeManager = $storeManager;
        $this->connection = $resourceConnection->getConnection();
        $this->resource = $resourceConnection;
        $this->neotiqBoxprintHelperData = $neotiqBoxprintHelperData;
        parent::__construct($context);
    }

    public function execute()
    {
        $this->_view->loadLayout();
        $params = $this->getRequest()->getParams();
        if (!$this->getRequest()->isAjax() || empty($params)) {
            $this->_redirect('/');
        } else{
            $data = [];
            $data['productId'] = $params['productId'];
            $res = [];
			$res['mdq_boxprint_name'] = '';
			if($this->neotiqBoxprintHelperData->getWorkspaceById($params['workspaceId'])){
				$res['mdq_boxprint_name'] = $this->neotiqBoxprintHelperData->getWorkspaceById($params['workspaceId'])->getNameProject();
			}
            $res['mdq_boxprint_info'] = $this->_view->getLayout()->createBlock('Magento\Framework\View\Element\Template')->setTemplate('Neotiq_Boxprint::catalog/product/view/info.phtml')->setWorkspaceId($params['workspaceId'])->setProductId($params['productId'])->toHtml();
            $this->getResponse()->representJson(
                $this->_objectManager->get('Magento\Framework\Json\Helper\Data')->jsonEncode($res)
            );
        }
    }
}
