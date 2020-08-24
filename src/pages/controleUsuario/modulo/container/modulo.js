import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Spin } from 'antd'
import { isEmpty, get, isEqual } from 'lodash'
import { openNotification } from '../../../util/notification'
import { SEARCHING, EDITING, INSERTING } from '../../../util/state'
import { getHeader } from '../../../util/helper'
import ModuloActions from '../redux'
import Tabela from '../components/tabela'
import Pesquisa from '../components/pesquisa'
import Formulario from '../components/formulario'

class Modulo extends Component {

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
                { getHeader('Módulo') }
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
        ...state.modulo.data,
        fetching: state.modulo.fetching,
        state: state.modulo.state,
        modulo: state.modulo.modulo
    }
}

const mapDispatchToProps = (dispatch) => ({
    cleanMessage: ()  => dispatch(ModuloActions.moduloCleanMessage()),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Modulo)