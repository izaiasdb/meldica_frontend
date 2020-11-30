import { get } from "lodash";
import { select } from 'redux-saga/effects'

export const TOKEN_KEY = "@sap-token";
export const USER_KEY = "@sap-user";

export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;

export const isAuthenticatedRedux = function * () {
  const isLogado = yield select(state => get(state, 'login.data.profile', false)) ? true : false
  return isLogado
}

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const login = (profile) => {    
  localStorage.setItem(TOKEN_KEY, profile.token);

  if(profile.unidadeLotacao) {
    profile.unidadeAtual = profile.unidadeLotacao;
  } else if (profile.unidades && profile.unidades.length > 0) {
    profile.unidadeAtual = profile.unidades[0];
  }

  localStorage.setItem(USER_KEY, JSON.stringify(profile));
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const hasAnyAuthority = (...args) => {
    let user = getUser();
    if(user && user.authorities) {
        return user.authorities.some(a => args.indexOf(a.authority) > -1);
    }
    return false;
}

export const getUser = () => {
    let user = localStorage.getItem(USER_KEY);
    if(user) {
       return JSON.parse(user); 
    }
    return {};
}

