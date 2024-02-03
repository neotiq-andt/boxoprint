<?php
/**
 * ducdevphp@gmail.com
 */
namespace Neotiq\BoxprintAdmin\Helper;

class Data extends \Magento\Framework\App\Helper\AbstractHelper
{

    protected $neotiqHelperData;

    protected $curl;

    protected $_storeManager;

    protected $fileDriver;

    protected $json;
	
	protected $datetime;

    protected $_sftp;

    public function __construct(
        \Magento\Framework\App\Helper\Context $context,
        \Neotiq\Neotiq\Helper\Data $neotiqHelperData,
        \Magento\Framework\HTTP\Client\Curl $curl,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Magento\Framework\Filesystem\Driver\File $fileDriver,
        \Magento\Framework\Serialize\Serializer\Json $json,
		\Magento\Framework\Stdlib\DateTime\DateTime $datetime,
        \Magento\Framework\Filesystem\Io\Sftp $sftp

    ) {
        $this->neotiqHelperData = $neotiqHelperData;
        $this->curl = $curl;
        $this->_storeManager = $storeManager;
        $this->fileDriver = $fileDriver;
        $this->json = $json;
		$this->datetime = $datetime;
        $this->_sftp = $sftp;
        parent::__construct($context);
    }

    public function getContentByUrl($url){
        $this->curl->setHeaders([
            'Content-Type' => 'image/svg+xml'
        ]);
		$this->curl->setOption(CURLOPT_SSL_VERIFYHOST,false);
		$this->curl->setOption(CURLOPT_SSL_VERIFYPEER,false);
        try {
            $this->curl->get($url);
			if($this->curl->getStatus() != 200) {
				return false;
			}
            $response = $this->curl->getBody();
            return $response;
        }catch (\Exception $e){
            return false;
        }
        return false;
    }
	
	public function getRunUrl($url){
		
		 $this->curl->setHeaders([
            'Content-Type' => 'text/html'
        ]);
		$this->curl->setOption(CURLOPT_SSL_VERIFYHOST,false);
		$this->curl->setOption(CURLOPT_SSL_VERIFYPEER,false);
		$this->curl->setOption(CURLOPT_POST,false);
        try {
            $this->curl->get($url);
			if($this->curl->getStatus() != 200) {
				return false;
			}
            $response = $this->curl->getBody();
            return $response;
        }catch (\Exception $e){
            return false;
        }
        return false;
		
    }

    public function getUrlSvgToolRender($l = 125, $w = 80, $h = 100 , $name=''){
        $baseUrl = $this->_storeManager->getStore()->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_WEB);
        $url = $this->neotiqHelperData->getConfig('neotiq_boxprint_config/general/url_svg');
        $dictionary = [];
        $dictionary['length'] = $l;
        $dictionary['width'] = $w;
        $dictionary['height'] = $h;
        $dictionary['name'] = $name;
        $url = preg_replace_callback(
            '/{{(.*)}}/miU',
            function ($match) use ($dictionary) {
                if (isset($dictionary[$match['1']])) {
                    return $this->getPreparedValue($dictionary,$match['1']);
                } else {
                    return '';
                }
            },
            $url
        );
        return $url;
    }

    public function getDataFileJson($path,$m_path, $l = 125, $w = 80, $h = 100 , $name=''){
        $url = $this->getUrlSvgToolRender($l , $w , $h  , $name);
        if ($this->fileDriver->isExists($m_path)) {
			if($this->getRunUrl($this->neotiqHelperData->getConfig('neotiq_boxprint_config/general/api_render_workspace'))){
				if($this->getContentByUrl($url)){
				$svg = $this->getContentByUrl($url);
				$content = $this->fileDriver->fileGetContents($m_path);
				$jsonDecode = $this->json->unserialize($content);
				$data = [];
				$data['svg'] = $svg;
				$data['conf3D'] = $jsonDecode['conf3D'];
				$data['properties']['l'] = floatval($l);
				$data['properties']['w'] = floatval($w);
				$data['properties']['h'] = floatval($h);
				$jsonEncode = $this->json->serialize($data);
				return $jsonEncode;
			  }
			}else{
				return false;
			}
        } else {
           return false;
        }
    }

    public function getConfigWorkspae(){
        return $this->neotiqHelperData->getConfig('neotiq_boxprint_config/general/config_workspace');
    }

    public function checkEnableAuto(){
        return $this->neotiqHelperData->getConfig('neotiq_boxprint_config/general/auto_enabled');
    }
	
	public function getGmtDate(){
		return $this->datetime->gmtDate();
	}

    public function getPreparedValue($dictionary,$key)
    {
        switch ($key) {
            case 'length':
                return $dictionary['length'];
            case 'width':
                return $dictionary['width'];
            case 'height':
                return $dictionary['height'];
            case 'name':
                return urlencode($dictionary['name']);
            default:
                return $dictionary['length'];
        }
    }

    public function loginSftp()
    {
        $host = $this->neotiqHelperData->getConfig('neotiq_boxprint_config/general/host');
        $port = $this->neotiqHelperData->getConfig('neotiq_boxprint_config/general/post');
        $username =$this->neotiqHelperData->getConfig('neotiq_boxprint_config/general/username');
        $password = $this->neotiqHelperData->getConfig('neotiq_boxprint_config/general/password');

        $this->_sftp->open(
            array(
                'host' => $host.':'.$port,
                'username' => $username,
                'password' => $password
            )
        );

        return $this->_sftp;
    }

    public function saveFile( $filename, $filePathName)
    {
        $sftp = $this->loginSftp();
        $exportedFolder = '/var/www/html/backend/src/app/templates/';
        if($this->neotiqHelperData->getConfig('neotiq_boxprint_config/general/path_save')){
            $exportedFolder = $this->neotiqHelperData->getConfig('neotiq_boxprint_config/general/path_save');
        }
        try{
            $sftp->cd($exportedFolder);
            $sftp->write($filename,$filePathName);
            $sftp->close();
        }catch(\Exception $e){
            echo $e->getMessage();
        }
    }

}
