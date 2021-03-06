import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Spin } from 'antd'
import { isEqual } from 'lodash'
import Actions from '../redux'
import Tabela from '../components/tabela'
import Pesquisa from '../components/pesquisa'
import Formulario from '../components/formulario'
import { getHeader } from '../../../util/helper'
import { SEARCHING, EDITING, INSERTING, VIEWING } from '../../../util/state'

class OrdemServico extends Component {
    
    componentDidMount() {
        this.props.init()
    }

    UNSAFE_componentWillMount() {
        this.props.cleanTable();
        this.props.setStateView(SEARCHING)
    }   

    render() {
        const { fetching, stateView } = this.props
        return (
            <Spin spinning={ fetching }>
                { getHeader('Pedidos') }
                {
                    isEqual(stateView, SEARCHING) &&
                    <div>
                        <Pesquisa />
                        <Tabela />
                    </div>
                }
                {
                    (isEqual(stateView, INSERTING) || isEqual(stateView, EDITING) || isEqual(stateView, VIEWING)) &&
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
        ...state.ordemServico.data,
        fetching: state.ordemServico.fetching,
        stateView: state.ordemServico.stateView,
        ordemServico: state.ordemServico.ordemServico
    }
}

const mapDispatchToProps = (dispatch) => ({
    init: ()  => dispatch(Actions.ordemServicoInit()),
    cleanTable: () => dispatch(Actions.ordemServicoCleanTable()),
    setStateView: (stateView) => dispatch(Actions.ordemServicoSetStateView(stateView)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OrdemServico)