<?php
namespace Neotiq\BoxprintAdmin\Controller\Adminhtml\Workspace;

class Save extends \Magento\Backend\App\Action
{

    const ADMIN_RESOURCE = 'Neotiq_BoxprintAdmin::boxprint';

    protected $dataPersistor;

    protected $workspaceFactory;

    protected $dateFilter;

    private $_date;

    public $imageUploader;

    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\Framework\App\Request\DataPersistorInterface $dataPersistor,
        \Neotiq\BoxprintAdmin\Model\WorkspaceFactory $workspaceFactory,
        \Magento\Framework\Stdlib\DateTime\Filter\Date $dateFilter,
        \Magento\Framework\Stdlib\DateTime\DateTime $date,
        \Neotiq\BoxprintAdmin\Model\ImageUploader $imageUploader
    ) {
        $this->dataPersistor = $dataPersistor;
        $this->workspaceFactory = $workspaceFactory;
        $this->dateFilter = $dateFilter;
        $this->_date = $date;
        $this->imageUploader = $imageUploader;
        parent::__construct($context);
    }

    public function execute()
    {
        $data = $this->getRequest()->getPostValue();
        $this->dataPersistor->set('boxoprint_workspace_data', $data);
        $resultRedirect = $this->resultRedirectFactory->create();
        if ($data) {
            $model = $this->workspaceFactory->create();
            if (empty($data['workspace_id'])) {
                $data['workspace_id'] = null;
            }

            $id = $this->getRequest()->getParam('workspace_id');
            if ($id) {
                $model->load($id);
            }else {
                $data['date'] = $this->_date->gmtDate();
                $data['type_defined'] = \Neotiq\BoxprintAdmin\Model\Config\Source\Defined::ADMIN;
            }

            $data = $this->_filterWorkspaceData($data);

            $model->setData($data);

            $this->_eventManager->dispatch(
                'mdq_boxprint_workspace_prepare_save',
                ['boxprint_workspace' => $model, 'request' => $this->getRequest()]
            );

            try {
                $model->save();
                $this->messageManager->addSuccess(__('Workspace has been saved.'));
                $this->dataPersistor->clear('boxoprint_workspace_data');
                if ($this->getRequest()->getParam('back')) {
                    return $resultRedirect->setPath(
                        '*/*/edit',
                        ['workspace_id' => $model->getId(), '_current' => true]
                    );
                }

                return $resultRedirect->setPath('*/*/');
            } catch (\Magento\Framework\Exception\LocalizedException $e) {
                $this->messageManager->addError($e->getMessage());
            } catch (\RuntimeException $e) {
                $this->messageManager->addError($e->getMessage());
            } catch (\Exception $e) {
                $this->messageManager->addError($e->getMessage());
                $this->messageManager->addException(
                    $e, __('Something went wrong while saving the workspace.')
                );
            }

            return $resultRedirect->setPath(
                '*/*/edit',
                ['workspace_id' => $this->getRequest()->getParam('workspace_id')]
            );
        }

        return $resultRedirect->setPath('*/*/');
    }

    public function _filterWorkspaceData(array $rawData)
    {
        $data = $rawData;
        if (isset($data['image'][0]['name']) && isset($data['image'][0]['tmp_name'])) {
            $data['image'] = $data['image'][0]['name'];
            $this->imageUploader->moveFileFromTmp($data['image']);
        } elseif (isset($data['image'][0]['name']) && !isset($data['logo'][0]['tmp_name'])) {
            $data['image'] = $data['image'][0]['name'];
        } else {
            $data['image'] = '';
        }
        return $data;
    }

    public function _isAllowed()
    {
        return $this->_authorization->isAllowed('Neotiq_BoxprintAdmin::boxprint');
    }
}
