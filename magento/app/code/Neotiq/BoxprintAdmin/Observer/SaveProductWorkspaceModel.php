<?php
/**
 *  custom ducdevphp@gmail.com
 */
namespace Neotiq\BoxprintAdmin\Observer;

use Magento\Framework\Event\ObserverInterface;

class SaveProductWorkspaceModel implements ObserverInterface
{

    protected $catalogData;

    protected $_resource;

    protected $_request;

    protected $_coreRegistry = null;

    protected $workspaceFactory;

    public function __construct(
        \Magento\Framework\App\ResourceConnection $resource,
        \Magento\Framework\Registry $coreRegistry,
        \Magento\Framework\App\RequestInterface $request,
        \Neotiq\BoxprintAdmin\Model\WorkspaceFactory $workspaceFactory
    )
    {
        $this->_resource = $resource;
        $this->_coreRegistry = $coreRegistry;
        $this->_request = $request;
        $this->workspaceFactory = $workspaceFactory;
    }

    public function execute(\Magento\Framework\Event\Observer $observer)
    {
        $_product = $observer->getProduct();
        $productId = $_product->getId();
        $is_saved_workspace = $this->_coreRegistry->registry('boxprint_workspace_save_action');
        if(!$is_saved_workspace) {
            $data = $this->_request->getPost();
            if($data && isset($data['product']['mdq_workspace']) && $productId){
                $workspaceModel = $this->workspaceFactory->create()->load($data['product']['mdq_workspace']);
                if($workspaceModel->getWorkspaceId()){
                    $workspaceModel->setData('product_id',$productId);
                    $workspaceModel->save();
                }
            }
            $this->_coreRegistry->register('boxprint_workspace_save_action', true);
        }
    }
}
