import React, { memo } from 'react';

const OrderTimeline = memo(({ status }) => {
  const steps = [
    { label: 'Ordered', value: 'pending' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
  ];

  const currentStepIndex = steps.findIndex(step => step.value === status);

  return (
    <div className="py-4">
      <h3 className="text-lg font-semibold mb-4">Order Timeline</h3>
      <div className="flex items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.value}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStepIndex
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {index + 1}
              </div>
              <span className="text-xs mt-1">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  index < currentStepIndex ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
});

OrderTimeline.displayName = "OrderTimeline";

export default OrderTimeline;
