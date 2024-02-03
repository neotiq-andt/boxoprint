<?php
namespace Neotiq\BoxprintAdmin\Controller\Adminhtml\Workspace;

class Edit extends \Magento\Backend\App\Action
{
    const ADMIN_RESOURCE = 'Neotiq_BoxprintAdmin::boxprint';

    protected $coreRegistry;

    protected $resultPageFactory;

    protected $workspaceFactory;

    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\Framework\View\Result\PageFactory $resultPageFactory,
        \Magento\Framework\Registry $coreRegistry,
        \Neotiq\BoxprintAdmin\Model\WorkspaceFactory $workspaceFactory
    ) {
        $this->resultPageFactory = $resultPageFactory;
        $this->coreRegistry = $coreRegistry;
        $this->workspaceFactory = $workspaceFactory;
        parent::__construct($context);
    }

    public function _isAllowed()
    {
        return $this->_authorization->isAllowed('Neotiq_BoxprintAdmin::boxprint');
    }


    protected function _initAction()
    {
        $resultPage = $this->resultPageFactory->create();
        $resultPage->setActiveMenu('Neotiq_BoxprintAdmin::workspace')
            ->addBreadcrumb(__('Workspaces'), __('Workspaces'))
            ->addBreadcrumb(__('Manage Workspaces'), __('Manage Workspaces'));

        return $resultPage;
    }


    public function execute()
    {
        $id = $this->getRequest()->getParam('workspace_id');
        $model = $this->workspaceFactory->create();

        if ($id) {
            $model->load($id);
            if (!$model->getId()) {
                $this->messageManager->addError(__('This workspace no longer exists.'));
                $resultRedirect = $this->resultRedirectFactory->create();

                return $resultRedirect->setPath('*/*/');
            }
        }

        $data = $this->_getSession()->getFormData(true);
        if (!empty($data)) {
            $model->setData($data);
        }

        $this->coreRegistry->register('boxoprint_workspace_data', $model);

        $resultPage = $this->_initAction();
        $resultPage->addBreadcrumb(
            $id ? __('Edit Workspace') : __('New Workspace'),
            $id ? __('Edit Workspace') : __('New Workspace')
        );
        $resultPage->getConfig()->getTitle()->prepend(__('Workspaces'));
        $resultPage->getConfig()->getTitle()
            ->prepend($model->getId() ? $model->getName() : __('New Workspace'));

        return $resultPage;
    }
}
