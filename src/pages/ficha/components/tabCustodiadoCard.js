import React, { Component } from 'react'
import { Row, Col, Input, Collapse, Divider, Button, Card, Popover, Badge, Icon, Alert } from 'antd'
import moment from 'moment'
import { Link } from 'react-router-dom'

const { Panel } = Collapse;
const { Meta } = Card;

export default class TabCustodiadoCard extends Component {

    getObservacoes = (record) => {
        return (
            <Alert
                //message="Observações"
                description={record.observacoes}
                type="info"//warning, info
                />            
       )
    }

    render() {
        const { pessoa } = this.props
        const { relacoes = [] } = pessoa || {}        

        return (
            relacoes && relacoes.map((item, key) => {
                return (       
                    item.pessoaRelacao && //Registros sem relação
                    <div key={'div-' + `${key}`} style={{height:'350px', width: '25%', float: 'left', textAlign: 'center'}}>
                        <Card  
                            key={key}
                            style={{ width: 250 }}
                            // cover={<ImageUtil src={item.pessoaRelacao.foto} 
                            //                     title={item.pessoaRelacao.nome} 
                            //                     size={200} 
                            //                     fixed
                            //                     />}
                            bordered={false}
                        >
                            <Meta title={item.pessoaRelacao.nome} 
                                    description={item.tipoPessoaRelacao.descricao}
                            /> 
                            <label>Autorização unidade: <span>{item.autorizacaoUnidade == 'S'? 'SIM': 'NÃO'}</span> </label>
                            <label>Autorização custodiado: <span>{item.autorizacaoCustodiado == 'S'? 'SIM': 'NÃO'}</span> </label>
                            {item.unidade && <label>Unidade: <span>{item.unidade.abreviacao}</span> </label> }
                            <Link to={`/ficha/custodiado/${item.pessoaRelacao.id}`}>
                                <Button icon="lock" 
                                    style={{marginTop: '5px', width: '120px', textAlign: "left" }}>
                                    Visualizar
                                </Button>                                                
                            </Link>
                            { item.observacoes &&
                            <Popover placement="bottom" title={"Observações"} content={this.getObservacoes(item)}>
                                <Badge //count={pendencias.length} showZero
                                >
                                    <Icon type="message" style={{ fontSize: '22px', color: '#08c', marginLeft: '8px' }} theme="outlined" />
                                </Badge>
                            </Popover>        
                            }              
                        </Card>                            
                    </div>
                )
            })            
        )
    }

}
