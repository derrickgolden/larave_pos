<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Http\Resources\ManageStockCollection;
use App\Http\Resources\ManageStockResource;
use App\Repositories\ManageStockRepository;
use Illuminate\Http\Request;

/**
 * Class UserAPIController
 */
class ManageStockAPIController extends AppBaseController
{
    private $manageStockRepository;

    public function __construct(ManageStockRepository $manageStockRepository)
    {
        $this->manageStockRepository = $manageStockRepository;
    }

    public function stockReport(Request $request): ManageStockCollection
    {
        $request->request->remove('filter');
        $perPage = getPageSize($request);
        $search = $request->get('search');
        $warehouseId = $request->get('warehouse_id');
        if ($search && $search != 'null') {
            $stocks = $this->manageStockRepository
                ->where('warehouse_id', $warehouseId)
                ->whereHas('product', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('product_code', 'like', "%{$search}%");
                })
                ->paginate($perPage);

        } else {
            $stocks = $this->manageStockRepository
                ->where('warehouse_id', $warehouseId)
                ->paginate($perPage);
        }
        ManageStockResource::usingWithCollection();

        return new ManageStockCollection($stocks);
    }
}
