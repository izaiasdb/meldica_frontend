import React from 'react'
import { Row, Col, Form, Select, Input, DatePicker, Switch, Icon, Button } from 'antd'
import { isEqual, get } from 'lodash'
import moment from 'moment'
import { EDITING } from '../../../util/state'
import { generateOptions } from '../../../util/helper'

const TabDados2 = (props) => {

    const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };

    const { 
        keyHandler,
        state,
        form: { getFieldDecorator },
        perfis = [],
    } = props    

    return(
        <div>
            <Row gutter={24}>
                <Col span={ 8 }>
                    <Form.Item label={"Perfil"}>
                        {
                            getFieldDecorator('usuario.perfil.id', {
                                rules: [{required: true, message: 'Informe o perfil.'}],
                                initialValue: null
                            })(
                            <Select showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}                                            >
                                    <Select.Option key={1} value={null}>{"Selecione"}</Select.Option>
                                    {generateOptions(perfis.map(({id, nome: descricao}) => ({id, descricao})))}
                            </Select>
                            )
                        }                               
                    </Form.Item>
                </Col>
                <Col span={ 8 }>
                    <Button type={ "primary"} 
                            onClick={this.copiarPermissoes}
                            style={{marginRight: '10px'}}>
                            Copiar permissões
                    </Button>                    
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={ 8 }>
                    <Form.Item label={"Nome"}>
                        {
                            getFieldDecorator('usuario.nome', {
                                rules: [{ required: true, message: 'Por favor, informe o nome.' }]
                            })(
                                <Input maxLength={ 100 } onKeyUp={keyHandler} onInput={toInputUppercase} />
                            )
                        }
                    </Form.Item>
                </Col>
                <Col span={ 2 }>
                    <Form.Item label={"Ativo"}>
                    {
                        getFieldDecorator('usuario.ativo', {
                            initialValue: true,
                            valuePropName: 'checked'                                    
                        })(
                            <Switch checkedChildren="SIM" unCheckedChildren="NÃO"/>
                        )
                    }
                    </Form.Item>
                </Col>                                                  
                <Col span={ 4 }>
                    <Form.Item label={"Data inclusão"} style={{marginTop: '-4px'}}>
                        {
                            getFieldDecorator('usuario.dataInclusao', {
                                rules: [{required: false}],
                                initialValue: new moment(),
                            })(<DatePicker format={'DD/MM/YYYY'} disabled />)
                        }                                
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={ 4 }>
                    <Form.Item label={"Login"} >
                        {
                            getFieldDecorator('usuario.login', {
                                rules: [{ required: true, message: 'Por favor, informe o login.' }],
                                initialValue: null,
                            })(
                                <Input maxLength={ 100 } onKeyUp={keyHandler} 
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Login"/>
                            )
                        }
                    </Form.Item>
                </Col>
                <Col span={ 4 }>
                    <Form.Item label={"Senha"} >
                        {
                            getFieldDecorator('usuario.senha', {
                                rules: [{ required: true, message: 'Por favor, informe o login.' }],
                                initialValue: null,
                            })(
                                <Input maxLength={ 100 } 
                                    onKeyUp={keyHandler} 
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="Senha"/>
                            )
                        }
                    </Form.Item>
                </Col>                        
            </Row>          
        </div>
    )

    copiarPermissoes = () => {
        console.log('ok');
        //this.props.setState(SEARCHING)
    }    
}

export default TabDados