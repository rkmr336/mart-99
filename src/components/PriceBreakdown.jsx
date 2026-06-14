import { calculateOrderPricing, formatCurrency } from '../utils/orderHelpers';

const PriceBreakdown = ({ subtotal, showGSTBreakdown = true }) => {
  const { cgst, sgst, deliveryCharge, total } = calculateOrderPricing(subtotal);

  return (
    <div className="space-y-3 text-sm">
      <div className="flex justify-between text-gray-600 dark:text-gray-400">
        <span>Subtotal</span>
        <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(subtotal)}</span>
      </div>
      
      {showGSTBreakdown && (
        <>
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>CGST (5%)</span>
            <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(cgst)}</span>
          </div>
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>SGST (5%)</span>
            <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(sgst)}</span>
          </div>
        </>
      )}

      <div className="flex justify-between text-gray-600 dark:text-gray-400">
        <span>Delivery Charge</span>
        <span className={`font-medium ${deliveryCharge === 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
          {deliveryCharge === 0 ? 'FREE' : formatCurrency(deliveryCharge)}
        </span>
      </div>

      <div className="border-t border-gray-200 dark:border-slate-700 pt-3 mt-3 flex justify-between items-center text-lg font-bold text-gray-900 dark:text-white">
        <span>Grand Total</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  );
};

export default PriceBreakdown;
