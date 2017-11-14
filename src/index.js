import Layout from './layout';
import './index.less';
import {Provider} from 'mobx-react';
import Store from './store';

const store = new Store();


ReactDom.render(
  <Provider store={store}>
    <Layout />
  </Provider>,
  document.getElementById('root')
);


