import { useContext } from 'react';
import get from 'lodash.get';

import CartContext from '../../../../context/Cart/CartContext';

export default function usePayOneCartContext() {
  const [cartData, { setRestPaymentMethod, setOrderInfo }] =
    useContext(CartContext);
  const cartId = get(cartData, 'cart.id');
  const orderId = get(cartData, 'order.order_number');
  return {
    cartId,
    orderId,
    setOrderInfo,
    setRestPaymentMethod,
  };
}
