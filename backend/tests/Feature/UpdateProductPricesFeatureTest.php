<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;
use App\Jobs\UpdateProductPrices;
use App\Models\Product;
use Illuminate\Support\Facades\Notification;
use App\Notifications\PriceUpdateCompleted;
use App\Models\User;

class UpdateProductPricesFeatureTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_dispatches_the_job_to_update_prices()
    {
        Queue::fake();

        dispatch(new UpdateProductPrices(10));

        Queue::assertPushed(UpdateProductPrices::class, function ($job) {
            return $job->getPercent() === 10; 
        });
    }

    /** @test */
    public function it_processes_the_job_and_logs_prices()
    {
        Notification::fake();

        $user = User::factory()->create();

        $product1 = Product::factory()->create(['price' => 100]);
        $product2 = Product::factory()->create(['price' => 200]);

        (new UpdateProductPrices(10))->handle();

        $this->assertEquals(110, $product1->fresh()->price);
        $this->assertEquals(220, $product2->fresh()->price);

        Notification::assertSentTo(
            [$user], 
            PriceUpdateCompleted::class, 
            function ($notification) {
                return $notification->percent === 10;
            }
        );
    }
}
