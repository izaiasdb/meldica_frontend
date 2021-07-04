import React from 'react'
import { isNil, isEmpty } from 'lodash'
import { Select, Breadcrumb, Card, Icon , Tag } from 'antd'

const Option = Select.Option
export const generateOptions = (elements) => {
    if (isNil(elements) || isEmpty(elements)) return
    
    return elements.map(({ key, id, descricao, nome }) => <Option key={key || id} value={id} >{ nome || descricao }</Option>)
}

export const distinct = (value, index, array) => (array.indexOf(value) === index)

export const onlyNumbers = (value) => (String(value).replace(/\D/gi,''))

export const getTitle = (text) => <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{text}</span>

export const getTitleTable = (text) => <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{text}</span>

export const getHeader = (text) => 
<div>
    <Card style={{ backgroundColor: '#5AB57E', height: 30}}>
    {/* <Card style={{ backgroundColor: '#fc6836', height: 50}}>              */}
        {/* <h1 style={{ color: '#fff'}}>{props.titulo}</h1> */}
        <Breadcrumb separator="" style={{ color: '#fff'}}>
            <Breadcrumb.Item href="/" style={{ color: '#fff'}}>
                <Icon type="home" />
                <span> Início</span>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item style={{ color: '#fff'}}>{text}</Breadcrumb.Item>
        </Breadcrumb>                
    </Card>    
</div>

export const getTagSimNao = (condition , reverseColor) => (condition === true) ? <Tag color={ reverseColor === true ? 'red' : 'green'}>{'SIM'}</Tag> : <Tag color={ reverseColor === true ? 'green' : 'red'}>{'NÃO'}</Tag>   

export const getTagAtivoInativo = (condition, reverseColor) => (condition === true) ? <Tag color={ reverseColor === true ? 'red' : 'green'}>{'ATIVO'}</Tag> : <Tag color={ reverseColor === true ? 'green' : 'red'}>{'INATIVO'}</Tag>

export const getTagStatusNota = (statusNota) => {
    console.log(statusNota)
    if(typeof statusNota != "undefined" && statusNota != null && statusNota != ''){
        switch (statusNota) {
            case 'A':
                return (<Tag color={'green'}>{'ABERTA'}</Tag>)
            case 'L':
                return (<Tag color={'orange'}>{'LOGÍSTICA'}</Tag>)
            case 'F':
                return (<Tag color={'black'}>{'FECHADO'}</Tag>)
            case 'R':
                return (<Tag color={'gray'}>{'REABERTO'}</Tag>)
            case 'L':
                return (<Tag color={'pink'}>{'LIBERADO'}</Tag>)
            case 'E':
                return (<Tag color={'blue'}>{'ENTREGUE'}</Tag>)
            case 'C':
                return (<Tag color={'red'}>{'CANCELADO'}</Tag>)                
            default:
                return (<Tag>{''}</Tag>)
        }
    }
}
