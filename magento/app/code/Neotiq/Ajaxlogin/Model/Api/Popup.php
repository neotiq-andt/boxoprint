<?php
/**
 * custom ducdevphp@gmail.com
 */
namespace Neotiq\Ajaxlogin\Model\Api;

class Popup
{
    protected $logger;

    protected $request;

    protected $neotiqBoxprintHelperPopup;

    protected $requestapi;

    public function __construct(
        \Psr\Log\LoggerInterface $logger,
        \Magento\Framework\App\RequestInterface $request,
        \Neotiq\Ajaxlogin\Helper\Popup $neotiqBoxprintHelperPopup,
        \Magento\Framework\Webapi\Rest\Request $requestapi
    )
    {
        $this->neotiqBoxprintHelperPopup = $neotiqBoxprintHelperPopup;
        $this->logger = $logger;
        $this->request = $request;
        $this->requestapi = $requestapi;
    }

    public function checkPopup()
    {
        $response = ['success' => false];
        try {
            //$post= $this->request->getPost();
            $bodyParams = $this->requestapi->getBodyParams();
            if(isset($bodyParams['workspaceId']) && isset($bodyParams['productId'])) {

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
