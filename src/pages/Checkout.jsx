import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { createOrder, getUserAddresses, saveAddress } from '../firebase/firestore';
import { generateOrderId, calculateOrderPricing, getEstimatedDelivery } from '../utils/orderHelpers';
import AddressForm from '../components/AddressForm';
import PriceBreakdown from '../components/PriceBreakdown';

const Checkout = () => {
  const { currentUser } = useAuth();
  const { cart, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [addressData, setAddressData] = useState(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  useEffect(() => {
    if (cart.length === 0) {
      toast.error('Your cart is empty! Add items first');
      navigate('/products');
    }
  }, [cart, navigate]);
  
  useEffect(() => {
    const fetchAddresses = async () => {
      if (currentUser) {
        const addr = await getUserAddresses(currentUser.uid);
        setAddresses(addr);
        const defaultAddr = addr.find(a => a.isDefault) || addr[0];
        if (defaultAddr) setAddressData(defaultAddr);
      }
    };
    fetchAddresses();
  }, [currentUser]);

  const pricing = calculateOrderPricing(totalAmount);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (!addressData) return toast.error('Please provide a delivery address.');
    if (!acceptedTerms) return toast.error('Please accept the Terms & Conditions.');

    setLoading(true);

    if (paymentMethod === 'UPI') {
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error('Razorpay SDK failed to load. Are you online?');
        setLoading(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: pricing.total * 100, // Amount in paise
        currency: "INR",
        name: "Mart 99",
        description: "Grocery Order Payment",
        handler: async function (response) {
          await processOrder(response.razorpay_payment_id);
        },
        prefill: {
          name: addressData.name,
          email: currentUser?.email || 'test@example.com',
          contact: addressData.phone,
        },
        theme: {
          color: "#0284c7",
        },
        config: {
          display: {
            blocks: {
              upi: {
                name: "Pay via UPI / QR",
                instruments: [
                  { method: "upi" }
                ]
              }
            },
            sequence: ["block.upi", "block.other"],
            preferences: {
              show_default_blocks: true
            }
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response){
        toast.error('Payment Failed: ' + response.error.description);
        setLoading(false);
      });
      paymentObject.open();
    } else {
      await processOrder('COD');
    }
  };

  const processOrder = async (paymentId) => {
    try {
      const orderIdString = generateOrderId();
      
      const orderPayload = {
        orderId: orderIdString,
        userId: currentUser?.uid || 'guest',
        customerDetails: {
          name: addressData.name,
          phone: addressData.phone,
          email: currentUser?.email || '',
          address: {
            line1: addressData.line1,
            line2: addressData.line2,
            city: addressData.city,
            state: addressData.state,
            pincode: addressData.pincode,
            type: addressData.type || 'Home'
          }
        },
        items: cart.map(i => ({
          productId: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          subtotal: i.price * i.quantity,
          image: i.image || ''
        })),
        pricing: {
          subtotal: pricing.subtotal,
          cgst: pricing.cgst,
          sgst: pricing.sgst,
          gst: pricing.gst,
          deliveryCharge: pricing.deliveryCharge,
          total: pricing.total
        },
        paymentMethod: paymentMethod === 'COD' ? 'COD' : 'Online UPI',
        paymentId: paymentId === 'COD' ? null : paymentId,
        orderStatus: "pending",
        statusHistory: [{
          status: "pending",
          timestamp: new Date(),
          updatedBy: "system",
          note: `Order placed via ${paymentMethod}`
        }],
        deliveryDetails: {
          estimatedTime: getEstimatedDelivery(),
          actualDeliveryTime: null,
          codCollected: false
        }
      };

      const firestoreId = await createOrder(orderPayload);
      clearCart();
      toast.success('Order Placed Successfully!');
      navigate(`/success/${firestoreId}`, { state: { orderId: orderIdString, total: pricing.total, paymentMethod: paymentMethod === 'COD' ? 'COD' : 'Online UPI', estimatedDelivery: orderPayload.deliveryDetails.estimatedTime.toISOString() } });
      
    } catch (err) {
      console.error(err);
      toast.error('Network error creating order. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in slide-in-from-bottom-8">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 transition-colors">Complete Your Order</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-slate-700 pb-4">1. Delivery Address</h2>
            {addressData && addresses.length > 0 ? (
              <div className="p-4 border border-brand-200 dark:border-slate-600 rounded-xl bg-brand-50 dark:bg-slate-700/50 mb-4 relative">
                <p className="font-bold text-gray-900 dark:text-white">{addressData.name} <span className="ml-2 text-xs bg-gray-200 dark:bg-slate-600 px-2 py-0.5 rounded-full text-gray-800 dark:text-gray-200">{addressData.type || 'Home'}</span></p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{addressData.line1}, {addressData.line2}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{addressData.city}, {addressData.state} - {addressData.pincode}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 font-medium">{addressData.phone}</p>
                <button onClick={() => setAddressData(null)} className="absolute top-4 right-4 text-sm text-brand-600 font-semibold hover:underline">Change</button>
              </div>
            ) : (
              <AddressForm 
                  onSubmit={async (data) => {
                    setAddressData(data);
                    // Agar "Save this address" checkbox tick hai toh Firestore mein save karo
                    if (data.isDefault && currentUser) {
                      await saveAddress(currentUser.uid, data);
                      toast.success('Address saved to your profile!');
                    }
                  }} 
                  showSaveCheckbox={true} 
                />
            )}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
             <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-slate-700 pb-4">2. Payment Method</h2>
             
             <div className="space-y-3">
               <label className={`border-2 rounded-xl p-4 flex items-start gap-4 cursor-pointer transition-colors ${paymentMethod === 'COD' ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/10' : 'border-gray-200 dark:border-slate-700 hover:border-brand-300'}`}>
                 <input type="radio" name="paymentMethod" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} className="mt-1 w-5 h-5 text-brand-600 focus:ring-brand-500" />
                 <div>
                   <p className="font-bold text-gray-900 dark:text-white">Cash on Delivery (COD)</p>
                   <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pay with cash when your order is delivered to your doorstep.</p>
                   {paymentMethod === 'COD' && <span className="inline-block mt-2 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 px-2.5 py-0.5 rounded">No advance payment required</span>}
                 </div>
               </label>

               <label className={`border-2 rounded-xl p-4 flex items-start gap-4 cursor-pointer transition-colors ${paymentMethod === 'UPI' ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/10' : 'border-gray-200 dark:border-slate-700 hover:border-brand-300'}`}>
                 <input type="radio" name="paymentMethod" value="UPI" checked={paymentMethod === 'UPI'} onChange={(e) => setPaymentMethod(e.target.value)} className="mt-1 w-5 h-5 text-brand-600 focus:ring-brand-500" />
                 <div>
                   <p className="font-bold text-gray-900 dark:text-white">Pay Online (UPI / Card) - Razorpay</p>
                   <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pay securely via Razorpay Demo environment.</p>
                 </div>
               </label>
             </div>
          </div>

        </div>
        
        <div>
          <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 sticky top-24 transition-colors shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>
            <div className="flow-root mb-6 max-h-[40vh] overflow-y-auto pr-2">
              <ul role="list" className="-my-4 divide-y divide-gray-200 dark:divide-slate-700">
                {cart.map((item) => (
                  <li key={item.id} className="flex items-center py-4">
                    <img src={item.image || 'https://via.placeholder.com/150'} alt={item.name} className="h-14 w-14 rounded-lg object-cover border border-gray-200 dark:border-slate-700" />
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white">₹{item.price * item.quantity}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-gray-100 dark:border-slate-700 mb-6">
              <PriceBreakdown subtotal={totalAmount} />
            </div>
            
            <div className="mb-6 flex items-start gap-3">
              <input 
                type="checkbox" 
                id="terms" 
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 text-brand-600 rounded focus:ring-brand-500 bg-white border-gray-300 cursor-pointer" 
              />
              <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                I agree to the <a href="#" className="text-brand-600 hover:underline">Terms & Conditions</a> and <a href="#" className="text-brand-600 hover:underline">Privacy Policy</a>
              </label>
            </div>

            <button 
              onClick={handlePlaceOrder}
              disabled={loading || !addressData || !acceptedTerms || cart.length === 0} 
              className={`w-full font-bold py-4 px-4 rounded-xl shadow-md transition-all flex justify-center items-center gap-2 ${
                (loading || !addressData || !acceptedTerms || cart.length === 0)
                  ? 'bg-gray-300 dark:bg-slate-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-brand-600 hover:bg-brand-700 text-white hover:-translate-y-0.5'
              }`}
            >
              {loading ? (
                <><div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div> Creating your order...</>
              ) : (
                `Place Order - Pay ₹${pricing.total} ${paymentMethod === 'COD' ? 'on Delivery' : 'Now'}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

