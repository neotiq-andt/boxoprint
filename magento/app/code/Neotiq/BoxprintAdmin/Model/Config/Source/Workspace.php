<?php
namespace Neotiq\BoxprintAdmin\Model\Config\Source;

class Workspace implements \Magento\Framework\Data\OptionSourceInterface
{

    protected $workspaceCollection;

    public function __construct(
        \Neotiq\BoxprintAdmin\Model\ResourceModel\Workspace\CollectionFactory $workspaceCollection
    ) {
        $this->workspaceCollection = $workspaceCollection;
    }

    public function toOptionArray()
    {
        $workspaces = [['value' => "0", 'label' => __('None')]];
        $workspaceCollection = $this->workspaceCollection->create();

        foreach ($workspaceCollection as $workspace) {
            array_push($workspaces, ['value' => $workspace->getWorkspaceId(), 'label' => $workspace->getLabel()]);
        }

        return $workspaces;
    }
}
