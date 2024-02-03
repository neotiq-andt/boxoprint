<?php

/**
 * custom ducdevphp@gmail.com
 */

namespace Neotiq\BoxprintAdmin\Setup;

use Magento\Framework\Setup\InstallSchemaInterface;
use Magento\Framework\Setup\SchemaSetupInterface;
use Magento\Framework\Setup\ModuleContextInterface;

class InstallSchema implements InstallSchemaInterface
{

    /**
     * {@inheritdoc}
     */
    public function install(
        SchemaSetupInterface $setup,
        ModuleContextInterface $context
    ) {
        $installer = $setup;
        $installer->startSetup();

        $table_neotiq_template = $setup->getConnection()->newTable($setup->getTable('boxoprint_template'));

        $table_neotiq_template->addColumn(
            'template_id',
            \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER,
            null,
            [
                'identity' => true,
                'nullable' => false,
                'primary' => true,
                'unsigned' => true,
            ],
            'Template Id'
        );

        $table_neotiq_template->addColumn(
            'status',
            \Magento\Framework\DB\Ddl\Table::TYPE_SMALLINT,
            null,
            ['nullable' => false, 'default' => '0'],
            'Status'
        );

        $table_neotiq_template->addColumn(
            'path',
            \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
            255,
            ['nullable' => false],
            'Path'
        );

        $table_neotiq_template->addColumn(
            'name',
            \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
            255,
            ['nullable' => true],
            'Name'
        );

        $table_neotiq_template->addColumn(
            'storeview',
            \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
            null,
            [],
            'storeview'
        );

        $table_neotiq_workspace = $setup->getConnection()->newTable($setup->getTable('boxoprint_workspace'));

        $table_neotiq_workspace->addColumn(
            'workspace_id',
            \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER,
            null,
            [
                'identity' => true,
                'nullable' => false,
                'primary' => true,
                'unsigned' => true,
            ],
            'Workspace Id'
        );

        $table_neotiq_workspace->addColumn(
            'template_id',
            \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER,
            null,
            ['nullable' => false],
            'Template Id'
        );

        $table_neotiq_workspace->addColumn(
            'owner_id',
            \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER,
            null,
            ['nullable' => false],
            'owner_id'
        );

        $table_neotiq_workspace->addColumn(
            'label',
            \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
            255,
            ['nullable' => false],
            'Label'
        );

        $table_neotiq_workspace->addColumn(
            'status',
            \Magento\Framework\DB\Ddl\Table::TYPE_SMALLINT,
            null,
            ['nullable' => false, 'default' => '0'],
            'Status'
        );

        $table_neotiq_workspace->addColumn(
            'base',
            \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
            null,
            ['nullable' => false],
            'Base'
        );


        $table_neotiq_workspace->addColumn(
            'config',
            \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
            '4g',
            ['nullable' => true],
            'Config'
        );

        $table_neotiq_workspace->addColumn(
            'type_defined',
            \Magento\Framework\DB\Ddl\Table::TYPE_SMALLINT,
            null,
            ['nullable' => false, 'default' => '0'],
            'Type Defined'
        );

        $table_neotiq_workspace->addColumn(
            'product_id',
            \Magento\Framework\DB\Ddl\Table::TYPE_SMALLINT,
            null,
            ['nullable' => true],
            'Product ID'
        );

        $setup->getConnection()->createTable($table_neotiq_template);
        $setup->getConnection()->createTable($table_neotiq_workspace);
        $setup->endSetup();
    }
}
