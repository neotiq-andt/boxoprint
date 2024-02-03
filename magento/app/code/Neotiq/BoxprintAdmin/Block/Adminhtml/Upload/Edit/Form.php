<?php
namespace Neotiq\BoxprintAdmin\Block\Adminhtml\Upload\Edit;
use Magento\Config\Model\Config\Source\Yesno;

class Form extends \Magento\Backend\Block\Widget\Form\Generic
{
    protected $_yesno;

    protected $_systemStore;

    protected $_yesNo;

    public function __construct(
        \Magento\Backend\Block\Template\Context $context,
        \Magento\Framework\Registry $registry,
        \Magento\Framework\Data\FormFactory $formFactory,
        \Magento\Store\Model\System\Store $systemStore,
        \Magento\Config\Model\Config\Source\Yesno $yesno,
        array $data = []
    ) {
        parent::__construct($context, $registry, $formFactory, $data);
        $this->_yesno = $yesno;
        $this->_systemStore = $systemStore;
    }

    protected function _prepareForm()
    {

        if($this->_isAllowedAction('Neotiq_BoxprintAdmin::upload')){
            $isElementDisabled = false;
        }else {
            $isElementDisabled = true;
        }

        $form = $this->_formFactory->create(
            [
                'data' => [
                    'id' => 'edit_form',
                    'action' => $this->getData('action'),
                    'method' => 'post',
                    'enctype' => 'multipart/form-data'
                ]
            ]
        );

        $fieldset = $form->addFieldset('base_fieldset', ['legend' => __('Upload File')]);
		
		/* $fieldset->addField(
            'name_project',
            'text',
            [
                'name'     => 'name_project',
                'label'    => __('Nom de conception'),
                'title'    => __('Nom de conception'),
                'required' => true,
            ]
        );
		

        $fieldset->addField(
            'length',
            'text',
            [
                'name'     => 'length',
                'label'    => __('Longueur (mm)'),
                'title'    => __('Longueur (mm)'),
                'required' => true,
                'class' => 'validate-digits'
            ]
        );

        $fieldset->addField(
            'width',
            'text',
            [
                'name'     => 'width',
                'label'    => __('Largeur (mm)'),
                'title'    => __('Largeur (mm)'),
                'required' => true,
                'class' => 'validate-digits'
            ]
        );

        $fieldset->addField(
            'height',
            'text',
            [
                'name'     => 'height',
                'label'    => __('Hauteur (mm)'),
                'title'    => __('Hauteur (mm)'),
                'required' => true,
                'class' => 'validate-digits'
            ]
        ); */

        $fieldset->addField(
            'jsonfile',
            'file',
            [
                'title'    => __('Json File'),
                'label'    => __('Json File'),
                'name'     => 'jsonfile',
                'note'     => 'Accepted Json file',
                'required' => true
            ]
        );

        $fieldset->addField(
            'jsfile',
            'file',
            [
                'title'    => __('Js File'),
                'label'    => __('Js File'),
                'name'     => 'jsfile',
                'note'     => 'Accepted Js file',
                'required' => true,
            ]
        );

        $form->setUseContainer(true);
        $this->setForm($form);
        return parent::_prepareForm();
    }

    protected function _isAllowedAction($resourceId)
    {
        return $this->_authorization->isAllowed($resourceId);
    }
}
