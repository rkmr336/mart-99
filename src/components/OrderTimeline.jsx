import { CheckCircle, Circle, Check } from 'lucide-react';
import { STATUS_LABELS } from '../utils/constants';

const OrderTimeline = ({ currentStatus, statusHistory = [] }) => {
  const STAGES = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
  
  // Find current index
  let currentIndex = STAGES.indexOf(currentStatus);
  if (currentStatus === 'cancelled') currentIndex = -1; // Specific handling for cancelled

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {STAGES.map((stage, stageIdx) => {
          const isComplete = STAGES.indexOf(stage) <= currentIndex;
          const isCurrent = STAGES.indexOf(stage) === currentIndex;
          const isLast = stageIdx === STAGES.length - 1;
          
          // Find history entry if completed
          const historyEntry = statusHistory.find(h => h.status === stage);

          return (
            <li key={stage}>
              <div className="relative pb-8">
                {!isLast ? (
                  <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-slate-700" aria-hidden="true" />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-slate-800 ${isComplete ? 'bg-green-500' : 'bg-gray-200 dark:bg-slate-700'}`}>
                      {isComplete ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-400" />
                      )}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className={`text-sm font-medium ${isCurrent ? 'text-gray-900 dark:text-white font-bold' : isComplete ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>
                        {STATUS_LABELS[stage] ? STATUS_LABELS[stage].replace(/[^a-zA-Z ]/g, '') : stage}
                      </p>
                      {historyEntry?.note && (
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{historyEntry.note}</p>
                      )}
                    </div>
                    {historyEntry?.timestamp && (
                      <div className="whitespace-nowrap text-right text-xs text-gray-500 dark:text-gray-400">
                        {new Date(historyEntry.timestamp.toDate()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      
      {currentStatus === 'cancelled' && (
        <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/50">
          <div className="flex">
            <div className="flex-shrink-0">
              <Circle className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-400">Order Cancelled</h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>This order has been cancelled and will not be delivered.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTimeline;
