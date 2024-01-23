import { shape, string } from 'prop-types';
import _get from 'lodash.get';
// import LocalStorage from '../../../../utils/localStorage';

export const paymentMethodShape = shape({ title: string, code: string });

export async function performRedirect(order, redirectUrl) {
  const orderNumber = _get(order, 'order_number');
  if (orderNumber) {
    window.location.replace(redirectUrl);
  }

  if (orderNumber) {
    // LocalStorage.clearCheckoutStorage();
  }
}

export function _isObjEmpty(obj) {
  return Object.keys(obj).length === 0;
}

// Function to get keys of an object
export function _keys(obj) {
  return Object.keys(obj);
}
