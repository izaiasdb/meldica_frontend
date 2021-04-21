import React, { Component } from 'react'
import { Row, Col } from 'antd'

export default class TabDadosEndereco extends Component {

    render() {
        const { enderecoResidencial = {}, enderecoComercial = {} } = this.props.pessoa || {}
        
        return (
            <div>
                <fieldset>
                    <legend>Endereço Residencial</legend>
                    <Row gutter={12}>
                        <Col span={6}>
                            <label>Logradouro</label>
                            <div>{enderecoResidencial && enderecoResidencial.rua}</div>
                        </Col>
                        <Col span={6}>
                            <label>Bairro</label>
                            <div>{enderecoResidencial && enderecoResidencial.bairro}</div>
                        </Col>
                        <Col span={6}>
                            <label>Complemento</label>
                            <div>{enderecoResidencial && enderecoResidencial.complemento}</div>
                        </Col> 
                        <Col span={6}>
                            <label>Cidade</label>
                            <div>{enderecoResidencial && enderecoResidencial.cidade && `${enderecoResidencial.cidade} - ${enderecoResidencial.uf}`}</div>
                        </Col>
                    </Row>
                </fieldset>    
                <fieldset style={{marginTop: '10px'}}>
                    <legend>Endereço Comercial</legend>
                    <Row gutter={12}>
                        <Col span={6}>
                            <label>Logradouro</label>
                            <div>{enderecoComercial && enderecoComercial.rua}</div>
                        </Col>
                        <Col span={6}>
                            <label>Bairro</label>
                            <div>{enderecoComercial && enderecoComercial.bairro}</div>
                        </Col>
                        <Col span={6}>
                            <label>Complemento</label>
                            <div>{enderecoComercial && enderecoComercial.complemento}</div>
                        </Col> 
                        <Col span={6}>
                            <label>Cidade</label>
                            <div>{enderecoComercial && enderecoComercial.cidade && `${enderecoComercial.cidade} - ${enderecoComercial.uf}`}</div>
                        </Col>
                    </Row>
                </fieldset>            
            </div>
        )
    }

}
