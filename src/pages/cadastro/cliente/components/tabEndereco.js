import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import { Row, Col, Form, Select, Input, Button, Table, Icon, Card, Divider } from 'antd'
import { generateOptions, getTitle } from '../../../util/helper'
import { openNotification } from '../../../util/notification'
import { isNil, isEmpty, trim, isEqual } from 'lodash'
import create from '../../../../services/CepApi'
import { INSERTING, EDITING } from '../../../util/state'

const Option = Select.Option

export default class TabEndereco extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            viewStateTab: INSERTING,
        };

        this.cepInput = React.createRef();
    }    

    adicionar = () => {
        const { form: { getFieldValue, setFieldsValue } } = this.props

        let endereco = getFieldValue("endereco")
        let error = false
        Object.keys(endereco).forEach(key => {
            if(key != "id" && key != "complemento" && key != "cep" &&  key != "idClienteRazao" &&
                (isNil(endereco[key]) || isEmpty(trim(endereco[key])))) {
                openNotification({tipo: 'warning', descricao: `Por favor, preencha o(a) ${key.toUpperCase()}.`})
                error = true
            }
        })

        if(error) return null
        
        let clienteEnderecoList = getFieldValue("cliente.clienteEnderecoList")

        if (endereco.id){
            let oldRegistro = clienteEnderecoList.find(c=> c.id == endereco.id)

            const index = clienteEnderecoList.indexOf(oldRegistro);

            if (index > -1) {
                clienteEnderecoList.splice(index, 1);
            }          
        }

        clienteEnderecoList.push(endereco)
        setFieldsValue({
            cliente: { clienteEnderecoList },
            endereco: {
                id: null,
                //tipoEnderecoPessoa: { id: 2}, 
                idClienteRazao: null,               
                idTipoEndereco: 2,
                cep: '',
                logradouro: '',
                bairro: '',
                uf: null,
                cidade: null,
                complemento: '',
                numero: ''
            }
        })
        this.setState({ viewStateTab: INSERTING })
    }

    prepareUpdate = (endereco) => {
        const { form: { setFieldsValue } } = this.props
        setFieldsValue({ endereco: {...endereco } } )
        this.setState({ viewStateTab: EDITING })
    }    
    
    remover = (index) => {
        const { form: {getFieldValue, setFieldsValue } } = this.props
        let clienteEnderecoList = getFieldValue("cliente.clienteEnderecoList")
        clienteEnderecoList = clienteEnderecoList.filter((e, indexx) => indexx != index)
        setFieldsValue({cliente: { clienteEnderecoList }})
        this.setState({ viewStateTab: INSERTING })
    }

    buscarPorCEP = () => {
        const { form: {getFieldsValue, setFieldsValue } } = this.props
        let { value = '' } = this.cepInput.current.props
        value = value.replace(/\D/g, '');
        const validaCEP = /^[0-9]{8}$/

        if(isNil(value) || !validaCEP.test(value)) {
            const fields = getFieldsValue()
            fields.endereco = {
                id: null,
                idClienteRazao: null,
                //tipoEnderecoPessoa: { id: 2},                
                idTipoEndereco: 2,
                cep: '',
                logradouro: '',
                bairro: '',
                uf: null,
                cidade: null,
                complemento: '',
                numero: ''
            }

            setFieldsValue(fields)
            openNotification({descricao: "CEP inv??lido", tipo: 'warning'})
        } else {
            create().CEP.buscarPorCEP(value).then(({data}) => {
                const fields = getFieldsValue()
                if(data.erro) {
                    fields.endereco = {
                        //tipoEnderecoPessoa: { id: 2},
                        idTipoEndereco: 2,
                        idClienteRazao: null,
                        id: null,
                        cep: '',
                        logradouro: '',
                        bairro: '',
                        uf: null,
                        cidade: null,
                        complemento: '',
                        numero: ''
                    }
                    openNotification({descricao: "CEP n??o encontrado.", tipo: "warning"})
                } else {
                    //const { cep, logradouro: rua, bairro, uf, localidade: cidade } = data
                    const { cep, logradouro, bairro, uf, localidade: cidade } = data
                    fields.endereco = {
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
        fields.endereco = {
            id: null,
            idClienteRazao: null,
            //tipoEnderecoPessoa: { id: 2},  
            idTipoEndereco: 2,          
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

        return (
            <>
                <Button type={"primary"} onClick={this.adicionar} >
                    { isEqual(viewStateTab, INSERTING) ? 'Adicionar' : 'Atualizar' }
                </Button>
                &nbsp;
                <Button type={"primary"} onClick={this.limpar} >
                    Limpar
                </Button>
            </>
        )
    }

    render() {
        const { 
            form: { getFieldDecorator, getFieldValue },
            ufList = [],
            municipioList = [],
            cliente = {},
            tipoEndereco = [{
                id: 1,
                descricao: "COMERCIAL"
            },{
                id: 2,
                descricao: "RESIDENCIAL"
            }],
        } = this.props
        const { clienteEnderecoList = [],
            clienteRazaoList = []
         } = cliente || {}

        //const cepInput = useRef(null);
        const estado = getFieldValue("endereco.uf")
        const id = getFieldValue("endereco.id") || null
        const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };        

        return (<div>
            <Card title={"Busque pelo CEP ou digite os dados referente ao endere??o e clique no bot??o 'Adicionar'."} extra={this.getExtra()}>
                { getFieldDecorator("endereco.id", { initialValue: id })(<Input type="hidden" />) }
                <Row gutter = { 12 }>
                    <Col span={ 6 }>
                        <Form.Item label={"Raz??o Social"}>
                            {
                                getFieldDecorator('endereco.idClienteRazao', {
                                    initialValue: null
                                })(
                                <Select showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                        {generateOptions(clienteRazaoList.map(({id, nomeFantasia}) => ({id, descricao: nomeFantasia})))}
                                </Select>
                                )
                            }
                        </Form.Item>
                    </Col>
                    <Col span={ 3 }>
                        <Form.Item label={"Tipo de Endere??o"}>
                            {
                                //getFieldDecorator('endereco.tipoEndereco.id', {
                                getFieldDecorator('endereco.idTipoEndereco', {
                                    initialValue: 2
                                })(
                                <Select showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                        {
                                            generateOptions(tipoEndereco)
                                        }
                                </Select>
                                )
                            }
                        </Form.Item>
                    </Col>                    
                    <Col span={ 2 }>
                        <Form.Item label={"CEP"}>
                            {
                                getFieldDecorator('endereco.cep', {
                                    initialValue: null
                                })( <Input ref={this.cepInput} maxLength={ 10 } onBlur={this.buscarPorCEP} /> )
                            }
                        </Form.Item>
                    </Col>            
                    <Col span={ 10 }>
                        <Form.Item label={"Logradouro"}>
                            {
                                getFieldDecorator('endereco.logradouro', {
                                    initialValue: null
                                })(<Input maxLength={ 100 } onInput={toInputUppercase}/>)
                            }
                        </Form.Item>
                    </Col>      
                    <Col span={ 3 }>
                        <Form.Item label={"N??mero"}>
                            {
                                getFieldDecorator('endereco.numero', {
                                    initialValue: null
                                })(<Input maxLength={ 8 } onInput={toInputUppercase}/>)
                            }
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter = { 12 }>
                    <Col span={ 6 }>
                        <Form.Item label={"Complemento"}>
                            {
                                getFieldDecorator('endereco.complemento', {
                                    initialValue: null
                                })(<Input maxLength={ 30 } onInput={toInputUppercase}/>)
                            }
                        </Form.Item>
                    </Col>                     
                    <Col span={ 6 }>
                        <Form.Item label={"Bairro"}>
                            {
                                getFieldDecorator('endereco.bairro', {
                                    initialValue: null
                                })(<Input maxLength={ 100 } onInput={toInputUppercase}/>)
                            }
                        </Form.Item>
                    </Col>
                    <Col span={ 4 }>
                        <Form.Item label={"Estado/UF"}>
                            {
                                getFieldDecorator('endereco.uf', {
                                    initialValue: null
                                })(
                                <Select showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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
                        <Form.Item label={"Munic??pio"}>
                            {
                                getFieldDecorator('endereco.cidade', {
                                    initialValue: null
                                })(
                                <Select showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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
            <Card title={getTitle("Endere??os")} style={{marginTop: '10px'}}>
                <Row gutter = { 12 }>
                    <Form.Item>
                        {
                            getFieldDecorator('cliente.clienteEnderecoList', {
                                initialValue: [...clienteEnderecoList],
                                valuePropName: 'dataSource'
                            })(
                                <Table rowKey={(row) => row.id || row.cep} 
                                    size={"small"} 
                                    pagination={false}
                                    bordered>
                                    <Table.Column title={<center>Raz??o social</center>} 
                                                key={"idClienteRazao"} 
                                                dataIndex={"idClienteRazao"} 
                                                align={"center"} 
                                                render={ (text) => clienteRazaoList.map(d => { if(d.id == text) return d.nomeFantasia }) }
                                                />                                        
                                    <Table.Column title={<center>Tipo</center>} 
                                                key={"idTipoEndereco"} 
                                                dataIndex={"idTipoEndereco"} 
                                                align={"center"} 
                                                render={ (text) => tipoEndereco.map(d => { if(d.id == text) return d.descricao }) }
                                                />
                                    <Table.Column title={<center>CEP</center>} key={"cep"} dataIndex={"cep"} align={"center"} />
                                    <Table.Column title={<center>Logradouro</center>} key={"logradouro"} dataIndex={"logradouro"} align={"center"} />
                                    <Table.Column title={<center>N??mero</center>} key={"numero"} dataIndex={"numero"} align={"center"} />
                                    <Table.Column title={<center>Complemento</center>} key={"complemento"} dataIndex={"complemento"} align={"center"} />
                                    <Table.Column title={<center>Bairro</center>} key={"bairro"} dataIndex={"bairro"} align={"center"} />
                                    <Table.Column title={<center>Cidade</center>} key={"cidade"} dataIndex={"cidade"} align={"center"} 
                                                render={(text, record) => `${text ? text : ''}${isNil(record.uf) ? '' : ' - '+record.uf}`}
                                                    />
                                    <Table.Column title={<center>A????es</center>} key={"actions"} 
                                                dataIndex={"actions"} 
                                                align={"center"} 
                                                render={ (text, record, index) => {
                                                    return <>
                                                            {
                                                                record.id &&
                                                                <Icon style={{cursor: 'pointer'}} type={ 'edit' } onClick={(e) => this.prepareUpdate(record)}></Icon> 
                                                            }
                                                            <Divider type="vertical"/>                                                    
                                                            {
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