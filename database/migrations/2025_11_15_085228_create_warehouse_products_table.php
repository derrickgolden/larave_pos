<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('warehouse_products', function (Blueprint $table) {
            $table->id();

            $table->foreignId('warehouse_id')
                ->constrained('warehouses')
                ->onDelete('cascade');

            $table->foreignId('main_product_id')
                ->constrained('main_products')
                ->onDelete('cascade');

            $table->decimal('product_cost', 10, 2)->default(0);
            $table->decimal('product_price', 10, 2)->default(0);
            $table->decimal('product_discount', 10, 2)->default(0);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('warehouse_products');
    }
};
