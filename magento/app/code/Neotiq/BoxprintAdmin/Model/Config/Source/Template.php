<?php
namespace Neotiq\BoxprintAdmin\Model\Config\Source;

class Template implements \Magento\Framework\Data\OptionSourceInterface
{

    protected $templateCollection;

    public function __construct(
        \Neotiq\BoxprintAdmin\Model\ResourceModel\Template\CollectionFactory $templateCollection
    ) {
        $this->templateCollection = $templateCollection;
    }

    public function toOptionArray()
    {
        $templates = [['value' => "0", 'label' => __('None')]];
        $templateCollection = $this->templateCollection->create();

        foreach ($templateCollection as $template) {
            array_push($templates, ['value' => $template->getTemplateId(), 'label' => $template->getName()]);
        }

        return $templates;
    }
}
