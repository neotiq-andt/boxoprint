<?php

/**
 * custom ducdevphp@gmail.com
 */

namespace Neotiq\BoxprintAdmin\Controller\Adminhtml\Workspace;

use Magento\Framework\Controller\ResultFactory;

class Svg extends \Magento\Backend\App\Action
{

    const ADMIN_RESOURCE = 'Neotiq_BoxprintAdmin::boxprint';

    protected $dataPersistor;

    protected $workspaceFactory;


    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\Framework\App\Request\DataPersistorInterface $dataPersistor,
        \Neotiq\BoxprintAdmin\Model\WorkspaceFactory $workspaceFactory
    ) {
        $this->dataPersistor = $dataPersistor;
        $this->workspaceFactory = $workspaceFactory;
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
            $res['mdq_boxprint_svg'] = $this->_view->getLayout()->createBlock('Magento\Framework\View\Element\Template')->setTemplate('Neotiq_BoxprintAdmin::mdq_workspace_svg.phtml')->setWorkspaceId($params['workspaceId'])->setProductId($params['productId'])->toHtml();
            $this->getResponse()->representJson(
                $this->_objectManager->get('Magento\Framework\Json\Helper\Data')->jsonEncode($res)
            );
        }
    }


    public function _isAllowed()
    {
        return $this->_authorization->isAllowed('Neotiq_BoxprintAdmin::boxprint');
    }
}
