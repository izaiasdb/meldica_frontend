import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Spin } from 'antd'
import { isEmpty, get, isEqual } from 'lodash'
import { openNotification } from '../../../util/notification'
import { SEARCHING, EDITING, INSERTING } from '../../../util/state'
import { getHeader } from '../../../util/helper'
import SistemaActions from '../redux'
import Tabela from '../components/tabela'
import Pesquisa from '../components/pesquisa'
import Formulario from '../components/formulario'
import { getUser } from '../../../../services/authenticationService'


class Sistema extends Component {
    
    componentDidMount() {
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        const message = get(nextProps, ['message'], "")
        
    	if (!isEmpty(message)) {
            openNotification(message)
            this.props.cleanMessage()
        }
    }    

    render() {
        const { fetching, state } = this.props
        return (
            <Spin spinning={ fetching }>
                { getHeader('Sistema') }
                {
                    isEqual(state, SEARCHING) &&
                    <div>
                        <Pesquisa />
                        <Tabela />
                    </div>
                }
                {
                    (isEqual(state, INSERTING) || isEqual(state, EDITING)) &&
                    <div>
                        <Formulario />
                    </div>
                }
            </Spin>
        )
    }
}    

const mapStateToProps = (state) => {

    return {
        ...state.sistema.data,
        fetching: state.sistema.fetching,
        state: state.sistema.state,
        sistema: state.sistema.sistema
    }
}

const mapDispatchToProps = (dispatch) => ({
    cleanMessage: ()  => dispatch(SistemaActions.sistemaCleanMessage()),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Sistema)