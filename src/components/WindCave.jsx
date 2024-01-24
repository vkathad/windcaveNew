import React, { useCallback, useEffect, useState } from 'react';
import { shape, func } from 'prop-types';
import _get from 'lodash.get';
import Modal from 'react-modal'; // Import the modal library
import { paymentMethodShape } from '../../../../utils/payment';
import RadioInput from '../../../../components/common/Form/RadioInput';
import usePerformPlaceOrder from '../hooks/usePerformPlaceOrder';
import usePayOneCheckoutFormContext from '../hooks/usePayOneCheckoutFormContext';
import usePayOneCartContext from '../hooks/usePayOneCartContext';
import { config } from '../../../../config';

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
  const [iframeUrl, setIframeUrl] = useState(null);
  useEffect(() => {
    registerPaymentAction(method.code, placeOrderWithPayPal);
  }, [method, registerPaymentAction, placeOrderWithPayPal]);
  const getIframeUrl = async () => {
    const response = await fetch(
      `${config.baseUrl}/bgpayment/windcave/iframeurl`
    );
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const data = await response.json();
    // if (data && data.error) {
    //   setErrorMessage(data.message);
    //   return;
    // }
    setIframeUrl(data.redirect_uri);
    setIsModalOpen(true);
  };

  useEffect(() => {
    console.log('use effect test', orderId);
    if (orderId) {
      getIframeUrl();
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
              shouldCloseOnOverlayClick={false}
            >
              {/* Your iframe code goes here */}
              <iframe
                title="Your IFrame"
                src={iframeUrl}
                width="100%"
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
