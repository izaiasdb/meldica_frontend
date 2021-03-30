import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers';
import rootSaga from "./rootSaga";

const sagaMiddleware = createSagaMiddleware();
let middleware = applyMiddleware(sagaMiddleware);

var composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
//var composeEnhancers = (window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()) || compose;

// Antes
//const finalCreateStore = compose(middleware)(createStore);
const finalCreateStore = composeEnhancers(middleware)(createStore);

export const configureStore = function configureStore(devTools) {
    
   const store = finalCreateStore(rootReducer, devTools);

   store.runSaga = sagaMiddleware.run;
   store.runSaga(rootSaga);

   return store;
};
