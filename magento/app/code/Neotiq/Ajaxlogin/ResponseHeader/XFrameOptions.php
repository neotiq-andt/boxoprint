<?php

namespace Neotiq\Ajaxlogin\ResponseHeader;

class XFrameOptions extends \Magento\Framework\App\Response\HeaderProvider\XFrameOptions {

    public function __construct(
        $xFrameOpt = 'SAMEORIGIN',
        \Magento\Framework\App\Request\Http $request     
    ) {
        // Eg if your iframe controller frontname is 'test'
        $isIframeController = ($request->getModuleName() == 'ajaxlogin');

        // Skip this for the iFrame page
        if ($isIframeController) {
            return;
        }
        return parent::__construct($xFrameOpt);        
    }    
}