import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import { Row, Col, Form, Select, Input, Button, Table, Icon, Card, Divider, InputNumber } from 'antd'
import { generateOptions, getTitle } from '../../../util/helper'
import { openNotification } from '../../../util/notification'
import { isNil, isEmpty, trim, isEqual } from 'lodash'
import create from '../../../../services/CepApi'
import { INSERTING, EDITING, VIEWING } from '../../../util/state'

const Option = Select.Option

export default class TabTransportadora extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            viewStateTab: INSERTING,
        };

        this.cepInput = React.createRef();
    }    

    adicionar = () => {
        const { form: { getFieldValue, setFieldsValue } } = this.props

        let ordemServicoTransportadora = getFieldValue("ordemServicoTransportadora")
        let error = false
        Object.keys(ordemServicoTransportadora).forEach(key => {
            if(key != "id" && key != "complemento" && key != "cep" &&
                (isNil(ordemServicoTransportadora[key]) || isEmpty(trim(ordemServicoTransportadora[key])))) {
                openNotification({tipo: 'warning', descricao: `Por favor, preencha o(a) ${key.toUpperCase()}.`})
                error = true
            }
        })

        if(error) return null
        
        let transportadoraItemsList = getFieldValue("ordemServico.transportadoraItemsList")

        if (ordemServicoTransportadora.id){
            let oldRegistro = transportadoraItemsList.find(c=> c.id == ordemServicoTransportadora.id)

            const index = transportadoraItemsList.indexOf(oldRegistro);

            if (index > -1) {
                transportadoraItemsList.splice(index, 1);
            }          
        }

        transportadoraItemsList.push(ordemServicoTransportadora)
        setFieldsValue({
            ordemServico: { transportadoraItemsList },
            ordemServicoTransportadora: {
                id: null,
                transportadora: { id: null},  
                idTipoEndereco: 1,
                cep: '',
                logradouro: '',
                bairro: '',
                uf: null,
                cidade: null,
                complemento: '',
                numero: ''
            }
        })
        this.setStateView({ viewStateTab: INSERTING })
    }

    prepareUpdate = (ordemServicoTransportadora) => {
        const { form: { setFieldsValue } } = this.props
        setFieldsValue({ ordemServicoTransportadora: {...ordemServicoTransportadora } } )
        this.setStateView({ viewStateTab: EDITING })
    }    
    
    remover = (index) => {
        const { form: {getFieldValue, setFieldsValue } } = this.props
        let transportadoraItemsList = getFieldValue("ordemServico.transportadoraItemsList")
        transportadoraItemsList = transportadoraItemsList.filter((e, indexx) => indexx != index)
        setFieldsValue({ordemServico: { transportadoraItemsList }})
        this.setStateView({ viewStateTab: INSERTING })
    }

    buscarPorCEP = () => {
        const { form: {getFieldsValue, setFieldsValue } } = this.props
        let { value = '' } = this.cepInput.current.props
        value = value.replace(/\D/g, '');
        const validaCEP = /^[0-9]{8}$/

        if(isNil(value) || !validaCEP.test(value)) {
            const fields = getFieldsValue()
            fields.ordemServicoTransportadora = {
                id: null,
                transportadora: { id: null},  
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
                    fields.ordemServicoTransportadora = {
                        transportadora: { id: null},  
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
                    fields.ordemServicoTransportadora = {
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

    limpar() {
        const { form: { getFieldsValue, setFieldsValue } } = this.props
        const fields = getFieldsValue()
        fields.ordemServicoTransportadora = {
            id: null,
            transportadora: { id: null},  
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
    }

    getExtra() {
        const { viewStateTab } = this.state
        const { stateView, } = this.props
        return (
            <>
                <Button 
                    type={"primary"} 
                    onClick={this.adicionar} 
                    disabled= {isEqual(stateView, VIEWING)}>
                    { (isEqual(viewStateTab, INSERTING) ? 'Adicionar' : 'Atualizar')} Transportora
                </Button>
                &nbsp;
                <Button 
                    type={"primary"} 
                    disabled= {isEqual(stateView, VIEWING)}
                    onClick={this.limpar} >
                    Limpar
                </Button>
            </>
        )
    }

    render() {
        const { 
            form: { getFieldDecorator, getFieldValue },
            transportadoraList = [],
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
        const { transportadoraItemsList = [] } = ordemServico || {}

        const estado = getFieldValue("ordemServicoTransportadora.uf")
        const id = getFieldValue("ordemServicoTransportadora.id") || null
        const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };        

        return (<div>
            <Card title={"Informe os dados referente ao Tranporte de Mercadorias."} extra={this.getExtra()}>
                { getFieldDecorator("ordemServicoTransportadora.id", { initialValue: id })(<Input type="hidden" />) }
                <Row gutter = { 12 }>
                    <Col span={ 12 }>
                        <Form.Item label={"Transportadora de Endereco"}>
                            {
                                getFieldDecorator('ordemServicoTransportadora.transportadora.id', {
                                    initialValue: null
                                })(
                                <Select 
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    disabled= {isEqual(stateView, VIEWING)}
                                    >
                                    {
                                        generateOptions(transportadoraList)
                                    }
                                </Select>
                                )
                            }
                        </Form.Item>
                    </Col>
                    <Col span={ 4 }>
                        <Form.Item label={"Ordem Transportadora"}>
                            {
                                getFieldDecorator('ordemServicoTransportadora.ordem', {
                                    //rules: [{required: true, message: 'Por favor, informe a quantidade em uma caixa.'}],
                                    initialValue: null
                                })(
                                    <InputNumber 
                                        style={{ width: "150" }}                                                         
                                        min={1}
                                        precision={0}
                                        step={1}
                                        disabled= {isEqual(stateView, VIEWING)}                           
                                        />
                                )
                            }
                        </Form.Item>
                    </Col>                    
                </Row>
                <Row gutter = { 12 }>
                    <Col span={ 4 }>
                        <Form.Item label={"Tipo de Endereco"}>
                            {
                                getFieldDecorator('ordemServicoTransportadora.idTipoEndereco', {
                                    initialValue: 1
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
                                getFieldDecorator('ordemServicoTransportadora.cep', {
                                    initialValue: null
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
                                getFieldDecorator('ordemServicoTransportadora.logradouro', {
                                    initialValue: null
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
                                getFieldDecorator('ordemServicoTransportadora.numero', {
                                    initialValue: null
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
                                getFieldDecorator('ordemServicoTransportadora.complemento', {
                                    initialValue: null
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
                                getFieldDecorator('ordemServicoTransportadora.bairro', {
                                    initialValue: null
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
                                getFieldDecorator('ordemServicoTransportadora.uf', {
                                    initialValue: null
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
                                getFieldDecorator('ordemServicoTransportadora.cidade', {
                                    initialValue: null
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
            <Card title={getTitle("Endereços")} style={{marginTop: '10px'}}>
                <Row gutter = { 12 }>
                    <Form.Item>
                        {
                            getFieldDecorator('ordemServico.transportadoraItemsList', {
                                initialValue: [...transportadoraItemsList],
                                valuePropName: 'dataSource'
                            })(
                                <Table rowKey={(row) => row.id || row.cep} 
                                    size={"small"} 
                                    pagination={false}
                                    bordered>
                                    <Table.Column title={<center>Transportadora</center>} 
                                                key={"transportadora.id"} 
                                                dataIndex={"transportadora.id"} 
                                                align={"center"} 
                                                render={ (text) => transportadoraList.map(d => { if(d.id == text) return d.nome }) }
                                                />                                        
                                    <Table.Column title={<center>Tipo</center>} 
                                                key={"idTipoEndereco"} 
                                                dataIndex={"idTipoEndereco"} 
                                                align={"center"} 
                                                render={ (text) => tipoEndereco.map(d => { if(d.id == text) return d.descricao }) }
                                                />
                                    <Table.Column title={<center>CEP</center>} key={"cep"} dataIndex={"cep"} align={"center"} />
                                    <Table.Column title={<center>Logradouro</center>} key={"logradouro"} dataIndex={"logradouro"} align={"center"} />
                                    <Table.Column title={<center>Número</center>} key={"numero"} dataIndex={"numero"} align={"center"} />
                                    <Table.Column title={<center>Complemento</center>} key={"complemento"} dataIndex={"complemento"} align={"center"} />
                                    <Table.Column title={<center>Bairro</center>} key={"bairro"} dataIndex={"bairro"} align={"center"} />
                                    <Table.Column title={<center>Cidade</center>} key={"cidade"} dataIndex={"cidade"} align={"center"} 
                                                render={(text, record) => `${text ? text : ''}${isNil(record.uf) ? '' : ' - '+record.uf}`}
                                                    />
                                    <Table.Column title={<center>Ações</center>} key={"actions"} 
                                                dataIndex={"actions"} 
                                                align={"center"} 
                                                render={ (text, record, index) => {
                                                    return <>
                                                            {
                                                                record.id && !isEqual(stateView, VIEWING) &&
                                                                <Icon style={{cursor: 'pointer'}} type={ 'edit' } onClick={(e) => this.prepareUpdate(record)}></Icon> 
                                                            }
                                                            <Divider type="vertical"/>                                                    
                                                            {   !isEqual(stateView, VIEWING) &&
                                                                <Icon style={{cursor: 'pointer'}} type={"delete"} onClick={ () => this.remover(index) }/>
                                                            }
                                                        </>
                                                    }
                                                }/>
                                </Table>
                            )
                        }
                    </Form.Item>
                </Row>
            </Card>
        </div>)
    }
}