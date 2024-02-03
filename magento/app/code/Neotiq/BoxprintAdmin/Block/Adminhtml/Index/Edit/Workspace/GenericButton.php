<?php
namespace Neotiq\BoxprintAdmin\Block\Adminhtml\Index\Edit\Workspace;

use Magento\Backend\Block\Widget\Context;

class GenericButton
{

    protected $context;

    public function __construct(
        Context $context
    ) {
        $this->context = $context;
    }

    public function getWorkspaceId()
    {
        return $this->context->getRequest()->getParam('workspace_id');
    }

    public function getUrl($route = '', $params = [])
    {
        return $this->context->getUrlBuilder()->getUrl($route, $params);
    }
}
