import apisauce from 'apisauce';

const create = (baseURL = 'http://172.18.4.42:3006/estatisticas') => {
    const estatisticas_api = apisauce.create({ 
        baseURL, 
        auth:{username:'sispen',password: 'consulta' }
    });

    const Estatisticas = {
        getPopulacaoTotal: () => estatisticas_api.get('/populacaototal'),
        getTotalColaboradorPorTipo: () => estatisticas_api.get('/totalcolaboradorportipo'),
        getPopulacaoTotalPorUnidade: (unidades) => estatisticas_api.get(`/populacaototalunidade?unidades=${JSON.stringify(unidades.map(u => u.id))}`),
        pesquisarMensagemUnidade: (obj) => estatisticas_api.post('/mensagemdashboard/listarmensagensunidade', {...obj}),  
    }

    return {
        Estatisticas
    }
}

export default {create};

