<?php
namespace Neotiq\BoxprintAdmin\Model\Config\Source;

class Defined implements \Magento\Framework\Option\ArrayInterface
{
    const STATUS_USER = 0;
    const STATUS_ADMIN = 1;
    const ADMIN = 1;
    const GUEST = 0;
    public static function getAvailableStatuses() {
        return [
            self::STATUS_ADMIN => __('Admin')
            ,self::STATUS_USER => __('Customer'),
        ];
    }
    public function toOptionArray()
    {
        return [
            ['value'=>self::GUEST,'label'=>__('Customer')],
            ['value'=>self::ADMIN,'label'=>__('Admin')],
        ];
    }
}
