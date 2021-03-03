import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Form, Select, Button, Table, Icon, Divider, Input, Tag, InputNumber, Card } from 'antd'
import { Link } from 'react-router-dom'
import { isEqual, isNil } from 'lodash'
import { generateOptions } from '../../../util/helper'
import { openNotification } from '../../../util/notification'
import { INSERTING, EDITING, VIEWING } from '../../../util/state'
import { obterPercentualDesconto, obterValorDesconto } from '../../../util/moneyUtils'

const Option = Select.Option

export default class TabPagarReceber extends React.Component {

    render() {
        const { 
            form,    
            ordemServico = {}    
        } = this.props
        const { pagarReceberList = [] } = ordemServico || {}
        const { getFieldDecorator, getFieldValue } = form
        
        return (<div>
            <Card title={"Recebimentos do pedido"}>
                <Row gutter = { 12 }>
                    <Table 
                        rowKey={(row) => row.id} 
                        size={"small"} 
                        dataSource={pagarReceberList}
                        pagination={false} bordered>
                        <Table.Column title={<center>Documento</center>} key={"documento"} dataIndex={"documento"} align={"center"} />
                        <Table.Column title={<center>Descrição </center>} key={"descricao"} dataIndex={"descricao"} align={"center"} />
                        <Table.Column title={<center>Valor</center>} key={"valor"} dataIndex={"valor"} align={"center"} />
                        <Table.Column title={<center>Valor pago</center>} key={"valorPago"} dataIndex={"valorPago"} align={"center"} />
                    </Table>
                </Row>
            </Card>
        </div>)
    }
}
