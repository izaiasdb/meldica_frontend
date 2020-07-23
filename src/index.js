import React from 'react';
import { render } from 'react-dom';
import './assets/css/index.css'
import 'antd/dist/antd.less';
import Routes from './routes';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/es/locale-provider/pt_BR';
import { Switch, BrowserRouter } from 'react-router-dom'

import { Provider } from 'react-redux'
import { configureStore } from './store/index'

require("moment/locale/pt-br")

const store = configureStore({})
const Root = () => (<Provider store={store}>            
                <ConfigProvider locale={ptBR}>
                    <BrowserRouter>
                        <Switch>
                            <Routes />
                        </Switch>
                    </BrowserRouter>
                </ConfigProvider>
            </Provider>)

render(<Root />, document.getElementById('root'));
