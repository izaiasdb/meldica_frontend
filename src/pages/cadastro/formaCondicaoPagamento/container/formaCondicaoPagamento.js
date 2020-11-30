import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Spin } from 'antd'
import { isEqual } from 'lodash'
import { SEARCHING, EDITING, INSERTING } from '../../../util/state'
import { getHeader } from '../../../util/helper'
import Tabela from '../components/tabela'
import Pesquisa from '../components/pesquisa'
import Formulario from '../components/formulario'

class FormaCondicaoPagamento extends Component {
    render() {
        const { fetching, stateView } = this.props
        return (
            <Spin spinning={ fetching }>
                { getHeader('Forma Condição de Pagamento') }
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
        ...state.formaCondicaoPagamento.data,
        fetching: state.formaCondicaoPagamento.fetching,
        stateView: state.formaCondicaoPagamento.stateView,
        formaCondicaoPagamento: state.formaCondicaoPagamento.formaCondicaoPagamento
    }
}

const mapDispatchToProps = (dispatch) => ({

})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FormaCondicaoPagamento)