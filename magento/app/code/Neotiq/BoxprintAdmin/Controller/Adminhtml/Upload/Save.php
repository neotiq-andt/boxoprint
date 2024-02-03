<?php
namespace Neotiq\BoxprintAdmin\Controller\Adminhtml\Upload;
use Magento\Framework\App\Action\Context;
use Magento\Framework\Message\ManagerInterface;
use Magento\Framework\Filesystem;
use Magento\MediaStorage\Model\File\UploaderFactory;

class Save extends \Magento\Backend\App\Action
{

    protected $_coreRegistry = null;

    protected $resultPageFactory;

    protected $messageManager;

    protected $filesystem;

    protected $fileUploader;

    protected $_storeManager;

    protected $templateFactory;
	
	protected  $neotiqBoxprintAdminHelper;
	
	protected $neotiqHelperData;

    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\Framework\View\Result\PageFactory $resultPageFactory,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        Filesystem $filesystem,
        UploaderFactory $fileUploader,
        ManagerInterface $messageManager,
        \Neotiq\BoxprintAdmin\Model\TemplateFactory $templateFactory,
		\Neotiq\BoxprintAdmin\Helper\Data $neotiqBoxprintAdminHelper,
		\Neotiq\Neotiq\Helper\Data $neotiqHelperData
    ) {
        parent::__construct($context);
        $this->resultPageFactory = $resultPageFactory;
        $this->_storeManager = $storeManager;
        $this->messageManager = $messageManager;
        $this->filesystem = $filesystem;
        $this->fileUploader = $fileUploader;
        $this->templateFactory = $templateFactory;
		$this->neotiqBoxprintAdminHelper = $neotiqBoxprintAdminHelper;
		$this->neotiqHelperData = $neotiqHelperData;
    }

    public function execute()
    {
        $resultRedirect = $this->resultRedirectFactory->create();
        $data = $this->getRequest()->getPostValue();

        if ($data) {
            $jsonFile = $this->getRequest()->getFiles('jsonfile');
            $fileName = ($jsonFile && array_key_exists('name', $jsonFile)) ? $jsonFile['name'] : null;
			
			$jsFile = $this->getRequest()->getFiles('jsfile');
            $fileJsName = ($jsFile && array_key_exists('name', $jsFile)) ? $jsFile['name'] : null;
			
			$path = $this->filesystem->getDirectoryRead(\Magento\Framework\App\Filesystem\DirectoryList::VAR_DIR)->getAbsolutePath(\Neotiq\BoxprintAdmin\Model\Template::UPLOAD_FILE_JS);
            
			if ($jsonFile && $fileName && $jsFile && $fileJsName) {
				 try {

                    $uploader = $this->fileUploader->create(['fileId' => 'jsonfile']);

                    $uploader->setAllowedExtensions(['json']);
                    $uploader->setAllowCreateFolders(true);
                    $uploader->setAllowRenameFiles(false);
                    //$uploader->setFilesDispersion(true);
                    //$mediaDirectory = $this->filesystem->getDirectoryRead('var/www/html/boxo-frontend/src/app/templates');
              
                    $result = $uploader->save($path);
                    if ($result['file']) {
                        $this->messageManager->addSuccess(__('File %1 has been successfully uploaded.',$result['file']));
                    }
                } catch (\Exception $e) {
                    if ($e->getCode() == 0) {
                        $this->messageManager->addError($e->getMessage());
                    }
                }
				
				try {

                    $uploader = $this->fileUploader->create(['fileId' => 'jsfile']);

                    $uploader->setAllowedExtensions(['js']);
                    $uploader->setAllowCreateFolders(true);
                    $uploader->setAllowRenameFiles(false);
                  
                    $result = $uploader->save($path);
                    if ($result['file']) {
                        $this->messageManager->addSuccess(__('File %1 has been successfully uploaded.',$result['file']));
                    }
                } catch (\Exception $e) {
                    if ($e->getCode() == 0) {
                        $this->messageManager->addError($e->getMessage());
                    }
                }
				
				$fileJsonUpload = $path. '/' . $fileName;
				$destJson = $this->neotiqHelperData->getConfig('neotiq_boxprint_config/general/path_save').$fileName;
				$fileJsUpload = $path. '/' . $fileJsName;
				$destJs = $this->neotiqHelperData->getConfig('neotiq_boxprint_config/general/path_save').$fileJsName;
				if(file_exists($fileJsonUpload) && file_exists($fileJsUpload)){
				    if(!$this->neotiqHelperData->getConfig('neotiq_boxprint_config/general/use_sftp')){
                        shell_exec("cp -r $fileJsonUpload $destJson");
                        shell_exec("cp -r $fileJsUpload $destJs");
                    }else{
				        $this->neotiqBoxprintAdminHelper->saveFile($fileName,$fileJsonUpload);
                        $this->neotiqBoxprintAdminHelper->saveFile($fileJsName,$fileJsUpload);
                    }

					/* $strJson = file_get_contents($fileJsonUpload);
					$json = json_decode($strJson, true);
					$templateModel = $this->templateFactory->create();
					if(isset($json['name'])){
						$datajson =[];
						$datajson['name'] = $json['name'];
						$datajson['path'] =  $this->neotiqHelperData->getConfig('neotiq_boxprint_config/general/path_save').$fileName;
						$datajson['m_path'] = $fileJsonUpload;
						$datajson['status'] = 1;
						$datajson['length'] = $data['length'];
						$datajson['width'] = $data['width'];
						$datajson['height'] = $data['height'];
						$datajson['name_project'] = $data['name_project'];
						$collectionT = $templateModel->getCollection()->addFieldToFilter('name',$json['name']);
						if(!$collectionT->getSize() > 0){
							$templateModel->setData($datajson);
							$templateModel->save();
						}
					} */
				}
			}
        }
        return $resultRedirect->setPath('*/*/');
    }

    public function _isAllowed()
    {
        return $this->_authorization->isAllowed('Neotiq_BoxprintAdmin::upload');
    }
}
