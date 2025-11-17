<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        $products = DB::table('products')->get();

        foreach ($products as $p) {
            DB::table('warehouse_products')->updateOrInsert(
                [
                    'warehouse_id'    => 1,
                    'main_product_id' => $p->main_product_id,
                ],
                [
                    'product_cost'   => $p->product_cost,
                    'product_price'  => $p->product_price,
                    'product_discount' => $p->product_discount,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }

};
