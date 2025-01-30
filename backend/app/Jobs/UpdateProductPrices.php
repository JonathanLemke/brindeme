<?php

namespace App\Jobs;

use App\Models\Product;
use Illuminate\Bus\Queueable; 
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels; 
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use App\Notifications\PriceUpdateCompleted;
use App\Models\User;

class UpdateProductPrices implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $percent;

    public function __construct($percent)
    {
        $this->percent = $percent;
    }

    public function handle(): void
    {
        $products = Product::all();
        $updatedProducts = [];

        foreach ($products as $product) {
            $oldPrice = $product->price;
            $newPrice = round($oldPrice * (1 + $this->percent / 100), 2);
            $product->update(['price' => $newPrice]);

            $operation = $this->percent > 0 ? 'acréscimo' : 'desconto';
            $updatedProducts[] = [
                'product_id' => $product->id,
                'name' => $product->name,
                'old_price' => $oldPrice,
                'new_price' => $newPrice,
                'percent' => abs($this->percent),
                'operation' => $operation
            ];

            Log::info("Produto {$product->id} atualizado de {$oldPrice} para {$newPrice} ({$operation} de {$this->percent}%)");
        }

        if (!empty($updatedProducts)) {
            Notification::send(User::all(), new PriceUpdateCompleted($this->percent, $updatedProducts));
        }
    }

    public function getPercent()
    {
        return $this->percent;
    }
}
