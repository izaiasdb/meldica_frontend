import apisauce from 'apisauce';

const create = (baseURL = 'https://viacep.com.br/ws/') => {
    const cep_api = apisauce.create({ baseURL });

    const CEP = {
        buscarPorCEP: (cep) => cep_api.get(`${cep}/json/`),
    }

    return {
        CEP
    }
}

export default create;

