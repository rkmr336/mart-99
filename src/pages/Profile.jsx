import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Package, User, MapPin, Plus } from 'lucide-react';
import { logoutUser } from '../firebase/auth';
import { getUserAddresses, saveAddress } from '../firebase/firestore';
import { Link } from 'react-router-dom';
import AddressForm from '../components/AddressForm';

const Profile = () => {
  const { currentUser, userData } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    const fetchAddr = async () => {
      if (currentUser) {
        const addr = await getUserAddresses(currentUser.uid);
        setAddresses(addr);
      }
    };
    fetchAddr();
  }, [currentUser]);

  const handleAddressSave = async (data) => {
    if (currentUser) {
      await saveAddress(currentUser.uid, data);  // ✅ Firestore mein save karo
      const addr = await getUserAddresses(currentUser.uid);
      setAddresses(addr);
    }
    setShowAddressForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="md:w-1/4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col items-center text-center transition-colors">
            <div className="w-24 h-24 bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center mb-4 text-3xl font-bold">
              {userData?.name?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">{userData?.name || 'User'}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 transition-colors">{currentUser?.email}</p>
            
            <nav className="w-full space-y-2 text-left">
              <Link to="/profile" className="flex items-center space-x-3 p-3 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 font-medium transition-colors">
                <User className="w-5 h-5" /> <span>My Profile</span>
              </Link>
              <Link to="/orders" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white transition-colors">
                <Package className="w-5 h-5" /> <span>My Orders</span>
              </Link>
              <button onClick={() => logoutUser()} className="w-full flex items-center space-x-3 p-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-8">
                <LogOut className="w-5 h-5" /> <span>Sign Out</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="md:w-3/4 space-y-8">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center"><User className="mr-2" /> Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Full Name</label>
                <div className="p-3 bg-gray-50 dark:bg-slate-900/50 rounded-lg text-gray-900 dark:text-white font-medium border border-transparent dark:border-slate-700">{userData?.name || 'Not provided'}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email Address</label>
                <div className="p-3 bg-gray-50 dark:bg-slate-900/50 rounded-lg text-gray-900 dark:text-white font-medium border border-transparent dark:border-slate-700">{currentUser?.email}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <MapPin className="mr-2" /> Saved Addresses
              </h3>
              {!showAddressForm && (
                <button 
                  onClick={() => setShowAddressForm(true)}
                  className="flex items-center gap-1 text-sm bg-brand-50 hover:bg-brand-100 text-brand-700 px-3 py-1.5 rounded-lg font-medium transition-colors dark:bg-slate-700 dark:text-brand-400 dark:hover:bg-slate-600"
                >
                  <Plus className="w-4 h-4" /> Add New
                </button>
              )}
            </div>

            {showAddressForm ? (
              <div className="bg-gray-50 dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-700 relative">
                <button 
                  onClick={() => setShowAddressForm(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm font-medium"
                >Cancel</button>
                <h4 className="font-bold text-gray-900 dark:text-white mb-4">Add a new address</h4>
                <AddressForm 
                  onSubmit={handleAddressSave} 
                  showSaveCheckbox={true} 
                />
              </div>
            ) : addresses.length === 0 ? (
              <div className="text-gray-500 dark:text-gray-400 text-center py-8 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-gray-200 dark:border-slate-700 transition-colors">
                No saved addresses found. Add one for faster checkout.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div key={addr.id} className="p-4 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-900/30">
                    <p className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      {addr.name} 
                      <span className="text-[10px] uppercase tracking-wider bg-gray-200 dark:bg-slate-700 px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">
                        {addr.type || 'Home'}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] uppercase tracking-wider bg-brand-100 dark:bg-brand-900/40 px-2 py-0.5 rounded text-brand-700 dark:text-brand-400">
                          Default
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{addr.line1}, {addr.line2}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium">📞 {addr.phone}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Profile;
