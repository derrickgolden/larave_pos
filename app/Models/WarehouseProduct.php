<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WarehouseProduct extends Model
{
    use HasFactory;

    protected $table = 'warehouse_products';

    protected $fillable = [
        'warehouse_id',
        'main_product_id',
        'product_cost',
        'product_price',
        'product_discount',
    ];

    protected $casts = [
        'product_cost' => 'float',
        'product_price' => 'float',
        'product_discount' => 'float',
    ];

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function mainProduct()
    {
        return $this->belongsTo(MainProduct::class, 'main_product_id');
    }
}
