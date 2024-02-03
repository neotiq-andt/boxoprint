<?php
/**
 * custom ducdevphp@gmail.com
 */


namespace Neotiq\BoxprintAdmin\Plugin\Backend\Model\Menu;

use Magento\Backend\Model\Menu\Item as NativeItem;

class Item
{
    const WORKSPACE_GENERAL= 'Neotiq_BoxprintAdmin::workspace_general';

    protected  $neotiqBoxprintAdminHelper;

    protected $neotiqHelperData;

    public function __construct(
        \Neotiq\BoxprintAdmin\Helper\Data $neotiqBoxprintAdminHelper,
        \Neotiq\Neotiq\Helper\Data $neotiqHelperData
    ) {
        $this->neotiqBoxprintAdminHelper = $neotiqBoxprintAdminHelper;
        $this->neotiqHelperData = $neotiqHelperData;
    }

    /**
     * @param NativeItem $subject
     * @param $url
     *
     * @return string
     */
    public function afterGetUrl(NativeItem $subject, $url)
    {
        $id = $subject->getId();

        if ($id === self::WORKSPACE_GENERAL) {
            $url = $this->neotiqHelperData->getConfig('neotiq_boxprint_config/general/api_render_workspace');
        }

        return $url;
    }
}
