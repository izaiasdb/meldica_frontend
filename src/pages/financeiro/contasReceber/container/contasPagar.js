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

class ContasPagar extends Component {
    
    componentDidMount() {
        this.props.init();
        // this.props.cleanTable();
        //this.props.setTipoTela('PAGAR')
    }

    UNSAFE_componentWillMount() {
        this.props.cleanTable();
    }   

    render() {
        const { fetching, stateView } = this.props
        return (
            <Spin spinning={ fetching }>
                { getHeader('Contas a Pagar') }
                {
                    isEqual(stateView, SEARCHING) &&
                    <div>
                        <Pesquisa tipoTela={"PAGAR"} />
                        <Tabela tipoTela={"PAGAR"}/>
                        {/* <Pesquisa />
                        <Tabela />                         */}
                    </div>
                }
                {
                    (isEqual(stateView, INSERTING) || isEqual(stateView, EDITING) || 
                    isEqual(stateView, VIEWING) || isEqual(stateView, 'PAGAR') ) &&
                    <div>
                        <Formulario tipoTela={"PAGAR"}/>
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
    init: ()  => dispatch(Actions.contasReceberInitPagar()),
    cleanTable: () => dispatch(Actions.contasReceberCleanTable()),
    //setTipoTela: (tipoTela) => dispatch(Actions.contasReceberSetTipoTela(tipoTela)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ContasPagar)