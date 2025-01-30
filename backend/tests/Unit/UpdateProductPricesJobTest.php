<?php

namespace Tests\Unit;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Jobs\UpdateProductPrices;
use App\Models\Product;

class UpdateProductPricesJobTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_updates_product_prices()
    {
        // Criar produtos de teste
        $product1 = Product::factory()->create(['price' => 100]);
        $product2 = Product::factory()->create(['price' => 200]);

        // Executa o job diretamente
        (new UpdateProductPrices(10))->handle();

        // Verifica se os preços foram atualizados corretamente
        $this->assertEquals(110, $product1->fresh()->price);
        $this->assertEquals(220, $product2->fresh()->price);
    }

    /** @test */
    public function it_can_update_product_prices_with_discount_and_increase()
    {
        // Criar produtos
        $product1 = Product::factory()->create(['price' => 100.00]);
        $product2 = Product::factory()->create(['price' => 200.00]);

        // Aplicar um aumento de 10%
        (new UpdateProductPrices(10))->handle();

        $this->assertEquals(110.00, $product1->fresh()->price);
        $this->assertEquals(220.00, $product2->fresh()->price);

        // Aplicar um desconto de 10%
        (new UpdateProductPrices(-10))->handle();

        $this->assertEquals(99.00, $product1->fresh()->price); // 110 - 10%
        $this->assertEquals(198.00, $product2->fresh()->price); // 220 - 10%
    }

}
