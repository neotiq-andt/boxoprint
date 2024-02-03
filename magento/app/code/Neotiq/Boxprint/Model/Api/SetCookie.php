<?php
/**
 * custom ducdevphp@gmail.com
 */
namespace Neotiq\Boxprint\Model\Api;

class SetCookie
{
    protected $logger;

    protected $request;

    protected $neotiqBoxprintHelperCookie;

    protected $requestapi;

    public function __construct(
        \Psr\Log\LoggerInterface $logger,
        \Magento\Framework\App\RequestInterface $request,
        \Neotiq\Boxprint\Helper\Cookie $neotiqBoxprintHelperCookie,
        \Magento\Framework\Webapi\Rest\Request $requestapi
    )
    {
        $this->neotiqBoxprintHelperCookie = $neotiqBoxprintHelperCookie;
        $this->logger = $logger;
        $this->request = $request;
        $this->requestapi = $requestapi;
    }

    public function setCookie()
    {
        $response = ['success' => false];
        try {
            //$post= $this->request->getPost();
            $bodyParams = $this->requestapi->getBodyParams();
            if(isset($bodyParams['workspaceId']) && isset($bodyParams['productId'])) {
                if($this->neotiqBoxprintHelperCookie->get()) {
                   // $cookie = $this->neotiqBoxprintHelperCookie->get();
                   // var_dump($cookie);
                }
            }else {
                $response = ['success' => true, 'message' => 'error'];
            }
            $response = ['success' => true, 'message' => 'abc'];
        } catch (\Exception $e) {
            $response = ['success' => false, 'message' => $e->getMessage()];
          //  $this->logger->info($e->getMessage());
        }
       // $returnArray = json_encode($response);
        //return $returnArray;
    }
}
?>
