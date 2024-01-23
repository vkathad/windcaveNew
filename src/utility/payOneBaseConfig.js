import _get from 'lodash.get';

import RootElement from '../../../../utils/rootElement';

const config = RootElement.getPaymentConfig();

console.log('unii');
const payOne = _get(config, 'windcave');
console.log(payOne);
console.log('payone');

export function getPayOneBaseConfig() {
  const baseConfig = {
    ...payOne,
  };
  return baseConfig;
}
