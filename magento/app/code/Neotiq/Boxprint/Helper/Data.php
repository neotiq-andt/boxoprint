<?php
/**
 * ducdevphp@gmail.com
 */
namespace Neotiq\Boxprint\Helper;

class Data extends \Magento\Framework\App\Helper\AbstractHelper
{

    protected $_objectManager;
    protected $_registry;
    protected $_filterProvider;
    protected $_session;
    protected $neotiqHelperData;
    const BOX_SAVE_PATH = 'boxoprint/image';
    const PATH_TO_TOOL = 'boxo-frontend/workspace';

    public function __construct(
        \Magento\Framework\App\Helper\Context $context,
        \Magento\Framework\ObjectManagerInterface $objectManager,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Magento\Customer\Model\Session $session,
        \Neotiq\Neotiq\Helper\Data $neotiqHelperData,
        \Magento\Framework\Registry $registry
    ) {
        $this->_storeManager = $storeManager;
        $this->_objectManager = $objectManager;
        $this->_registry = $registry;
        $this->_session = $session;
        $this->neotiqHelperData = $neotiqHelperData;

        parent::__construct($context);
    }
    public function getBaseUrlByType($type)
    {
        return $this->_storeManager->getStore()->getBaseUrl($type);
    }
    public function createModel($model)
    {
        return $this->_objectManager->create($model);
    }

    public function getWorkspaceById($id) {
        $workspace = $this->createModel('Neotiq\BoxprintAdmin\Model\Workspace')->load($id);
        if($workspace->getWorkspaceId()){
            return $workspace;
        }
        return false;
    }

    public function isCustomerLoggedIn()
    {
        return $this->_session->isLoggedIn();
    }

    public function checckCustomerWorkspaceById($id) {
        $workspace = $this->createModel('Neotiq\BoxprintAdmin\Model\Workspace')->load($id);
        if($workspace->getCustomerEmail() && $this->isCustomerLoggedIn()){
            $customerData = $this->_session->getCustomerData();
            if($customerData->getEmail()==$workspace->getCustomerEmail()){
                return true;
            }
        }
        return false;
    }

    public function checkWorkspaceIsDefault($id){
        if($this->getWorkspaceById($id)){
            if($this->getWorkspaceById($id)->getTypeDefined()==\Neotiq\BoxprintAdmin\Model\Config\Source\Defined::ADMIN){
                return true;
            }
        }
        return false;
    }

    public function getWorkspaceByProduct()
    {
        $current_product = $this->neotiqHelperData->getCurrentProduct();
        if($current_product) {
            $product = $this->createModel('Magento\Catalog\Model\Product')->load($current_product->getId());
            $workspace_id = $product->getData('mdq_workspace');
            if($workspace_id) {
                $workspace = $this->createModel('Neotiq\BoxprintAdmin\Model\Workspace')->load($workspace_id);
                if($workspace->getStatus() == \Neotiq\BoxprintAdmin\Model\Config\Source\Status::YES) {
                    return $workspace;
                }
            }
        }
        return false;
    }

    public function getBoxImageByProduct(){
        $media_url = $this->getBaseUrlByType(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA);
        if($workspace = $this->getWorkspaceByProduct()) {
            return $media_url.self::BOX_SAVE_PATH.'/'.$workspace->getImage();
        }
        return false;
    }

    public function getBoxImageById($id){
        $media_url = $this->getBaseUrlByType(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA);
        if($workspace = $this->getWorkspaceById($id)) {
            return $media_url.self::BOX_SAVE_PATH.'/'.$workspace->getImage();
        }
        return false;
    }

    public function getBoxprintUrlByProduct() {
        $base_url = $this->getBaseUrlByType(\Magento\Framework\UrlInterface::URL_TYPE_WEB);
        if($workspace = $this->getWorkspaceByProduct()) {
            return $base_url.self::PATH_TO_TOOL.'/'.$workspace->getId();
        }
        return false;
    }

	public function getBoxprintUrl() {
	if ($this->neotiqHelperData->getConfig('neotiq_boxprint_config/general/api_frontend')) {
            return $this->neotiqHelperData->getConfig('neotiq_boxprint_config/general/api_frontend').'/'.self::PATH_TO_TOOL.'/';
        }
        $base_url = $this->getBaseUrlByType(\Magento\Framework\UrlInterface::URL_TYPE_WEB);
        return $base_url.self::PATH_TO_TOOL.'/';
    }

    public function getBoxprintBaseByProduct()
    {
        if($workspace = $this->getWorkspaceByProduct()) {
            if ($workspace->getData('base')) {
              return $this->_objectManager->get(\Magento\Framework\Serialize\SerializerInterface::class)->unserialize($workspace->getData('base'));
            }
        }
        return false;
    }

    public function getBoxprintBaseById($id)
    {
        if($workspace = $this->getWorkspaceById($id)) {
            if ($workspace->getData('base')) {
                return $this->_objectManager->get(\Magento\Framework\Serialize\SerializerInterface::class)->unserialize($workspace->getData('base'));
            }
        }
        return false;
    }

    public function getBoxprintConfigById($id)
    {
        if($workspace = $this->getWorkspaceById($id)) {
            if ($workspace->getData('config')) {
                try {
                    return $this->_objectManager->get(\Magento\Framework\Serialize\SerializerInterface::class)->unserialize($workspace->getData('config'));
                } catch (\Zend\Uri\Exception\InvalidArgumentException $exception) {
                    return false;
                }
            }
        }
        return false;
    }

    public function getBoxprintFrontConfigById($id) {
        if($this->getBoxprintConfigById($id)) {
            $config = $this->getBoxprintConfigById($id);
            if(isset($config['front'])) {
                return $config['front'];
            }
        }
        return false;
    }

    public function getBoxprintFrontShowById($id) {
        $front = $this->getBoxprintFrontConfigById($id);
        $arr_text = ['color'=>'Color','size'=>'Size','font_family'=>'Font Family','font_size'=>'Font Size','font_style'=>'Font Style','font_weight'=>'Font Weight','rotate'=>'Rotate'];
        $arr_img = ['width'=>'Width','height'=>'Height','rotate'=>'Rotate'];
        $show = [];
        if($front) {
            foreach ($front as $fr) {
                if($fr['layer_type'] == 'text') {
                    $show['layer_type'] = 'text';
                    $show['text'] = isset($fr['properties']['text']) ? $fr['properties']['text'] : '';
                    $show['color'] = isset($fr['properties']['color']) ? $fr['properties']['color'] : '';
                    $show['size'] = isset($fr['properties']['size']) ? $fr['properties']['size'] : '';
                    $show['font_family'] = isset($fr['properties']['font_family']) ? $fr['properties']['font_family']:'';
                    $show['font_size'] = isset($fr['properties']['font_size']) ?$fr['properties']['font_size'] :'';
                    $show['font_style'] = isset($fr['properties']['font_style']) ? $fr['properties']['font_style']:'';
                    $show[$arr_text['font_weight']] = isset($fr['properties']['font_weight']) ? $fr['properties']['font_weight']  : '';
                    $show[$arr_text['rotate']] = isset($fr['properties']['rotate'])? $fr['properties']['rotate']:'';
                }
                if($fr['layer_type'] == 'picture') {
                    $show['layer_type'] = 'picture';
                    $show['dataURL'] = isset($fr['properties']['dataURL']) ? $fr['properties']['dataURL'] : '';
                    $show[$arr_text['width']] = isset($fr['properties']['width']) ? $fr['properties']['width'] :'';
                    $show[$arr_text['height']] = isset($fr['properties']['height']) ? $fr['properties']['height']:'';
                    $show[$arr_text['rotate']] = isset($fr['properties']['rotate']) ? $fr['properties']['rotate']:'';
                }
            }
        }
        return $show;
    }

	public function getSymbol() {
       return  $this->_storeManager->getStore()->getCurrentCurrency()->getCurrencySymbol();
    }
}
