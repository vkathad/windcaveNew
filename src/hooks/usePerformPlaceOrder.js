import { useCallback } from 'react';
import _get from 'lodash.get';
import _set from 'lodash.set';
import { LOGIN_FORM } from '../../../../config';

import usePayOneAppContext from './usePayOneAppContext';
import usePayOneCartContext from './usePayOneCartContext';
import { _isObjEmpty } from '../utility';

export default function usePerformPlaceOrder(paymentMethodCode) {
  const { cartId, setRestPaymentMethod, setOrderInfo } = usePayOneCartContext();
  const { isLoggedIn, setPageLoader, setErrorMessage } = usePayOneAppContext();
  return useCallback(
    async (values, additionalData, extensionAttributes = {}) => {
      try {
        const email = _get(values, `${LOGIN_FORM}.email`);
        const paymentMethodData = {
          paymentMethod: {
            method: paymentMethodCode,
            additional_data: additionalData,
          },
        };

        if (!_isObjEmpty(extensionAttributes)) {
          _set(paymentMethodData, 'paymentMethod.extension_attributes', {
            ...extensionAttributes,
          });
        }

        if (!isLoggedIn) {
          _set(paymentMethodData, 'email', email);
        } else {
          _set(paymentMethodData, 'cartId', cartId);
        }

        setPageLoader(true);
        const order = await setRestPaymentMethod(paymentMethodData, isLoggedIn);
        // console.log(order);
        console.log('orderdata', order);
        // setPageLoader(false);
        // performRedirect(order, data.redirect_uri);

        if (order) {
          setOrderInfo(order);
        }
      } catch (error) {
        console.error(error);
        setErrorMessage(
          'This transaction could not be performed. Please select another payment method.'
        );
        setPageLoader(false);
      }
    },
    [
      isLoggedIn,
      setPageLoader,
      setErrorMessage,
      paymentMethodCode,
      cartId,
      setOrderInfo,
      setRestPaymentMethod,
    ]
  );
}
