import React, { useCallback, useEffect, useState } from 'react';
import { shape, func } from 'prop-types';
import _get from 'lodash.get';
import Modal from 'react-modal'; // Import the modal library
import { paymentMethodShape } from '../../../../utils/payment';
import RadioInput from '../../../../components/common/Form/RadioInput';
import usePerformPlaceOrder from '../hooks/usePerformPlaceOrder';
import usePayOneCheckoutFormContext from '../hooks/usePayOneCheckoutFormContext';
import usePayOneCartContext from '../hooks/usePayOneCartContext';
import { getPayOneBaseConfig } from '../utility/payOneBaseConfig';

import usePaymentMethodCartContext from '../../../../components/paymentMethod/hooks/usePaymentMethodCartContext';
import usePaymentMethodFormContext from '../../../../components/paymentMethod/hooks/usePaymentMethodFormContext';

function WindCave({ method, selected, actions }) {
  const { orderId } = usePayOneCartContext();
  const { registerPaymentAction } = usePayOneCheckoutFormContext();
  const { submitHandler } = usePaymentMethodFormContext();
  const isSelected = method.code === selected.code;
  const performPlaceOrder = usePerformPlaceOrder(method.code);
  const { methodList } = usePaymentMethodCartContext();
  const placeOrderWithPayPal = useCallback(
    (values) => performPlaceOrder(values),
    [performPlaceOrder]
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    registerPaymentAction(method.code, placeOrderWithPayPal);
  }, [method, registerPaymentAction, placeOrderWithPayPal]);
  console.log(getPayOneBaseConfig);
  console.log('getPayOneBaseConfig.pxpay2iframe');
  useEffect(() => {
    console.log('use effect test', orderId);
    if (orderId) {
      setIsModalOpen(true);
    }
  }, [orderId]);

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handlePaymentMethodSelection = async (event) => {
    const methodSelected = _get(methodList, `${event.target.value}.code`);
    await actions.change(event);
    await submitHandler(methodSelected);
  };

  if (!isSelected) {
    return (
      <RadioInput
        value={method.code}
        label={method.title}
        name="paymentMethod"
        checked={isSelected}
        onChange={handlePaymentMethodSelection}
      />
    );
  }
  return (
    <div>
      <div>
        <RadioInput
          value={method.code}
          label={method.title}
          name="paymentMethod"
          checked={isSelected}
          onChange={handlePaymentMethodSelection}
        />
        {orderId && (
          <div>
            <h1>orderdata</h1>
            {/* Modal component */}
            <Modal
              isOpen={isModalOpen}
              onRequestClose={closeModal}
              contentLabel="Example Modal"
              style={{
                overlay: {
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.75)',
                },
                content: {
                  position: 'absolute',
                  top: '40px',
                  left: '40px',
                  right: '40px',
                  bottom: '40px',
                  border: '1px solid #ccc',
                  background: '#fff',
                  overflow: 'auto',
                  WebkitOverflowScrolling: 'touch',
                  borderRadius: '4px',
                  outline: 'none',
                  padding: '20px',
                },
              }}
            >
              {/* Your iframe code goes here */}
              <iframe
                title="Your IFrame"
                src="https://www.example.com/"
                width="600"
                height="400"
              />
              <button type="button" onClick={closeModal}>
                Close Modal
              </button>
            </Modal>
          </div>
        )}
      </div>
    </div>
  );
}
WindCave.propTypes = {
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
  actions: shape({ change: func }).isRequired,
};
export default WindCave;
