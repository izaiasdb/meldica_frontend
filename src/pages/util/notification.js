import { notification } from 'antd'

export const openNotification = ({tipo = 'info', descricao = '', titulo = 'Notificação', duracao = 5}) => {
	  notification[tipo]({
	    message: titulo,
	    description: descricao,
	    duration: duracao
	  });
};