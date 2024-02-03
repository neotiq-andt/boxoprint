<?php
namespace Neotiq\BoxprintAdmin\Controller\Adminhtml\Template;

class Save extends \Magento\Backend\App\Action
{

    const ADMIN_RESOURCE = 'Neotiq_BoxprintAdmin::boxprint';

    protected $dataPersistor;

    protected $templateFactory;

    protected $dateFilter;

    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\Framework\App\Request\DataPersistorInterface $dataPersistor,
        \Neotiq\BoxprintAdmin\Model\TemplateFactory $templateFactory,
        \Magento\Framework\Stdlib\DateTime\Filter\Date $dateFilter
    ) {
        $this->dataPersistor = $dataPersistor;
        $this->templateFactory = $templateFactory;
        $this->dateFilter = $dateFilter;
        parent::__construct($context);
    }

    public function execute()
    {
        $data = $this->getRequest()->getPostValue();
        $this->dataPersistor->set('boxoprint_template_data', $data);
        $resultRedirect = $this->resultRedirectFactory->create();
        if ($data) {
            $model = $this->templateFactory->create();
            if (empty($data['template_id'])) {
                $data['template_id'] = null;
            }

            $id = $this->getRequest()->getParam('template_id');
            if ($id) {
                $model->load($id);
            }

            $model->setData($data);

            $this->_eventManager->dispatch(
                'mdq_boxprint_template_prepare_save',
                ['boxprint_template' => $model, 'request' => $this->getRequest()]
            );

            try {
                $model->save();
                $this->messageManager->addSuccess(__('Template has been saved.'));
                $this->dataPersistor->clear('boxoprint_template_data');
                if ($this->getRequest()->getParam('back')) {
                    return $resultRedirect->setPath(
                        '*/*/edit',
                        ['template_id' => $model->getId(), '_current' => true]
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
                    $e, __('Something went wrong while saving the template.')
                );
            }

            return $resultRedirect->setPath(
                '*/*/edit',
                ['template_id' => $this->getRequest()->getParam('template_id')]
            );
        }

        return $resultRedirect->setPath('*/*/');
    }

    public function _isAllowed()
    {
        return $this->_authorization->isAllowed('Neotiq_BoxprintAdmin::boxprint');
    }
}
