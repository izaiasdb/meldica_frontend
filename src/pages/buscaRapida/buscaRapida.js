import React, { Component } from 'react'
import BuscaRapidaActions from './redux'
import { connect } from 'react-redux'
import { Select } from 'antd';
import { CLIENTE, FORNECEDOR, FUNCIONARIO } from '../util/tipoPessoa'
import { Link, withRouter, Redirect } from 'react-router-dom'

const { Option } = Select;

class BuscaRapida extends Component {

    state = {
        redirect: false,
        pessoa: {}
    }

    handleSearch = (searchValue = '') => {
        if(searchValue.length >= 3) {
            this.props.search({nome : searchValue})
        } else {
            this.props.cleanSearch();
        }
    }

    handleSelect = (value) => {
        const { result = [] } = this.props
        this.setState({redirect: true, pessoa: result.find(i => i.id == value) })
    }

    getLink = (id, tipoPessoa) =>{
        switch (tipoPessoa) {                                
            case CLIENTE:
                return `/ficha/${id}/${CLIENTE}`
            case FORNECEDOR:
                return `/ficha/${id}/${FORNECEDOR}`
            case FUNCIONARIO:
                return `/ficha/${id}/${FUNCIONARIO}`
        }         
    }

    render() {
        const { redirect, pessoa = {} } = this.state

        if(redirect) {
            const { id, tipoPessoa } = pessoa
            this.setState({redirect: false, pessoa: {}})

            return <Redirect to={this.getLink(id, tipoPessoa)} />
        }

        const { result = [], fetching } = this.props
        const options = result.map((pessoa) => {
            const { id, nome, tipoPessoa } = pessoa
            
            return (<Option key={id} value={id} >
                    <a>
                        <div style={{display: 'flex'}}>
                            <div style={{paddingRight: '10px'}}>
                                {
                                    `${tipoPessoa} | ${id} | ${nome}`
                                }
                            </div>                            
                        </div>
                    </a>
                </Option>)
        })

        return (
            // <div style={{'alignItems': 'center', 'display': 'flex'}}>
            <div className="selectBuscaRapida">
            <Select placeholder={"Busca Rápida"} 
                    showArrow={false}
                    defaultActiveFirstOption={false}
                    onSearch={(value) => this.handleSearch(value)}
                    filterOption={false}
                    style={{ width: '100%', paddingRight: '10px' }}
                    notFoundContent={null}
                    loading={fetching}
                    onSelect={this.handleSelect}
                    autoFocus
                    showSearch 
                    dropdownClassName="dropdownBuscaRapida"
                    allowClear>
                {options}
            </Select>
        </div>
        )
    }

}

const mapStateToProps = ({buscaRapida: { data, fetching }}) => ({
    result: data.result,
    fetching
})

const mapDispatchToProps = (dispatch) => ({
    search: (searchValue) => dispatch(BuscaRapidaActions.buscaRapidaSearch(searchValue)),
    cleanSearch: () => dispatch(BuscaRapidaActions.buscaRapidaCleanSearch()),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BuscaRapida))