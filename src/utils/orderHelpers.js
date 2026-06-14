// Order ID generation
export const generateOrderId = () => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `RM99-${day}${month}${year}-${random}`;
};

// GST calculation
export const calculateGST = (subtotal) => {
  const cgst = Math.round(subtotal * 0.05);
  const sgst = Math.round(subtotal * 0.05);
  return { cgst, sgst, gst: cgst + sgst }; // Return separated details
};

// Delivery charge calculation
export const calculateDeliveryCharge = (subtotal) => {
  return subtotal >= 500 ? 0 : 40;
};

// Estimated delivery time
export const getEstimatedDelivery = () => {
  const now = new Date();
  now.setHours(now.getHours() + 3);  // 3 hours from now
  return now;
};

// Total calculation wrapper
export const calculateOrderPricing = (subtotal) => {
    const { cgst, sgst, gst } = calculateGST(subtotal);
    const deliveryCharge = calculateDeliveryCharge(subtotal);
    return {
        subtotal,
        cgst,
        sgst,
        gst,
        deliveryCharge,
        total: subtotal + gst + deliveryCharge
    };
};

// Format currency
export const formatCurrency = (amount) => {
  return `₹${amount.toLocaleString('en-IN')}`;
};
