<?php
/*ducdevphp@gmail.com*/
?>
<?php
namespace Neotiq\BoxprintAdmin\Model\ResourceModel\Template\Grid;

use Magento\Framework\Search\AggregationInterface;
use Magento\Framework\Api\Search\SearchResultInterface;
use Neotiq\BoxprintAdmin\Model\ResourceModel\Template\Collection as BoxprintGridCollection;

use Magento\Framework\Data\Collection\EntityFactoryInterface;
use Psr\Log\LoggerInterface;
use Magento\Framework\Data\Collection\Db\FetchStrategyInterface;
use Magento\Framework\Event\ManagerInterface;
use Magento\Framework\View\Element\UiComponent\DataProvider\SearchResult;

class Collection extends SearchResult
{
    public function __construct(
        EntityFactoryInterface $entityFactory,
        LoggerInterface $logger,
        FetchStrategyInterface $fetchStrategy,
        ManagerInterface $eventManager,
        $mainTable,
        $resourceModel
    ) {
        parent::__construct($entityFactory, $logger, $fetchStrategy, $eventManager, $mainTable, $resourceModel);
    }
}
