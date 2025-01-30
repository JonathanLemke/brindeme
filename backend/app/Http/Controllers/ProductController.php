<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $products = Product::when($request->min_price, fn($query) => $query->where('price', '>=', $request->min_price))
            ->when($request->max_price, fn($query) => $query->where('price', '<=', $request->max_price))
            ->get();

        return response()->json($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|min:3',
            'price' => 'required|numeric|min:0',
            'image' => 'required|image|mimes:jpeg,png|max:1024',
        ]);

        $path = $request->file('image')->store('images', 'public');
        $product = Product::create([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'image_path' => $path,
        ]);

        return response()->json($product, 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'sometimes|min:3',
            'price' => 'sometimes|numeric|min:0',
            'image' => 'sometimes|image|mimes:jpeg,png|max:1024',
        ]);

        $product = Product::findOrFail($id);

        if ($request->hasFile('image')) {
            // Deletar a imagem antiga
            Storage::disk('public')->delete($product->image_path);
            $path = $request->file('image')->store('images', 'public');
            $product->image_path = $path;
        }

        $product->update($request->only(['name', 'description', 'price']));

        return response()->json($product);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        // Deletar a imagem do produto
        Storage::disk('public')->delete($product->image_path);

        $product->delete();

        return response()->json(['message' => 'Produto deletado com sucesso.']);
    }

    public function updatePrices(Request $request)
    {
        $request->validate([
            'percent' => 'required|numeric',
        ]);

        // Dispatch do job para atualizar os preços
        dispatch(new \App\Jobs\UpdateProductPrices($request->percent));

        return response()->json(['message' => 'Job para atualizar preços enviado.']);
    }
}
