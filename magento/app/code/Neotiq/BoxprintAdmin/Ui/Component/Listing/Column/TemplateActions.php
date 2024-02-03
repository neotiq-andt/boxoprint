<?php
namespace Neotiq\BoxprintAdmin\Ui\Component\Listing\Column;

use Magento\Framework\UrlInterface;
use Magento\Framework\View\Element\UiComponent\ContextInterface;
use Magento\Framework\View\Element\UiComponentFactory;
use Magento\Ui\Component\Listing\Columns\Column;

class TemplateActions extends Column
{

    const URL_PATH_EDIT = 'boxprintadmin/template/edit';
    const URL_PATH_DELETE = 'boxprintadmin/template/delete';
    protected $urlBuilder;
    public function __construct(
        ContextInterface $context,
        UiComponentFactory $uiComponentFactory,
        UrlInterface $urlBuilder,
        array $components = [],
        array $data = []
    ) {
        $this->urlBuilder = $urlBuilder;
        parent::__construct($context, $uiComponentFactory, $components, $data);
    }

    public function prepareDataSource(array $dataSource)
    {
        if (isset($dataSource['data']['items'])) {
            foreach ($dataSource['data']['items'] as & $item) {
                if (isset($item['template_id'])) {
                    $item[$this->getData('name')] = [
                        /* 'edit' => [
                            'href' => $this->urlBuilder->getUrl(
                                static::URL_PATH_EDIT,
                                [
                                    'template_id' => $item['template_id']
                                ]
                            ),
                            'label' => __('Edit')
                        ], */
                        'delete' => [
                            'href' => $this->urlBuilder->getUrl(
                                static::URL_PATH_DELETE,
                                [
                                    'template_id' => $item['template_id']
                                ]
                            ),
                            'label' => __('Delete'),
                            'confirm' => [
                                'title' => __('Delete'),
                                'message' => __('Are you sure you want to do this?')
                            ]
                        ]
                    ];
                }
            }
        }
        return $dataSource;
    }
}