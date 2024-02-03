<?php
namespace Neotiq\Boxprint\Plugin\Checkout\AttributeMerger;

class Plugin
{
    public function afterMerge(\Magento\Checkout\Block\Checkout\AttributeMerger $subject, $result)
    {
        if (array_key_exists('street', $result)) {
            $result['street']['children'][0]['placeholder'] = __("Adresse*");
            $result['street']['children'][1]['placeholder'] = __("Complément d'adresse");
        }
        $result['firstname']['placeholder'] = __('Prénom');
        $result['lastname']['placeholder'] = __('Nom');
        $result['city']['placeholder'] = __('Ville');
        $result['postcode']['placeholder'] = __('Code postal');
        $result['telephone']['placeholder'] = __('Numéro de téléphone');
        return $result;
    }
}
