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

class Produto extends Component {
    
    componentDidMount() {
        this.props.init()
    }

    render() {
        const { fetching, stateView } = this.props
        return (
            <Spin spinning={ fetching }>
                { getHeader('Produto') }
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
        ...state.produto.data,
        fetching: state.produto.fetching,
        stateView: state.produto.stateView,
        produto: state.produto.produto
    }
}

const mapDispatchToProps = (dispatch) => ({
    init: ()  => dispatch(Actions.produtoInit()),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Produto)