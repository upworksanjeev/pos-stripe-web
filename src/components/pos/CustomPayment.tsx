import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { CreditCard, DollarSign } from 'lucide-react';

interface CustomPaymentProps {
  readerID?: string | null;
}

const CustomPayment = ({ readerID }: CustomPaymentProps) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = parseFloat(amount);
    if (!finalAmount || finalAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const response = await fetch("http://localhost:4242/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        type: "custom",
        amount: finalAmount,
        metadata: { description, customerEmail }
      })
    });
    const result = await response.json();
    
    const res2 = await fetch("http://localhost:4242/api/process-payment", {
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


  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <DollarSign className="mx-auto h-14 w-14 text-green-600 mb-3" />
        <h2 className="text-4xl font-extrabold text-gray-900">Custom Payment</h2>
        <p className="text-gray-600 mt-2">Process a one-time payment for any amount</p>
      </div>

      <Card className="shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Payment Details</CardTitle>
          <CardDescription className="text-gray-500">Enter the payment information below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePayment} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <Label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Customer Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="customer@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div>
                <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Payment description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border border-gray-300 rounded-md resize-none"
                />
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button type="submit" size="lg" className="flex items-center gap-3 px-10 bg-green-600 hover:bg-green-700 focus:ring-green-500">
                <CreditCard className="h-6 w-6" />
                Process Payment ${amount || '0.00'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomPayment;
