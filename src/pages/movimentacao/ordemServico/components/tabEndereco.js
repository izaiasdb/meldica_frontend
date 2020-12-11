import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import { Row, Col, Form, Select, Input, Button, Table, Icon, Card, Divider } from 'antd'
import { generateOptions, getTitle } from '../../../util/helper'
import { openNotification } from '../../../util/notification'
import { isNil, isEmpty, trim, isEqual } from 'lodash'
import create from '../../../../services/CepApi'
import { INSERTING, EDITING, VIEWING } from '../../../util/state'

const Option = Select.Option

export default class TabEndereco extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            viewStateTab: INSERTING,
        };

        this.cepInput = React.createRef();
    }    

    buscarPorCEP = () => {
        const { form: {getFieldsValue, setFieldsValue } } = this.props
        let { value = '' } = this.cepInput.current.props
        value = value.replace(/\D/g, '');
        const validaCEP = /^[0-9]{8}$/

        if(isNil(value) || !validaCEP.test(value)) {
            const fields = getFieldsValue()
            fields.ordemServico = {
                id: null,
                idTipoEndereco: 1,
                cep: '',
                logradouro: '',
                bairro: '',
                uf: null,
                cidade: null,
                complemento: '',
                numero: ''
            }

            setFieldsValue(fields)
            openNotification({descricao: "CEP inválido", tipo: 'warning'})
        } else {
            create().CEP.buscarPorCEP(value).then(({data}) => {
                const fields = getFieldsValue()
                if(data.erro) {
                    fields.ordemServico = {
                        idTipoEndereco: 1,
                        id: null,
                        cep: '',
                        logradouro: '',
                        bairro: '',
                        uf: null,
                        cidade: null,
                        complemento: '',
                        numero: ''
                    }
                    openNotification({descricao: "CEP não encontrado.", tipo: "warning"})
                } else {
                    const { cep, logradouro, bairro, uf, localidade: cidade } = data
                    fields.ordemServico = {
                        cep: cep && cep.replace('/\D/g',''),
                        logradouro: logradouro && logradouro.toUpperCase(),
                        bairro: bairro && bairro.toUpperCase(),
                        uf: uf && uf.toUpperCase(),
                        cidade: cidade && cidade.toUpperCase(),
                    }
                }
                setFieldsValue(fields)
            })
        }
    }

    render() {
        const { 
            form: { getFieldDecorator, getFieldValue },
            ufList = [],
            municipioList = [],
            ordemServico = {},
            tipoEndereco = [{
                id: 1,
                descricao: "COMERCIAL"
            },{
                id: 2,
                descricao: "RESIDENCIAL"
            }],
            stateView,
        } = this.props
        const {
            idTipoEndereco,
            cep,
            logradouro,
            numero,
            complemento,
            bairro,
            uf,
            cidade
        } = ordemServico || {}

        const estado = getFieldValue("ordemServico.uf")
        const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };        

        return (<div>
            <Card title={"Busque pelo CEP ou digite os dados referente ao endereço de 'ENTREGA DA MERCADORIA.'"}>
                <Row gutter = { 12 }>
                    <Col span={ 4 }>
                        <Form.Item label={"Tipo de Endereco"}>
                            {
                                getFieldDecorator('ordemServico.idTipoEndereco', {
                                    initialValue: isNil(idTipoEndereco) ? 1 : idTipoEndereco
                                })(
                                <Select 
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    disabled= {isEqual(stateView, VIEWING)}
                                    >
                                    {
                                        generateOptions(tipoEndereco)
                                    }
                                </Select>
                                )
                            }
                        </Form.Item>
                    </Col>
                    <Col span={ 4 }>
                        <Form.Item label={"CEP"}>
                            {
                                getFieldDecorator('ordemServico.cep', {
                                    initialValue: isNil(cep) ? null : cep
                                })( <Input 
                                        ref={this.cepInput} 
                                        maxLength={ 10 } 
                                        disabled= {isEqual(stateView, VIEWING)}
                                        onBlur={this.buscarPorCEP} /> )
                            }
                        </Form.Item>
                    </Col>            
                    <Col span={ 12 }>
                        <Form.Item label={"Logradouro"}>
                            {
                                getFieldDecorator('ordemServico.logradouro', {
                                    initialValue: isNil(logradouro) ? null : logradouro
                                })(<Input 
                                        maxLength={ 100 } 
                                        disabled= {isEqual(stateView, VIEWING)}
                                        onInput={toInputUppercase}/>)
                            }
                        </Form.Item>
                    </Col>      
                    <Col span={ 4 }>
                        <Form.Item label={"Número"}>
                            {
                                getFieldDecorator('ordemServico.numero', {
                                    initialValue: isNil(numero) ? null : numero
                                })(<Input 
                                        maxLength={ 8 } 
                                        disabled= {isEqual(stateView, VIEWING)}
                                        onInput={toInputUppercase}/>)
                            }
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter = { 12 }>
                    <Col span={ 6 }>
                        <Form.Item label={"Complemento"}>
                            {
                                getFieldDecorator('ordemServico.complemento', {
                                    initialValue: isNil(complemento) ? null : complemento
                                })(<Input 
                                        maxLength={ 30 } 
                                        disabled= {isEqual(stateView, VIEWING)}
                                        onInput={toInputUppercase}/>)
                            }
                        </Form.Item>
                    </Col>                     
                    <Col span={ 6 }>
                        <Form.Item label={"Bairro"}>
                            {
                                getFieldDecorator('ordemServico.bairro', {
                                    initialValue: isNil(bairro) ? null : bairro
                                })(<Input 
                                        maxLength={ 100 } 
                                        disabled= {isEqual(stateView, VIEWING)}
                                        onInput={toInputUppercase}/>)
                            }
                        </Form.Item>
                    </Col>
                    <Col span={ 4 }>
                        <Form.Item label={"Estado/UF"}>
                            {
                                getFieldDecorator('ordemServico.uf', {
                                    initialValue: isNil(uf) ? null : uf
                                })(
                                <Select 
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    disabled= {isEqual(stateView, VIEWING)}
                                    >
                                    <Option key={1} value={null}>{"Selecione"}</Option>
                                    {
                                        ufList.map(({id, nome}) => (<Option key={id} value={id} >
                                            {
                                                `${nome}-${id}`
                                            }
                                        </Option>))
                                    }
                                </Select>
                                )
                            }
                        </Form.Item>
                    </Col>
                    <Col span={ 8 }>
                        <Form.Item label={"Município"}>
                            {
                                getFieldDecorator('ordemServico.cidade', {
                                    initialValue: isNil(cidade) ? null : cidade
                                })(
                                <Select 
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    disabled= {isEqual(stateView, VIEWING)}
                                    >
                                    <Option key={1} value={null}>{"Selecione"}</Option>
                                    {
                                        estado && 
                                        municipioList.filter(({uf}) => uf.id == estado)
                                                .map(({nome}) => 
                                                    (<Option key={nome} value={nome} >
                                                        {
                                                            `${nome}`
                                                        }
                                                    </Option>))
                                    }
                                </Select>
                                )
                            }
                        </Form.Item>
                    </Col>
                </Row>                          
            </Card>
        </div>)
    }
}