import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Users, Mail, Phone, CreditCard } from 'lucide-react';
import { endPoint } from '@/lib/utils';

interface CustomerLookupProps {
  readerID?: string | null;
}

const CustomerLookup = ({ readerID }: CustomerLookupProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [allCustomers, setAllCustomers] = useState<any[]>([]);
    const [sortOption, setSortOption] = useState('name'); // name, recentPayment

    const fetchAllCustomers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${endPoint}/api/customers`);
            const data = await res.json();
            setAllCustomers(data || []);
            setFilteredCustomers(data || []);
        } catch (err) {
            console.error("Failed to load customers:", err);
        } finally {
            setLoading(false);
        }
    };

   


    useEffect(() => {
        fetchAllCustomers();
    }, []);

    const handleSearch = () => {
        if (!searchTerm.trim()) {
            setFilteredCustomers(allCustomers);
            return;
        }
        const filtered = allCustomers.filter(customer =>
            customer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (customer.name && customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (customer.phone && customer.phone.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredCustomers(filtered);
    };

    // Sort filtered customers based on sortOption
    const sortedCustomers = [...filteredCustomers];
    if (sortOption === 'name') {
      sortedCustomers.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sortOption === 'recentPayment') {
      // Assuming customer has a last_payment_date field as timestamp (seconds)
      sortedCustomers.sort((a, b) => {
        const aDate = a.last_payment_date || 0;
        const bDate = b.last_payment_date || 0;
        return bDate - aDate;
      });
    }

    const handleCustomPayment = (customer: any) => {
        alert(`Creating custom payment for ${customer.name || customer.email}`);
    };

    return (
        <div className="space-y-6">
        <div className="text-center">
            <Users className="mx-auto h-12 w-12 text-purple-600 mb-4" />
            <h2 className="text-3xl font-bold">Customer Lookup</h2>
            <p className="text-gray-600">Search and manage your Stripe customers</p>
        </div>

        <Card>
            <CardHeader>
            <CardTitle>Search Customers</CardTitle>
            <CardDescription>Search by ID, name, email, or phone</CardDescription>
            </CardHeader>
            <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                <Input
                placeholder="Enter customer ID, name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} variant="secondary" disabled={loading}>
                <Search className="h-4 w-4" />
                </Button>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mt-2 md:mt-0"
                >
                  <option value="name">Sort by Name (A-Z)</option>
                  <option value="recentPayment">Sort by Most Recent Payment</option>
                </select>
            </div>
            </CardContent>
        </Card>

        <div className="grid gap-4">
            {sortedCustomers.map((customer) => (
            <Card key={customer.id}>
                <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div className="space-y-3">
                    <div>
                        <h3 className="font-semibold text-lg">{customer.name || '(No name)'}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {customer.email || 'N/A'}
                        </div>
                        <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {customer.phone || 'N/A'}
                        </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline">ID: {customer.id}</Badge>
                    </div>
                    </div>
                    <div className="space-y-2">
                    <Button
                        onClick={() => handleCustomPayment(customer)}
                        className="flex items-center gap-2"
                    >
                        <CreditCard className="h-4 w-4" />
                        Create Payment
                    </Button>
                    </div>
                </div>
                </CardContent>
            </Card>
            ))}
        </div>

        {filteredCustomers.length === 0 && !loading && (
            <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No customers found matching your search.</p>
            </div>
        )}
        </div>
    );
};

export default CustomerLookup;
