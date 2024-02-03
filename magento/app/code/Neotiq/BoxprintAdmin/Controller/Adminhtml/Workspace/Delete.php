<?php
namespace Neotiq\BoxprintAdmin\Controller\Adminhtml\Workspace;

class Delete extends \Magento\Backend\App\Action
{

    const ADMIN_RESOURCE = 'Neotiq_BoxprintAdmin::boxprint';


    protected $workspaceFactory = null;

    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Neotiq\BoxprintAdmin\Model\WorkspaceFactory $workspaceFactory
    ) {
        $this->workspaceFactory = $workspaceFactory;
        parent::__construct($context);
    }

    public function execute()
    {
        $resultRedirect = $this->resultRedirectFactory->create();
        $id = $this->getRequest()->getParam('workspace_id');
        if ($id) {
            try {
                $model = $this->workspaceFactory->create();
                $model->load($id);
                $model->delete();
                $this->messageManager->addSuccess(__('Workspace was deleted.'));

                return $resultRedirect->setPath('*/*/');
            } catch (\Exception $e) {
                $this->messageManager->addError($e->getMessage());

                return $resultRedirect->setPath('*/*/edit', ['workspace_id' => $id]);
            }
        }
        $this->messageManager->addError(__('Can\'t find a workspace to delete.'));

        return $resultRedirect->setPath('*/*/');
    }
}
