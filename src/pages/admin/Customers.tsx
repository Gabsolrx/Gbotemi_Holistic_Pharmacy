import { useState, useEffect } from 'react';
import { Users, Search, ShieldCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Badge } from '../../components/ui/Badge';
import toast from 'react-hot-toast';

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  created_at: string;
}

const mockCustomers: Profile[] = [
  {
    id: 'usr-1a2b3c',
    first_name: 'Babatunde',
    last_name: 'Ogunleye',
    phone: '08012345678',
    role: 'customer',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString()
  },
  {
    id: 'usr-4d5e6f',
    first_name: 'Chiamaka',
    last_name: 'Nwachukwu',
    phone: '09087654321',
    role: 'customer',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
  }
];

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        let loadedCustomers = data || [];
        
        // Add mock customers if list is empty (for testing)
        if (loadedCustomers.length === 0) {
          loadedCustomers = mockCustomers;
        }

        setCustomers(loadedCustomers);
      } catch (err: any) {
        toast.error('Failed to load customers from DB, using mock data');
        setCustomers(mockCustomers);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers
    .filter(c => c.role !== 'super_admin') // Exclude super_admin
    .filter(c => 
      `${c.first_name} ${c.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone?.includes(searchTerm) ||
      c.role.includes(searchTerm.toLowerCase())
    );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Directory</h1>
          <p className="text-sm text-slate-500 mt-1">View registered users and patient profiles.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, phone, or role..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white shadow-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Customer Name</th>
                <th className="px-6 py-4">Phone Number</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    Loading customers...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    <Users className="mx-auto text-slate-300 mb-2" size={32} />
                    <p className="font-medium text-slate-700">No customers found.</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{customer.first_name} {customer.last_name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{customer.id.substring(0, 8)}...</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {customer.phone || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <Badge 
                        variant={
                          customer.role === 'admin' ? 'info' : 
                          customer.role === 'pharmacist' ? 'warning' : 'default'
                        }
                      >
                        {customer.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
