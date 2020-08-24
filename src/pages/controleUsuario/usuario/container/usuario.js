import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Spin } from 'antd'
import { isEmpty, get, isEqual } from 'lodash'
import { SEARCHING, EDITING, INSERTING } from '../../../util/state'
import { getHeader } from '../../../util/helper'
import UsuarioActions from '../redux'
import Tabela from '../components/tabela'
import Pesquisa from '../components/pesquisa'
import Formulario from '../components/formulario'

class Usuario extends Component {    

    render() {
        const { fetching, state } = this.props
        return (
            <Spin spinning={ fetching }>
                { getHeader('Usuário') }
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
        ...state.usuario.data,
        fetching: state.usuario.fetching,
        state: state.usuario.state,
        usuario: state.usuario.usuario
    }
}

const mapDispatchToProps = (dispatch) => ({
    
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Usuario)