import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Spin } from 'antd'
import { isEqual } from 'lodash'
import { SEARCHING, EDITING, INSERTING } from '../../../util/state'
import { getHeader } from '../../../util/helper'
import Tabela from '../components/tabela'
import Pesquisa from '../components/pesquisa'
import Formulario from '../components/formulario'

class Perfil extends Component {
    render() {
        const { fetching, state } = this.props
        return (
            <Spin spinning={ fetching }>
                { getHeader('Perfil') }
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
        ...state.perfil.data,
        fetching: state.perfil.fetching,
        state: state.perfil.state,
        perfil: state.perfil.perfil
    }
}

export default connect(
    mapStateToProps,
)(Perfil)