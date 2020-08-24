import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Spin } from 'antd'
import { isEqual } from 'lodash'
import { SEARCHING, EDITING, INSERTING } from '../../../util/state'
import { getHeader } from '../../../util/helper'
import Tabela from '../components/tabela'
import Pesquisa from '../components/pesquisa'
import Formulario from '../components/formulario'

class UnidadeMedida extends Component {
    render() {
        const { fetching, stateView } = this.props
        return (
            <Spin spinning={ fetching }>
                { getHeader('Unidade Medidas') }
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
        ...state.unidadeMedida.data,
        fetching: state.unidadeMedida.fetching,
        stateView: state.unidadeMedida.stateView,
        unidadeMedida: state.unidadeMedida.unidadeMedida
    }
}

const mapDispatchToProps = (dispatch) => ({

})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UnidadeMedida)