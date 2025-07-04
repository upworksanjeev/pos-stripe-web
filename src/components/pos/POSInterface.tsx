import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, ShoppingCart, DollarSign, FileText, Users, Plug } from 'lucide-react';
import ProductGrid from './ProductGrid';
import CustomPayment from './CustomPayment';
import InvoicePayment from './InvoicePayment';
import CustomerLookup from './CustomerLookup';
import StripeReaderSelector from './StripeReaderSelector';

interface POSInterfaceProps {
  onLogout: () => void;
}

const POSInterface = ({ onLogout }: POSInterfaceProps) => {
    const [activeTab, setActiveTab] = useState('products');
    const [isReaderSelectorOpen, setIsReaderSelectorOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    const [registrationCode, setRegistrationCode] = useState('allows-accuracy-header');
    const [label, setLabel] = useState('Event');
    const [line1, setLine1] = useState('');
    const [city, setCity] = useState('Reno');
    const [state, setState] = useState('NV');
    const [country, setCountry] = useState('US');
    const [zipCode, setZipCode] = useState('89503');
    const [locationId, setLocationId] = useState('tml_Es7zFgTfIm8FUN');
    const [readerID, setReaderID] = useState<string | null>(null);

    const usStates = [
      { code: 'AL', name: 'Alabama' },
      { code: 'AK', name: 'Alaska' },
      { code: 'AZ', name: 'Arizona' },
      { code: 'AR', name: 'Arkansas' },
      { code: 'CA', name: 'California' },
      { code: 'CO', name: 'Colorado' },
      { code: 'CT', name: 'Connecticut' },
      { code: 'DE', name: 'Delaware' },
      { code: 'FL', name: 'Florida' },
      { code: 'GA', name: 'Georgia' },
      { code: 'HI', name: 'Hawaii' },
      { code: 'ID', name: 'Idaho' },
      { code: 'IL', name: 'Illinois' },
      { code: 'IN', name: 'Indiana' },
      { code: 'IA', name: 'Iowa' },
      { code: 'KS', name: 'Kansas' },
      { code: 'KY', name: 'Kentucky' },
      { code: 'LA', name: 'Louisiana' },
      { code: 'ME', name: 'Maine' },
      { code: 'MD', name: 'Maryland' },
      { code: 'MA', name: 'Massachusetts' },
      { code: 'MI', name: 'Michigan' },
      { code: 'MN', name: 'Minnesota' },
      { code: 'MS', name: 'Mississippi' },
      { code: 'MO', name: 'Missouri' },
      { code: 'MT', name: 'Montana' },
      { code: 'NE', name: 'Nebraska' },
      { code: 'NV', name: 'Nevada' },
      { code: 'NH', name: 'New Hampshire' },
      { code: 'NJ', name: 'New Jersey' },
      { code: 'NM', name: 'New Mexico' },
      { code: 'NY', name: 'New York' },
      { code: 'NC', name: 'North Carolina' },
      { code: 'ND', name: 'North Dakota' },
      { code: 'OH', name: 'Ohio' },
      { code: 'OK', name: 'Oklahoma' },
      { code: 'OR', name: 'Oregon' },
      { code: 'PA', name: 'Pennsylvania' },
      { code: 'RI', name: 'Rhode Island' },
      { code: 'SC', name: 'South Carolina' },
      { code: 'SD', name: 'South Dakota' },
      { code: 'TN', name: 'Tennessee' },
      { code: 'TX', name: 'Texas' },
      { code: 'UT', name: 'Utah' },
      { code: 'VT', name: 'Vermont' },
      { code: 'VA', name: 'Virginia' },
      { code: 'WA', name: 'Washington' },
      { code: 'WV', name: 'West Virginia' },
      { code: 'WI', name: 'Wisconsin' },
      { code: 'WY', name: 'Wyoming' },
    ];


    const handleConnectClick = () => {
      setIsReaderSelectorOpen(true);
    };

    const handleRegisterClick = () => {
      setIsRegisterOpen(true);
    };

    const handleRegisterClose = () => {
      setIsRegisterOpen(false);
    };

    const handleRegisterSubmit = async () => {
      try {
        if (!locationId) {
          throw new Error('Location ID is required for registering reader.');
        }
        const response = await fetch(`${endPoint}/api/register-reader`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            registration_code: registrationCode,
            location_id: locationId,
          }),
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Reader registered:', data);
        setReaderID(data.id);
      } catch (error) {
        console.error('Failed to register reader:', error);
      }
      setIsRegisterOpen(false);
    };

    const handleReaderConnect = (reader: any) => {
      console.log('Connected to reader:', reader);
      // You can add additional logic here after successful connection
    };

    const handleReaderSelectorClose = () => {
      setIsReaderSelectorOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <h1 className="text-2xl font-bold text-gray-900">Stripe POS</h1>
                <Button
                  variant="outline"
                  style={{ marginRight: '30px' }}
                  onClick={handleRegisterClick}
                  className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  Register
                </Button>
                <Button
                  variant="outline"
                  onClick={handleConnectClick}
                  className="flex items-center gap-2 mr-4 px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  <Plug className="h-4 w-4" />
                  Connect
                </Button>
                <Button
                  variant="outline"
                  onClick={onLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
            </div>
            </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
                <TabsTrigger value="products" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Products
                </TabsTrigger>
                <TabsTrigger value="custom" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Custom Payment
                </TabsTrigger>
                <TabsTrigger value="invoices" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Invoices
                </TabsTrigger>
                <TabsTrigger value="customers" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Customers
                </TabsTrigger>
            </TabsList>

            <TabsContent value="products">
                <ProductGrid readerID={readerID} />
            </TabsContent>

            <TabsContent value="custom">
                <CustomPayment readerID={readerID} />
            </TabsContent>

            <TabsContent value="invoices">
                <InvoicePayment readerID={readerID} />
            </TabsContent>

            <TabsContent value="customers">
                <CustomerLookup readerID={readerID} />
            </TabsContent>
            </Tabs>
        </main>

        <StripeReaderSelector
          isOpen={isReaderSelectorOpen}
          onClose={handleReaderSelectorClose}
          onConnect={handleReaderConnect}
        />

        {/* Registration Modal */}
        {isRegisterOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">Register</h2>
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleRegisterSubmit(); }}>
                {/* Part 1: Pairing Code */}
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Pairing Code</label>
                  <input
                    type="text"
                    value={registrationCode}
                    onChange={(e) => setRegistrationCode(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    required
                  />
                </div>

                {/* Part 2: Label */}
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Label</label>
                  <input
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    required
                  />
                </div>

                {/* Part 3: Address */}
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Address</label>
                  <input
                    type="text"
                    placeholder="Line 1"
                    value={line1}
                    onChange={(e) => setLine1(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    required
                  />
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block mb-2 font-semibold text-gray-700">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-semibold text-gray-700">State</label>
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                        required
                      >
                        <option value="" disabled>Select a state</option>
                        {usStates.map((s) => (
                          <option key={s.code} value={s.code}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block mb-2 font-semibold text-gray-700">Country</label>
                      <input
                        type="text"
                        value={country}
                        readOnly
                        className="w-full border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-semibold text-gray-700">Zip Code</label>
                      <input
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                        required
                      />
                    </div>
                  </div>
                    <Button
                      type="button"
                      onClick={async () => {
                        try {
                          console.log(label);
                          const response = await fetch(`${endPoint}/api/create-location`, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              label: label,
                              line1: line1,
                              city: city,
                              state: state,
                              country: country,
                              postal_code: zipCode,
                            }),
                          });
                          const data = await response.json();
                          console.log("XXX");
                          console.log(data);
                          setLocationId(data.id);
                        } catch (error) {
                          console.error('Error creating location:', error);
                          setLocationId('Error');
                        }
                      }}
                      className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                    >
                      Get Location ID
                    </Button>
                    {locationId && (
                      <span className="ml-4 text-gray-700 font-medium">Location ID: {locationId}</span>
                    )}
                </div>

                <div className="flex justify-end space-x-4">
                  <Button variant="outline" onClick={handleRegisterClose}>
                    Cancel
                  </Button>
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </div>
          </div>
        )}
        </div>
    );
};

export default POSInterface;
