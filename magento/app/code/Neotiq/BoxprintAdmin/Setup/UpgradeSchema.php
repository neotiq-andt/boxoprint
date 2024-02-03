<?php
/**
 * ducdevphp@gmail.com.
 */
namespace Neotiq\BoxprintAdmin\Setup;

use Magento\Framework\Setup\UpgradeSchemaInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\SchemaSetupInterface;

class UpgradeSchema implements UpgradeSchemaInterface
{
    public function upgrade(SchemaSetupInterface $setup, ModuleContextInterface $context)
    {
        $setup->startSetup();

        if (version_compare($context->getVersion(), '2.4.2') < 0) {
            $setup->getConnection()->addColumn(
                $setup->getTable('boxoprint_workspace'),
                'increment_id',
                [
                    'type'     => \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
                    'length'   => '255',
                    'nullable' => true,
                    'comment'  => 'Increment Id'
                ]
            );
        }

        if (version_compare($context->getVersion(), '2.4.3') < 0) {
            $setup->getConnection()->addColumn(
                $setup->getTable('boxoprint_workspace'),
                'date',
                [
                    'type'     => \Magento\Framework\DB\Ddl\Table::TYPE_DATETIME,
                    'length'   => '255',
                    'nullable' => false,
                    'comment'  => 'Date Create'
                ]
            );
        }

        if (version_compare($context->getVersion(), '2.4.5') < 0) {
            $setup->getConnection()->addColumn(
                $setup->getTable('boxoprint_workspace'),
                'image',
                [
                    'type'     => \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
                    'length'   => '255',
                    'nullable' => true,
                    'comment'  => 'Image'
                ]
            );
        }

        if (version_compare($context->getVersion(), '2.4.6') < 0) {
            $setup->getConnection()->addColumn(
                $setup->getTable('boxoprint_workspace'),
                'customer_email',
                [
                    'type'     => \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
                    'length'   => '255',
                    'nullable' => true,
                    'comment'  => 'Customer Email'
                ]
            );
        }

		if (version_compare($context->getVersion(), '2.4.7') < 0) {
            $setup->getConnection()->addColumn(
                $setup->getTable('boxoprint_workspace'),
                'name_project',
                [
                    'type'     => \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
                    'length'   => '255',
                    'nullable' => true,
                    'comment'  => 'Name'
                ]
            );
        }

        if (version_compare($context->getVersion(), '2.4.8') < 0) {
            $setup->getConnection()->addColumn(
                $setup->getTable('boxoprint_workspace'),
                'workspace_price',
                [
                    'type'     => \Magento\Framework\DB\Ddl\Table::TYPE_DECIMAL,
                    'length'   => '12,4',
                    'nullable' => true,
                    'comment'  => 'Price',
                    'default' => '0.0000'
                ]
            );
        }

        if (version_compare($context->getVersion(), '2.4.9') < 0) {
            $setup->getConnection()->addColumn(
                $setup->getTable('boxoprint_workspace'),
                'form_key',
                [
                    'type'     => \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
                    'comment'  => 'Form Key',
                    'nullable' => true
                ]
            );
        }

        if (version_compare($context->getVersion(), '2.5.0') < 0) {
            $setup->getConnection()->addColumn(
                $setup->getTable('boxoprint_workspace'),
                'image_base',
                [
                    'type'     => \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
                    'comment'  => 'Image Base',
                    'nullable' => true
                ]
            );
        }
		
		if (version_compare($context->getVersion(), '2.5.1') < 0) {
            $setup->getConnection()->changeColumn(
                $setup->getTable('boxoprint_workspace'),
                'image_base',
                'image_base',
                [
                    'type'     => \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
                    'comment'  => 'Image Base',
                    'nullable' => true,
                    'length'  =>'4g'
                ]
            );
        }
		
		if (version_compare($context->getVersion(), '2.5.2') < 0) {
            $setup->getConnection()->addColumn(
                $setup->getTable('boxoprint_workspace'),
                'template_parent_id',
                [
                    'type'     => \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER,
                    'comment'  => 'Template parent Id',
                    'nullable' => true
                ]
            );
        }
		
		if (version_compare($context->getVersion(), '2.5.3') < 0) {
            $setup->getConnection()->addColumn(
                $setup->getTable('boxoprint_workspace'),
                'workspace_svg',
                [
                    'type'     => \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
                    'comment'  => 'SVG Workspace',
                    'nullable' => true,
                    'length'   => '4g'
                ]
            );
        }
		
		
        if (version_compare($context->getVersion(), '2.5.4') < 0) {
            $setup->getConnection()->addColumn(
                $setup->getTable('boxoprint_workspace'),
                'workspace_type',
                [
                    'type'     => \Magento\Framework\DB\Ddl\Table::TYPE_SMALLINT,
                    'comment'  => 'Workspace type',
                    'nullable' => true,
                    'default' => 0
                ]
            );
        }

        $setup->endSetup();
    }
}
