import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Spin } from 'antd'
import { isEqual } from 'lodash'
import { SEARCHING, EDITING, INSERTING } from '../../../util/state'
import { getHeader } from '../../../util/helper'
import MenuActions from '../redux'
import Tabela from '../components/tabela'
import Pesquisa from '../components/pesquisa'
import Formulario from '../components/formulario'

class Menu extends Component {

    render() {
        const { fetching, state } = this.props
        return (
            <Spin spinning={ fetching }>
                { getHeader('Menu') }
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
        ...state.menu.data,
        fetching: state.menu.fetching,
        state: state.menu.state,
        menu: state.menu.menu
    }
}

const mapDispatchToProps = (dispatch) => ({
    //cleanMessage: ()  => dispatch(MenuActions.menuCleanMessage()),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Menu)