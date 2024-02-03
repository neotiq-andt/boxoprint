<?php
namespace Neotiq\BoxprintAdmin\Model\Config\Source;

class Status implements \Magento\Framework\Option\ArrayInterface
{
    const STATUS_ENABLED = 1;
    const STATUS_DISABLED = 2;
    const YES=1;
    const NO=0;
    public static function getAvailableStatuses() {
        return [
            self::STATUS_ENABLED => __('Enabled')
            ,self::STATUS_DISABLED => __('Disabled'),
        ];
    }
    public function toOptionArray()
    {
        return [
            ['value'=>self::YES,'label'=>__('Enabled')],
            ['value'=>self::NO,'label'=>__('Disabled')],
        ];
    }
}
