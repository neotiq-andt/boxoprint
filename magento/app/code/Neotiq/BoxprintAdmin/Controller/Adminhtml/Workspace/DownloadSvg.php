<?php
namespace Neotiq\BoxprintAdmin\Controller\Adminhtml\Workspace;
use Magento\Framework\App\Filesystem\DirectoryList;
class DownloadSvg extends \Magento\Backend\App\Action
{
    protected $filesystem;

    protected $directoryList;

    protected $fileFactory;

    protected $datetime;

    public function __construct(
        \Magento\Framework\Controller\Result\RawFactory $resultRawFactory,
        \Magento\Framework\App\Response\Http\FileFactory $fileFactory,
        \Magento\Framework\App\Filesystem\DirectoryList $directoryList,
        \Magento\Framework\Filesystem $filesystem,
        \Magento\Framework\Stdlib\DateTime\DateTime $datetime,
        \Magento\Backend\App\Action\Context $context
    ) {
        $this->resultRawFactory      = $resultRawFactory;
        $this->fileFactory           = $fileFactory;
        $this->datetime = $datetime;
        parent::__construct($context);
    }
    public function execute()
    {
        $params = $this->getRequest()->getParams();
        if (!$this->getRequest()->isAjax() || empty($params)) {
            $this->_redirect('/');
        } else{
            $data = [];
            $data['productId'] = $params['productId'];
            $res = [];
            $neotiqBoxprintHelperData = $this->_objectManager->create('Neotiq\Boxprint\Helper\Data');
            $workspace = $neotiqBoxprintHelperData->getWorkspaceById($params['workspaceId']);
            if($workspace){
                $now = $this->datetime->timestamp();
                $fileName = $workspace->getLabel().'.svg';
                $fileDirectorySvg = $this->directoryList->getPath(\Magento\Framework\App\Filesystem\DirectoryList::VAR_DIR).'/boxoprint/svg';
                $content['type'] = 'filename';
                $content['value'] = $fileDirectorySvg;
                $content['rm'] = '1';
                $resultRaw = $this->resultRawFactory->create();
                $resultRaw->setContents(contents of file here);
                return $this->fileFactory->create($fileName, $content, DirectoryList::VAR_DIR);
//                $this->getResponse()->representJson(
//                    $this->_objectManager->get('Magento\Framework\Json\Helper\Data')->jsonEncode($resultRaw)
//                );
            }
        }
    }
}