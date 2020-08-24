import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Spin } from 'antd'
import { isEqual } from 'lodash'
import { SEARCHING, EDITING, INSERTING } from '../../../util/state'
import { getHeader } from '../../../util/helper'
import Tabela from '../components/tabela'
import Pesquisa from '../components/pesquisa'
import Formulario from '../components/formulario'

class CondicaoPagamento extends Component {
    render() {
        const { fetching, stateView } = this.props
        return (
            <Spin spinning={ fetching }>
                { getHeader('Condição de Pagamento') }
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
        ...state.condicaoPagamento.data,
        fetching: state.condicaoPagamento.fetching,
        stateView: state.condicaoPagamento.stateView,
        condicaoPagamento: state.condicaoPagamento.condicaoPagamento
    }
}

const mapDispatchToProps = (dispatch) => ({

})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CondicaoPagamento)