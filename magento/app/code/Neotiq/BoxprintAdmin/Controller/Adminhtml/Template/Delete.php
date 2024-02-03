<?php
namespace Neotiq\BoxprintAdmin\Controller\Adminhtml\Template;

class Delete extends \Magento\Backend\App\Action
{

    const ADMIN_RESOURCE = 'Neotiq_BoxprintAdmin::boxprint';


    protected $templateFactory = null;

    protected $filesystem;
	
	protected $_file;

    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Neotiq\BoxprintAdmin\Model\TemplateFactory $templateFactory,
        \Magento\Framework\Filesystem\Driver\File $file,
        \Magento\Framework\Filesystem $filesystem
    ) {
        $this->templateFactory = $templateFactory;
        $this->_file = $file;
        $this->filesystem = $filesystem;
        parent::__construct($context);
    }

    public function execute()
    {
        $resultRedirect = $this->resultRedirectFactory->create();
        $id = $this->getRequest()->getParam('template_id');
        if ($id) {
            try {
                $model = $this->templateFactory->create();
                $model->load($id);
                $path = $this->filesystem->getDirectoryRead(\Magento\Framework\App\Filesystem\DirectoryList::VAR_DIR)->getAbsolutePath(\Neotiq\BoxprintAdmin\Model\Template::UPLOAD_FILE_JS);
                /* if ($this->_file->isExists($path . $model->getName()))  {
                    $this->_file->deleteFile($path . $model->getName());
                } */
                $model->delete();
                $this->messageManager->addSuccess(__('Template was deleted.'));

                return $resultRedirect->setPath('*/*/');
            } catch (\Exception $e) {
                $this->messageManager->addError($e->getMessage());

                return $resultRedirect->setPath('*/*/edit', ['template_id' => $id]);
            }
        }
        $this->messageManager->addError(__('Can\'t find a template to delete.'));

        return $resultRedirect->setPath('*/*/');
    }
}
