import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, CreditCard } from 'lucide-react';

interface InvoicePaymentProps {
  readerID?: string | null;
}

const InvoicePayment = ({ readerID }: InvoicePaymentProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('none'); // none, status, dueDate, amountRange
  const [amountRange, setAmountRange] = useState({ min: '', max: '' });
  const [dueDateRange, setDueDateRange] = useState({ from: '', to: '' });
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState('name'); // name, status, dueDate, amount

  const fetchInvoices = async () => {
    setLoading(true);
    try {
        const res = await fetch("http://localhost:4242/api/invoices");
        const data = await res.json();
        setInvoices(data || []);
        setFilteredInvoices(data || []);
    } catch (err) {
        console.error("Failed to load invoices:", err);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);


  const handleFilter = () => {
    let filtered = invoices;

    if (filterType === 'none') {
      if (searchTerm.trim() !== '') {
        filtered = filtered.filter(inv =>
          inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (inv.customer_name && inv.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (inv.customer_email && inv.customer_email.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
    } else if (filterType === 'status') {
      if (searchTerm.trim() !== '') {
        filtered = filtered.filter(inv => inv.status.toLowerCase() === searchTerm.toLowerCase());
      }
    } else if (filterType === 'dueDate') {
      const fromTimestamp = dueDateRange.from ? new Date(dueDateRange.from).getTime() / 1000 : null;
      const toTimestamp = dueDateRange.to ? new Date(dueDateRange.to).getTime() / 1000 : null;
      if (fromTimestamp) {
        filtered = filtered.filter(inv => inv.due_date >= fromTimestamp);
      }
      if (toTimestamp) {
        filtered = filtered.filter(inv => inv.due_date <= toTimestamp);
      }
    } else if (filterType === 'amountRange') {
      const min = amountRange.min ? parseFloat(amountRange.min) : null;
      const max = amountRange.max ? parseFloat(amountRange.max) : null;
      if (min !== null) {
        filtered = filtered.filter(inv => (inv.amount_due / 100) >= min);
      }
      if (max !== null) {
        filtered = filtered.filter(inv => (inv.amount_due / 100) <= max);
      }
    }

    // Apply sorting
    if (sortOption === 'name') {
      filtered = filtered.sort((a, b) => a.customer_name.localeCompare(b.customer_name));
    } else if (sortOption === 'status') {
      filtered = filtered.sort((a, b) => a.status.localeCompare(b.status));
    } else if (sortOption === 'dueDate') {
      filtered = filtered.sort((a, b) => a.due_date - b.due_date);
    } else if (sortOption === 'amount') {
      filtered = filtered.sort((a, b) => (b.amount_due / 100) - (a.amount_due / 100));
    }

    setFilteredInvoices(filtered);
  };

  // Run filter automatically when sortOption changes or filter inputs change
  useEffect(() => {
    handleFilter();
  }, [sortOption, searchTerm, filterType, amountRange, dueDateRange]);

  const handlePayInvoice = (invoice: any) => {
    alert(`Processing payment for invoice ${invoice.id} - $${(invoice.amount_due / 100).toFixed(2)}`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <FileText className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h2 className="text-3xl font-bold">Invoice Payment</h2>
        <p className="text-gray-600">Look up and collect payment for existing invoices</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Invoices</CardTitle>
          <CardDescription>Filter invoices by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="none">Search by ID/Name/Email</option>
              <option value="status">Status</option>
              <option value="dueDate">Due Date Range</option>
              <option value="amountRange">Amount Range</option>
            </select>
            {filterType === 'dueDate' && (
              <div className="flex gap-2 mt-2 md:mt-0">
                <Input
                  type="date"
                  value={dueDateRange.from}
                  onChange={(e) => setDueDateRange({ ...dueDateRange, from: e.target.value })}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="From"
                />
                <Input
                  type="date"
                  value={dueDateRange.to}
                  onChange={(e) => setDueDateRange({ ...dueDateRange, to: e.target.value })}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="To"
                />
              </div>
            )}
            {filterType === 'amountRange' && (
              <div className="flex gap-2 mt-2 md:mt-0">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amountRange.min}
                  onChange={(e) => setAmountRange({ ...amountRange, min: e.target.value })}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Min"
                />
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amountRange.max}
                  onChange={(e) => setAmountRange({ ...amountRange, max: e.target.value })}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Max"
                />
              </div>
            )}
            {(filterType === 'none' || filterType === 'status') && (
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder={filterType === 'status' ? 'Status (e.g. open, paid)' : 'Search...'}
              />
            )}
          </div>
          <div className="flex gap-4 items-center mb-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="sortOption"
                value="name"
                checked={sortOption === 'name'}
                onChange={(e) => setSortOption(e.target.value)}
                className="form-radio"
              />
              <span className="ml-2">Name</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="sortOption"
                value="status"
                checked={sortOption === 'status'}
                onChange={(e) => setSortOption(e.target.value)}
                className="form-radio"
              />
              <span className="ml-2">Status</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="sortOption"
                value="dueDate"
                checked={sortOption === 'dueDate'}
                onChange={(e) => setSortOption(e.target.value)}
                className="form-radio"
              />
              <span className="ml-2">Due Date</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="sortOption"
                value="amount"
                checked={sortOption === 'amount'}
                onChange={(e) => setSortOption(e.target.value)}
                className="form-radio"
              />
              <span className="ml-2">Amount</span>
            </label>
          </div>
          <Button onClick={handleFilter} variant="secondary">
            <Search className="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
        </CardContent>
      </Card>

      {/* Invoice Results */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading invoices...</div>
      ) : (
        <div className="grid gap-4">
          {filteredInvoices.map((invoice) => (
            <Card key={invoice.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Invoice #{invoice.id}</h3>
                      <Badge variant={invoice.status === 'paid' ? 'default' : 'destructive'}>
                        {invoice.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{invoice.description}</p>
                    <p className="text-sm text-gray-500">Customer: {invoice.customer_name}</p>
                    <p className="text-sm text-gray-500">Email: {invoice.customer_email}</p>
                    <p className="text-sm text-gray-500">Due: { new Date(invoice.due_date * 1000).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right space-y-8">
                    <div className="text-2xl font-bold">${(invoice.amount_due / 100).toFixed(2)}</div>
                    {(invoice.status === 'open' || invoice.status === 'overdue') && (
                      <Button 
                        onClick={() => handlePayInvoice(invoice)}
                        className="flex items-center gap-2"
                      >
                        <CreditCard className="h-4 w-4" />
                        Collect Payment
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredInvoices.length === 0 && !loading && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">No invoices found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default InvoicePayment;
