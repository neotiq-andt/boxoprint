<?php
/**
 *ducdevphp@gmail.com
 */
?>
<?php
namespace Neotiq\BoxprintAdmin\Model;

class Template extends \Magento\Framework\Model\AbstractModel
{

    const BASE_MEDIA_PATH = 'neotiq/boxoprint/photo';

    const UPLOAD_FILE_JS = 'boxo-frontend/templates';

    protected $_monolog;

    protected $_messageManager;


    protected $_itemFactory;

    protected $_resourceConnection;

    protected function _construct()
    {
        $this->_init('Neotiq\BoxprintAdmin\Model\ResourceModel\Template');
    }
    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        \Magento\Framework\Message\ManagerInterface $messageManager,
        \Neotiq\BoxprintAdmin\Model\TemplateFactory $templateFactory,
        \Neotiq\BoxprintAdmin\Model\ResourceModel\Template $resource,
        \Neotiq\BoxprintAdmin\Model\ResourceModel\Template\Collection $resourceCollection,
        \Magento\Framework\App\ResourceConnection $resourceConnection,
        \Magento\Framework\Logger\Monolog $monolog
    ) {
        parent::__construct(
            $context,
            $registry,
            $resource,
            $resourceCollection
        );
        $this->_messageManager = $messageManager;
        $this->_monolog = $monolog;
        $this->_itemFactory = $templateFactory;
        $this->_resourceConnection = $resourceConnection;
    }

}

?>
