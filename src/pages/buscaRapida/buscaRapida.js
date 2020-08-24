import React, { Component } from 'react'
import BuscaRapidaActions from './redux'
import { connect } from 'react-redux'
import { Select } from 'antd';
import ImageUtil from '../util/imageUtil'
import { PRESTADOR_SERVICO, ADVOGADO_DEFENSOR, VISITANTE_FAMILIAR, CUSTODIADO } from '../util/tipoPessoa'
import { Link, withRouter, Redirect } from 'react-router-dom'

const { Option } = Select;

class BuscaRapida extends Component {

    state = {
        redirect: false,
        pessoa: {}
    }

    handleSearch = (searchValue = '') => {
        if(searchValue.length >= 3) {
            this.props.search(searchValue)
        } else {
            this.props.cleanSearch();
        }
    }

    handleSelect = (value) => {
        const { result = [] } = this.props
        this.setState({redirect: true, pessoa: result.find(i => i.id == value) })
    }

    getLink = (pessoaTipos, id) =>{
        if (pessoaTipos.length > 0){
            const idTipoPessoa = pessoaTipos[0].idTipoPessoa.toString()

            switch (idTipoPessoa) {                                
                case CUSTODIADO:
                    return `/ficha/custodiado/${id}`
                case ADVOGADO_DEFENSOR:
                    return `/ficha/pessoa/${id}/${ADVOGADO_DEFENSOR}`
                    break;
                case VISITANTE_FAMILIAR:
                    return `/ficha/pessoa/${id}/${VISITANTE_FAMILIAR}`
                    break;
                case PRESTADOR_SERVICO:
                    return `/ficha/pessoa/${id}/${PRESTADOR_SERVICO}`
                    break;                
                // default: 
                //     return `/ficha/${tipo == 'S' ? 'custodiado' : 'visitante'}/${id}`
                //     break;
            } 
        // }  else {
        //     return `/ficha/${tipo == 'S' ? 'custodiado' : 'visitante'}/${id}`
        } 
    }

    getTipo = (pessoaTipos, tipo) => {    
        if (pessoaTipos.length > 0){
            const idTipoPessoa = pessoaTipos[0].idTipoPessoa.toString()

            switch (idTipoPessoa) {                                
                case CUSTODIADO:
                    return "CUST."
                    break;                
                case ADVOGADO_DEFENSOR:
                    return "ADV."
                    break;
                case VISITANTE_FAMILIAR:
                    return "VIST."
                    break;
                case PRESTADOR_SERVICO:
                    return "PREST."
                    break;                
                default: 
                    return tipo == 'S' ? 'CUST' : 'VIST'
                    break;
            } 
        } else {
            return tipo == 'S' ? 'CUST' : 'VIST'
        }                   
    }

    render() {
        const { redirect, pessoa = {} } = this.state
        if(redirect) {
            const { id, pessoaTipos = [] } = pessoa
            this.setState({redirect: false, pessoa: {}})
            return <Redirect to={this.getLink(pessoaTipos, id)} />
        }
        const { result = [], fetching } = this.props
        const options = result.map((pessoa) => {
            const { id, foto, nome, ehPreso: tipo, pessoaTipos = [], unidade = {} } = pessoa
            
            return (<Option key={id} value={id} >
                    {/* <Link to={this.getLink(pessoaTipos, id, tipo)}> */}
                        <a>
                            <div style={{display: 'flex'}}>
                                <div style={{paddingRight: '10px'}}>
                                    {
                                        `${this.getTipo(pessoaTipos, tipo)} | ${id} | ${nome} | ${unidade.abreviacao}`
                                    }
                                </div>
                                <ImageUtil src={foto} 
                                           title={nome} 
                                           size={40} 
                                           maxHeight={"40px"}
                                           loading={fetching}
                                    />
                            </div>
                        </a>
                        {/* </Link> */}
                </Option>)
        })

        return (
            <div style={{'alignItems': 'center', 'display': 'flex'}}>
                <Select placeholder={"Busca Rápida"} 
                        showArrow={false}
                        defaultActiveFirstOption={false}
                        onSearch={this.handleSearch}
                        filterOption={false}
                        style={{ width: '600px', paddingRight: '10px' }}
                        notFoundContent={null}
                        loading={fetching}
                        onSelect={this.handleSelect}
                        autoFocus
                        showSearch
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