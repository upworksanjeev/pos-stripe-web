
// Mock data for demonstration purposes
export const mockProducts = [
  {
    id: 'prod_1',
    name: 'Premium Coffee',
    description: 'Artisan roasted coffee beans',
    price: '12.99',
    category: 'Beverages'
  },
  {
    id: 'prod_2',
    name: 'Wireless Headphones',
    description: 'High-quality bluetooth headphones',
    price: '89.99',
    category: 'Electronics'
  },
  {
    id: 'prod_3',
    name: 'Organic T-Shirt',
    description: '100% organic cotton t-shirt',
    price: '24.99',
    category: 'Clothing'
  },
  {
    id: 'prod_4',
    name: 'Digital Course',
    description: 'Online business course',
    price: '199.99',
    category: 'Education'
  },
  {
    id: 'prod_5',
    name: 'Gift Card',
    description: '$50 store gift card',
    price: '50.00',
    category: 'Gift Cards'
  },
  {
    id: 'prod_6',
    name: 'Monthly Subscription',
    description: 'Premium service subscription',
    price: '29.99',
    category: 'Subscriptions'
  }
];

export const mockInvoices = [
  {
    id: 'INV-001',
    customerEmail: 'john.doe@example.com',
    description: 'Web development services',
    amount: '2500.00',
    status: 'unpaid',
    dueDate: '2024-01-15'
  },
  {
    id: 'INV-002',
    customerEmail: 'jane.smith@example.com',
    description: 'Design consultation',
    amount: '750.00',
    status: 'paid',
    dueDate: '2024-01-10'
  },
  {
    id: 'INV-003',
    customerEmail: 'bob.wilson@example.com',
    description: 'Product photography',
    amount: '1200.00',
    status: 'unpaid',
    dueDate: '2024-01-20'
  },
  {
    id: 'INV-004',
    customerEmail: 'alice.brown@example.com',
    description: 'Marketing campaign',
    amount: '3200.00',
    status: 'unpaid',
    dueDate: '2024-01-25'
  }
];

export const mockCustomers = [
  {
    id: 'cus_1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    totalSpent: '5250.00',
    paymentMethods: 2
  },
  {
    id: 'cus_2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 234-5678',
    totalSpent: '1750.00',
    paymentMethods: 1
  },
  {
    id: 'cus_3',
    name: 'Bob Wilson',
    email: 'bob.wilson@example.com',
    phone: '+1 (555) 345-6789',
    totalSpent: '3200.00',
    paymentMethods: 3
  },
  {
    id: 'cus_4',
    name: 'Alice Brown',
    email: 'alice.brown@example.com',
    phone: '+1 (555) 456-7890',
    totalSpent: '8950.00',
    paymentMethods: 2
  },
  {
    id: 'cus_5',
    name: 'Charlie Davis',
    email: 'charlie.davis@example.com',
    phone: '+1 (555) 567-8901',
    totalSpent: '450.00',
    paymentMethods: 1
  }
];
