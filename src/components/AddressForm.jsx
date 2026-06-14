import { useState } from 'react';
import { validatePhone, validatePincode, isServiceable, validateName, DELIVERY_AREAS } from '../utils/validators';
import { MapPin } from 'lucide-react';

const PINCODE = "811311";

const AddressForm = ({ initialData, onSubmit, onCancel, showSaveCheckbox }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    line1: '',
    village: '',
    pincode: PINCODE,
    city: 'Halsi',
    state: 'Bihar',
    dist: 'Lakhisarai',
    type: 'Home',
    isDefault: false,
    ...initialData
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Village select hone pe city/state auto fill
    if (name === 'village') {
      const area = DELIVERY_AREAS.find(a => a.village === value);
      if (area) {
        setFormData(prev => ({
          ...prev,
          village: value,
          city: area.ps,
          state: area.state,
          dist: area.dist,
          pincode: PINCODE,
        }));
      }
      return;
    }

    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validateName(formData.name)) newErrors.name = 'Name must be at least 3 characters.';
    if (!validatePhone(formData.phone)) newErrors.phone = 'Enter valid 10-digit mobile number.';
    if (!formData.line1.trim()) newErrors.line1 = 'House/Flat details are required.';
    if (!formData.village) newErrors.village = 'Please select your village/area.';
    if (formData.pincode !== PINCODE) {
      newErrors.pincode = `Sorry, we only deliver to pincode ${PINCODE} (Lakhisarai, Bihar).`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // line2 auto-generate from village info
    const area = DELIVERY_AREAS.find(a => a.village === formData.village);
    const line2 = area
      ? `Vill-${area.village}, Post-${area.post}, P/S-${area.ps}, Dist-${area.dist}`
      : formData.village;

    onSubmit({ ...formData, line2 });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">

      {/* Delivery notice */}
      <div className="flex items-start gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3">
        <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-green-700 dark:text-green-400 font-medium">
          We currently deliver only to selected villages in <strong>Halsi, Lakhisarai (Bihar) — PIN 811311</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
          <input
            type="text" name="name" value={formData.name} onChange={handleChange}
            className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'} rounded-lg p-2.5 bg-white dark:bg-slate-800 text-gray-900 dark:text-white`}
            placeholder="e.g. Rohit Kumar"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number *</label>
          <input
            type="tel" name="phone" value={formData.phone} onChange={handleChange}
            className={`w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'} rounded-lg p-2.5 bg-white dark:bg-slate-800 text-gray-900 dark:text-white`}
            placeholder="10-digit mobile number"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        {/* House/Flat */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">House No. / Ghar ka Pata *</label>
          <input
            type="text" name="line1" value={formData.line1} onChange={handleChange}
            className={`w-full border ${errors.line1 ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'} rounded-lg p-2.5 bg-white dark:bg-slate-800 text-gray-900 dark:text-white`}
            placeholder="e.g. Near Hanuman Mandir, House No. 12"
          />
          {errors.line1 && <p className="text-red-500 text-xs mt-1">{errors.line1}</p>}
        </div>

        {/* Village Dropdown */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Village / Area *</label>
          <select
            name="village" value={formData.village} onChange={handleChange}
            className={`w-full border ${errors.village ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'} rounded-lg p-2.5 bg-white dark:bg-slate-800 text-gray-900 dark:text-white`}
          >
            <option value="">-- Apna village select karo --</option>
            {DELIVERY_AREAS.map(area => (
              <option key={area.village} value={area.village}>
                {area.village} (Post: {area.post})
              </option>
            ))}
          </select>
          {errors.village && <p className="text-red-500 text-xs mt-1">{errors.village}</p>}
        </div>

        {/* Pincode — fixed, readonly */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pincode</label>
          <input
            type="text" name="pincode" value={formData.pincode} readOnly
            className="w-full border border-gray-300 dark:border-slate-700 rounded-lg p-2.5 bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          />
        </div>

        {/* District — auto filled */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">District</label>
          <input
            type="text" value={formData.dist || 'Lakhisarai'} readOnly
            className="w-full border border-gray-300 dark:border-slate-700 rounded-lg p-2.5 bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          />
        </div>

        {/* State — auto filled */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
          <input
            type="text" value={formData.state || 'Bihar'} readOnly
            className="w-full border border-gray-300 dark:border-slate-700 rounded-lg p-2.5 bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          />
        </div>

        {/* Address Type */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address Type</label>
          <div className="flex gap-4">
            {['Home', 'Work', 'Other'].map(type => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio" name="type" value={type}
                  checked={formData.type === type} onChange={handleChange}
                  className="text-brand-600 focus:ring-brand-500 dark:bg-slate-800 border-gray-300 dark:border-slate-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Save checkbox */}
        {showSaveCheckbox && (
          <div className="md:col-span-2 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox" name="isDefault" checked={formData.isDefault} onChange={handleChange}
                className="text-brand-600 rounded focus:ring-brand-500 border-gray-300 dark:border-slate-600 dark:bg-slate-800"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Save this address for future orders</span>
            </label>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-700 mt-6">
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        )}
        <button type="submit" className="px-5 py-2 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors shadow-sm">
          Save & Continue
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
