<?php
/**
 * ducdevphp@gmail.com
 */
namespace Neotiq\Boxprint\Helper;

use Magento\Framework\App\Helper\AbstractHelper as MagentoAbstractHelper;
use Magento\Framework\App\Helper\Context;
use Magento\Framework\Session\SessionManagerInterface;
use Magento\Framework\Stdlib\Cookie\CookieMetadataFactory;
use Magento\Framework\Stdlib\CookieManagerInterface;

class Cookie extends MagentoAbstractHelper
{
    const DEFAULT_COOKIE_LIFETIME = 172800; // 2 days
    const CONNECTOR_COOKIE_NAME = 'boxoprint';

    protected $storeManager;

    protected $cookieManager;

    protected $cookieMetadataFactory;

    protected $sessionManager;


    public function __construct(
        Context $context,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        CookieManagerInterface $cookieManager,
        CookieMetadataFactory $cookieMetadataFactory,
        SessionManagerInterface $sessionManager
    ) {
        parent::__construct($context);
        $this->storeManager = $storeManager;
        $this->cookieManager = $cookieManager;
        $this->cookieMetadataFactory = $cookieMetadataFactory;
        $this->sessionManager = $sessionManager;
    }

    public function get()
    {
        $value = $this->cookieManager->getCookie($this->getCookieName());
        if ($this->isJson($value)) {
            $value = json_decode($value, true);
        }

        return $value;
    }

    public function set($value, $duration = null)
    {
        $metadata = $this->cookieMetadataFactory
            ->createPublicCookieMetadata()
            ->setDuration($duration ? $duration : static::DEFAULT_COOKIE_LIFETIME)
            ->setPath($this->sessionManager->getCookiePath())
            ->setDomain($this->sessionManager->getCookieDomain());
        if (is_array($value)) {
            $value = json_encode($value);
        }
        $this->cookieManager->setPublicCookie(
            $this->getCookieName(),
            $value,
            $metadata
        );
    }

    public function delete()
    {
        $this->cookieManager->deleteCookie(
            $this->getCookieName(),
            $this->cookieMetadataFactory
                ->createCookieMetadata()
                ->setPath($this->sessionManager->getCookiePath())
                ->setDomain($this->sessionManager->getCookieDomain())
        );
    }


    public function getCookieName()
    {
        return static::CONNECTOR_COOKIE_NAME;
    }

    public function isJson($string)
    {
        json_decode($string);

        return (json_last_error() == JSON_ERROR_NONE);
    }

    public function setValueCookie($param) {
        $cookie = $this->get();
        $ar = [];
        $val = ['p'=>'','ws'=>[],'w'=>''];
        if(isset($param['workspaceId']) && isset($param['productId'])) {
            if($cookie) {

            }else {
                $val['p'] = $param['productId'];
                $val['ws'][] = $param['workspaceId'];
                $val['w'] = $param['workspaceId'];
            }
        }
        array_push($ar,$val);
        $this->set($ar);
    }
}
?>
