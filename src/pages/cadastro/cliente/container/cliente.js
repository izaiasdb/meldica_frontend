import React, { Component } from 'react'
import { connect } from 'react-redux'
import Actions from '../redux'
import { Spin } from 'antd'
import { isEqual } from 'lodash'
import Tabela from '../components/tabela'
import Pesquisa from '../components/pesquisa'
import Formulario from '../components/formulario'
import { getHeader } from '../../../util/helper'
import { SEARCHING, EDITING, INSERTING } from '../../../util/state'

class Cliente extends Component {
    
    componentDidMount() {
        this.props.init()
    }

    render() {
        const { fetching, stateView } = this.props
        return (
            <Spin spinning={ fetching }>
                { getHeader('Clientes') }
                {
                    isEqual(stateView, SEARCHING) &&
                    <div>
                        <Pesquisa />
                        <Tabela />
                    </div>
                }
                {
                    (isEqual(stateView, INSERTING) || isEqual(stateView, EDITING)) &&
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
        ...state.cliente.data,
        fetching: state.cliente.fetching,
        stateView: state.cliente.stateView,
        cliente: state.cliente.cliente
    }
}

const mapDispatchToProps = (dispatch) => ({
    init: ()  => dispatch(Actions.clienteInit()),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Cliente)