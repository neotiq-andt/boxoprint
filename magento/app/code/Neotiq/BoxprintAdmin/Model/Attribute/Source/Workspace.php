<?php
namespace Neotiq\BoxprintAdmin\Model\Attribute\Source;

class Workspace extends \Magento\Eav\Model\Entity\Attribute\Source\AbstractSource
{
    protected $workspaceCollection;

    public function __construct(
        \Neotiq\BoxprintAdmin\Model\ResourceModel\Workspace\CollectionFactory $workspaceCollection
    ) {
        $this->workspaceCollection = $workspaceCollection;
    }

    public function getAllOptions()
    {
        $workspaces = [['value' => '', 'label' => __('-- Please Select --')]];
        $workspaceCollection = $this->workspaceCollection->create();
        $workspaceCollection->addFieldToFilter('type_defined', ['eq' => \Neotiq\BoxprintAdmin\Model\Config\Source\Defined::ADMIN]);

        foreach ($workspaceCollection as $workspace) {
            array_push($workspaces, ['value' => $workspace->getWorkspaceId(), 'label' => $workspace->getData('name_project')]);
        }

        return $workspaces;

    }
}
