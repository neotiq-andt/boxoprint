<?php
/**
 * custom ducdevphp@gmail.com
 */
namespace Neotiq\Boxprint\Controller\Index;
use Magento\Framework\Data\Form\FormKey\Validator as FormKeyValidator;
class Deletew extends \Magento\Framework\App\Action\Action
{
    protected $resultPageFactory;
    protected $storeManager;
    protected $connection;
    protected $resource;
    protected $neotiqBoxprintHelperData;
    private $formKeyValidator;
    public function __construct(
        \Magento\Framework\App\Action\Context $context,
        \Magento\Framework\View\Result\PageFactory $resultPageFactory,
        \Magento\Framework\App\ResourceConnection $resourceConnection,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Neotiq\Boxprint\Helper\Data $neotiqBoxprintHelperData,
         FormKeyValidator $formKeyValidator
    )
    {
        $this->resultPageFactory = $resultPageFactory;
        $this->storeManager = $storeManager;
        $this->connection = $resourceConnection->getConnection();
        $this->resource = $resourceConnection;
        $this->neotiqBoxprintHelperData = $neotiqBoxprintHelperData;
        $this->formKeyValidator = $formKeyValidator;
        parent::__construct($context);
    }

    public function execute()
    {
        $this->_view->loadLayout();
        $params = $this->getRequest()->getParams();
        $res = [
            'error' => true
        ];
        if (!$this->formKeyValidator->validate($this->getRequest())) {
            $this->messageManager->addError(__("Une erreur s'est produite, veuillez réessayer"));
            return;
        }
        if (!$this->getRequest()->isAjax() || empty($params) || !isset($params['customerEmail']) || !isset($params['workspaceId']) || empty($params['customerEmail'])) {
            $res = [
                'error' => true
            ];
            $this->messageManager->addError(__("Une erreur s'est produite, veuillez réessayer"));
            return;
        } else{
            $res = [
                'error' => true
            ];
            try {
                if($this->neotiqBoxprintHelperData->getWorkspaceById($params['workspaceId'])){
                    $workspace = $this->neotiqBoxprintHelperData->getWorkspaceById($params['workspaceId']);
                    if($workspace->getCustomerEmail() == $params['customerEmail'] && $workspace->getData('type_defined')==\Neotiq\BoxprintAdmin\Model\Config\Source\Defined::GUEST){
                        $workspace->delete();
                        $res = [
                            'error' => false,
                            'workspaceId' => $params['workspaceId']
                        ];
                        $this->messageManager->addSuccessMessage(__("Votre design %1 a été supprimé",$workspace->getProjectName()));
                    }
                    $res = [
                        'error' => true,
                        'workspaceId' => $params['workspaceId']
                    ];
                }
            } catch (\Exception $e) {
                $res = [
                    'error' => true
                ];
            }
            $this->getResponse()->representJson(
                $this->_objectManager->get('Magento\Framework\Json\Helper\Data')->jsonEncode($res)
            );
        }
    }
}
