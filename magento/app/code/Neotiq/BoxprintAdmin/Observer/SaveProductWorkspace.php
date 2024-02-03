<?php
/**
 * custom ducdevphp@gmail.com
 */
namespace Neotiq\BoxprintAdmin\Observer;

use Magento\Framework\Event\ObserverInterface;

class SaveProductWorkspace implements ObserverInterface
{
    protected $catalogData;

    protected $_resource;

    protected $_coreRegistry = null;

    protected $workspaceFactory;

    public function __construct(
        \Magento\Framework\App\ResourceConnection $resource,
        \Magento\Framework\Registry $coreRegistry,
        \Neotiq\BoxprintAdmin\Model\WorkspaceFactory $workspaceFactory
    )
    {
        $this->_resource = $resource;
        $this->_coreRegistry = $coreRegistry;
        $this->workspaceFactory = $workspaceFactory;
    }

    public function execute(\Magento\Framework\Event\Observer $observer)
    {
        $productController = $observer->getController();
        $productId = $productController->getRequest()->getParam('id');
        $data = $productController->getRequest()->getPostValue();
        $this->_coreRegistry->register('current_post_product', $data);
        //$is_saved_workspace = $this->_coreRegistry->registry('boxprint_workspace_save_action');
		$is_saved_workspace = false;
        if(!$is_saved_workspace) {
            if(isset($data['product']['mdq_workspace']) && $productId){
                $workspaceModel = $this->workspaceFactory->create()->load($data['product']['mdq_workspace']);
                if($workspaceModel->getWorkspaceId()){
                    $workspaceModel->setData('product_id',$productId);
					if(isset($data['product']['price'])){
                        $workspaceModel->setData('workspace_price',$data['product']['price']);
                    }
                    $workspaceModel->save();
                }
                //$this->_coreRegistry->register('boxprint_workspace_save_action', true);
            }
        }
    }
}
