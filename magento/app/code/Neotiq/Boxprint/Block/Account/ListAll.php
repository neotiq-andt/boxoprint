<?php
namespace Neotiq\Boxprint\Block\Account;

use Magento\Framework\View\Element\Template;

class ListAll extends Template
{
    protected $workspaceCollection;

    protected $neotiqBoxprintHelperAccount;

    protected $customerSession;

    protected $imageHelperFactory;

    protected $cart;

    protected $_customerSessionFactory;

    public function __construct(
        Template\Context $context,
        \Neotiq\BoxprintAdmin\Model\ResourceModel\Workspace\CollectionFactory $collection,
        \Neotiq\Boxprint\Helper\Account $neotiqBoxprintHelperAccount,
        \Magento\Customer\Model\Session $customerSession,
        \Magento\Catalog\Helper\ImageFactory $imageHelperFactory,
        \Magento\Checkout\Model\Cart $cart,
        \Magento\Customer\Model\SessionFactory $customerSessionFactory,
        array $data
    )
    {
        parent::__construct($context, $data);
        $this->workspaceCollection = $collection;
        $this->neotiqBoxprintHelperAccount = $neotiqBoxprintHelperAccount;
        $this->customerSession = $customerSession;
        $this->imageHelperFactory = $imageHelperFactory;
        $this->cart = $cart;
        $this->_customerSessionFactory = $customerSessionFactory;
    }

    protected function _prepareLayout() {
        parent::_prepareLayout();
        $this->pageConfig->getTitle()->set(__('Custom Pagination'));
        if ($this->workspaceCollection()) {
            $pager = $this->getLayout()->createBlock(
                    'Magento\Theme\Block\Html\Pager',
                    'account.workspace.pager')
                ->setAvailableLimit([5 => 5, 10 => 10, 15 => 15, 20 => 20])
                ->setShowPerPage(true)->setCollection($this->workspaceCollection());
            $this->setChild('pager', $pager);
            $this->workspaceCollection()->load();
        }
        return $this;
    }

    public function getPagerHtml() {
        return $this->getChildHtml('pager');
    }

    public function workspaceCollection(){
        $page = ($this->getRequest()->getParam('p')) ? $this->getRequest()->getParam('p') : 1;
        $pageSize = ($this->getRequest()->getParam('limit')) ? $this->getRequest()->getParam('limit') : 5;
        $workspaceInCart = $this->getWorkspaceInCart();
        $collection = $this->workspaceCollection->create()
            ->addFieldToFilter('type_defined', 0)
            ->addFieldToFilter('customer_email',$this->getCustomer()->getEmail())
            ->addFieldToFilter('workspace_id', array('nin' => $workspaceInCart))
            ->addFieldToFilter(
                'increment_id',
                [
                    ['eq' => ""],
                    ['null' => true]
                ]
            );
		$collection->setOrder('date','DESC');
        $collection->setPageSize($pageSize);
        $collection->setCurPage($page);
        return $collection;
    }

    public function getCustomer(){
        return   $this->_customerSessionFactory->create()->getCustomer();
    }

    public function getProductImage($product){
       return $this->imageHelperFactory->create()->init($product, 'category_page_grid')->setImageFile($product->getFile())->resize(75,75)->getUrl();
    }

    public function getWorkspaceInCart(){
        $items = $this->cart->getQuote()->getAllVisibleItems();
        $arr = [];
        if (empty($items)) {
            return [0];
        }
        foreach ($items as $item) {
            if($item->getMdqWorkspaceid()){
                $arr[] = $item->getMdqWorkspaceid();
            }
        }
        return $arr;
    }
}