<?php
namespace Neotiq\BoxprintAdmin\Setup;

use Magento\Eav\Setup\EavSetupFactory;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\ModuleDataSetupInterface;
use Magento\Framework\Setup\UpgradeDataInterface;
use Magento\Catalog\Model\ResourceModel\Eav\Attribute;

class UpgradeData implements UpgradeDataInterface
{


    private $_eavSetupFactory;


    public function __construct(EavSetupFactory $eavSetupFactory)
    {
        $this->_eavSetupFactory = $eavSetupFactory;
    }

    public function upgrade(
        ModuleDataSetupInterface $setup,
        ModuleContextInterface $context
    ) {
        $eavSetup = $this->_eavSetupFactory->create(['setup' => $setup]);

        if (version_compare($context->getVersion(), '2.4.4') < 0) {
            $eavSetup->addAttribute(
                \Magento\Catalog\Model\Product::ENTITY,
                'mdq_workspace',
                [
                    'type' => 'int',
                    'label' => 'Workspace',
                    'input' => 'select',
                    'source' => \Neotiq\BoxprintAdmin\Model\Attribute\Source\Workspace::class,
                    'required' => false,
                    'sort_order' => 991,
                    'global' => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_STORE,
                    'is_used_in_grid' => false,
                    'is_visible_in_grid' => false,
                    'is_filterable_in_grid' => false,
                    'visible' => true,
                    'is_html_allowed_on_front' => true,
                    'visible_on_front' => false,
                    'used_in_product_listing' => true,
                    'user_defined' => true,
                    'group' => 'General'
                ]
            );
        }
    }
}
