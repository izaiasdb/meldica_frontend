import React from 'react'
import { Row, Col, Form, Input, DatePicker, Switch, Icon } from 'antd'
import moment from 'moment'
import { isNil } from 'lodash'

const TabDados = (props) => {

    const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };

    const { 
        keyHandler,
        state,
        form: { getFieldDecorator },
        perfil = {}
    } = props    
    const { nome, ativo, dataInclusao} = perfil || {}

    return(
        <div>
            <Row gutter={24}>
                <Col span={ 8 }>
                    <Form.Item label={"Nome"}>
                    {
                        getFieldDecorator('perfil.nome', {
                            rules: [{ required: true, message: 'Por favor, informe o nome.' }],
                            initialValue: nome || null
                        })(
                            <Input maxLength={ 100 } onKeyUp={keyHandler} onInput={toInputUppercase} />
                        )
                    }
                    </Form.Item>
                </Col>                        
                <Col span={ 2 }>
                    <Form.Item label={"Ativo"}>
                    {
                        getFieldDecorator('perfil.ativo', {
                            initialValue: ativo || true,
                            valuePropName: 'checked'                                    
                        })(
                            <Switch />
                        )
                    }
                    </Form.Item>
                </Col>                        
                <Col span={ 4 }>
                    <Form.Item label={"Data inclusão"} style={{marginTop: '-4px'}}>
                        {
                            getFieldDecorator('perfil.dataInclusao', {
                                rules: [{required: false}],
                                initialValue: isNil(dataInclusao) ? new moment() : new moment(dataInclusao)
                            })(<DatePicker format={'DD/MM/YYYY'} disabled />)
                        }                                
                    </Form.Item>
                </Col>
            </Row>                
        </div>
    )
}

export default TabDados