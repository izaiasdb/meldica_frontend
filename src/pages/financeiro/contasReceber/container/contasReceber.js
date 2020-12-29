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

class ContasReceber extends Component {
    
    componentDidMount() {
        this.props.init()
        //this.props.setTipoTela('RECEBER')
    }

    render() {
        const { fetching, stateView } = this.props
        return (
            <Spin spinning={ fetching }>
                { getHeader('Contas a Receber') }
                {
                    isEqual(stateView, SEARCHING) &&
                    <div>
                        <Pesquisa tipoTela={"RECEBER"} />
                        <Tabela tipoTela={"RECEBER"} />
                        {/* <Pesquisa />
                        <Tabela /> */}
                    </div>
                }
                {
                    (isEqual(stateView, INSERTING) || isEqual(stateView, EDITING) || 
                    isEqual(stateView, VIEWING) || isEqual(stateView, 'PAGAR') ) &&
                    <div>
                        <Formulario tipoTela={"RECEBER"} />
                        {/* <Formulario /> */}
                    </div>
                }                
            </Spin>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        ...state.contasReceber.data,
        fetching: state.contasReceber.fetching,
        stateView: state.contasReceber.stateView,
        contasReceber: state.contasReceber.contasReceber
    }
}

const mapDispatchToProps = (dispatch) => ({
    init: ()  => dispatch(Actions.contasReceberInitReceber()),
    //setTipoTela: (tipoTela) => dispatch(Actions.contasReceberSetTipoTela(tipoTela)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ContasReceber)