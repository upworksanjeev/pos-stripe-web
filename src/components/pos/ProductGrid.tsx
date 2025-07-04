import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Star } from 'lucide-react';
import { endPoint } from '@/lib/utils';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    priceId: string | null;
    image: string;
}

interface ProductGridProps {
    readerID?: string | null;
}

const ProductGrid = ({ readerID }: ProductGridProps) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    useEffect(() => {
        // Load favorites from localStorage on mount
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
            try {
                setFavorites(new Set(JSON.parse(storedFavorites)));
            } catch {
                // ignore parse errors
            }
        }

        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${endPoint}/api/products`);
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                console.error("Failed to load products:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handlePayment = async (product: Product) => {
        const res = await fetch(`${endPoint}/api/create-payment-intent`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: "product",
                amount: product.price,
                metadata: { productId: product.id, priceId: product.priceId }
            })
        });
        const result = await res.json();

        if (!res.ok) {
            alert(`Error creating payment: ${result.error}`);
            return;
        }
        
        const res2 = await fetch(`${endPoint}/api/process-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentIntentId: result.paymentIntentId , readerId: readerID })
        });
        const result2 = await res2.json();
        if (!res2.ok) {
            alert(`Error processing payment: ${result2.error}`);
            return;
        }
        alert(`PaymentIntent created. ID: ${result.paymentIntentId}`);
    };

    const toggleFavorite = (productId: string) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(productId)) {
                newFavorites.delete(productId);
            } else {
                newFavorites.add(productId);
            }
            // Save updated favorites to localStorage
            localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)));
            return newFavorites;
        });
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const displayedProducts = activeTab === 'all'
        ? filteredProducts
        : filteredProducts.filter(product => favorites.has(product.id));

    return (
        <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold flex items-center gap-4">
                Select Product
                <div className="ml-6 flex space-x-4">
                    <button
                        className={`px-2 py-0.5 text-sm rounded-md ${activeTab === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All
                    </button>
                    <button
                        className={`px-2 py-0.5 text-sm rounded-md ${activeTab === 'favorites' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        onClick={() => setActiveTab('favorites')}
                    >
                        Favorites
                    </button>
                </div>
            </h2>
            <Badge variant="secondary" className="text-lg px-3 py-1">
            {displayedProducts.length} Products Available
            </Badge>
        </div>

        <input
            type="text"
            placeholder="Search products by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />

        {loading ? (
            <p className="text-gray-500">Loading products from Stripe...</p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow cursor-pointer flex flex-col justify-between h-[320px]">
                <CardHeader>
                    <div className="flex justify-between items-start">
                    <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                        <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-md mb-2 md:mb-0" />
                        <div className="max-w-xs" style={{minHeight: '96px'}}>
                            <CardTitle className="text-lg">{product.name}</CardTitle>
                            <CardDescription className="line-clamp-3">{product.description}</CardDescription>
                        </div>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(product.id);
                        }}
                        aria-label={favorites.has(product.id) ? "Remove from favorites" : "Add to favorites"}
                        className="ml-2 text-yellow-500 hover:text-yellow-600"
                    >
                        <Star className={favorites.has(product.id) ? "fill-yellow-500" : ""} />
                    </button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                    <div className="text-2xl font-bold text-green-600">
                        ${(product.price / 100).toFixed(2)}
                    </div>
                    <Button
                        onClick={() => handlePayment(product)}
                        className="w-full flex items-center gap-2"
                    >
                        <CreditCard className="h-4 w-4" />
                        Process Payment
                    </Button>
                    </div>
                </CardContent>
                </Card>
            ))}
            </div>
        )}
        </div>
    );
};

export default ProductGrid;
