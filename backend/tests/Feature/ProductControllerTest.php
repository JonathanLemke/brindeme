<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ProductControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $token;

    public function setUp(): void
    {
        parent::setUp();

        // Criar usuário de teste e gerar token de autenticação
        $user = User::factory()->create();
        $this->token = $user->createToken('test-token')->plainTextToken;
    }

    /** @test */
    public function it_can_list_products()
    {
        Product::factory(3)->create();

        $response = $this->getJson('/api/products', [
            'Authorization' => "Bearer {$this->token}"
        ]);

        $response->assertStatus(200)
                 ->assertJsonCount(3);
    }

    /** @test */
    public function it_can_create_a_product()
    {
        Storage::fake('public');

        $data = [
            'name' => 'Produto Teste',
            'description' => 'Descrição do produto teste',
            'price' => 100.00,
            'image' => UploadedFile::fake()->image('produto.jpg'),
        ];

        $response = $this->postJson('/api/products/store', $data, [
            'Authorization' => "Bearer {$this->token}"
        ]);

        $response->assertStatus(201)
                 ->assertJsonFragment(['name' => 'Produto Teste']);

        Storage::disk('public')->assertExists($response->json('image_path'));
    }

    /** @test */
    public function it_can_update_a_product()
    {
        $product = Product::factory()->create();

        $data = [
            'name' => 'Produto Atualizado',
            'price' => 150.00,
        ];

        $response = $this->putJson("/api/products/{$product->id}", $data, [
            'Authorization' => "Bearer {$this->token}"
        ]);

        $response->assertStatus(200)
                 ->assertJsonFragment(['name' => 'Produto Atualizado']);
    }

    /** @test */
    public function it_can_delete_a_product()
    {
        $product = Product::factory()->create();

        $response = $this->deleteJson("/api/products/{$product->id}", [], [
            'Authorization' => "Bearer {$this->token}"
        ]);

        $response->assertStatus(200)
                 ->assertJsonFragment(['message' => 'Produto deletado com sucesso.']);
    }

    /** @test */
    public function it_can_list_products_with_filters()
    {
        // Cria produtos com preços diferentes
        Product::factory()->create(['price' => 50]);
        Product::factory()->create(['price' => 100]);
        Product::factory()->create(['price' => 150]);

        // Filtro para min_price
        $response = $this->getJson('/api/products?min_price=100', [
            'Authorization' => "Bearer {$this->token}"
        ]);

        $response->assertStatus(200);

        $data = $response->json();

        $this->assertCount(2, $data);
        $this->assertEquals(100, $data[0]['price']);
        $this->assertEquals(150, $data[1]['price']);

        // Filtro para max_price
        $response = $this->getJson('/api/products?max_price=100', [
            'Authorization' => "Bearer {$this->token}"
        ]);

        $response->assertStatus(200);

        $data = $response->json();

        $this->assertCount(2, $data);
        $this->assertEquals(50, $data[0]['price']);
        $this->assertEquals(100, $data[1]['price']);

        // Filtro para min_price e max_price
        $response = $this->getJson('/api/products?min_price=50&max_price=100', [
            'Authorization' => "Bearer {$this->token}"
        ]);

        $response->assertStatus(200);

        $data = $response->json();

        $this->assertCount(2, $data);
        $this->assertEquals(50, $data[0]['price']);
        $this->assertEquals(100, $data[1]['price']);
    }

}
