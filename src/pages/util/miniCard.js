import React from 'react'
import { Card, Col, Avatar, } from 'antd'

const { Meta } = Card

export const getCard = (nome, color, icon, value, formata = true, currency = true) => {
    var formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });     
      
    let valorFormatado = value;

    if (formata) {
        valorFormatado = value.toFixed(2)
    }
    
    return (
    // <Col span={4}>
        <Card style={{ 'borderRadius' : '1em', 'marginBottom' : '10px'}} id="cardVenda" >
            <Meta avatar = { 
                    <Avatar size={72} 
                            //size="large"
                            icon={icon} 
                            style = {{ color, backgroundColor: '#fff', paddingRight: 0, width: '45px'}}/> }
                  title={<span style={{ 'fontSize': '16px', 'fontWeight' : 'bold'}}>{nome}</span>}
                  description = {
                        <div style={{'textAlign' : 'center', 'fontWeight' : 'bold', 'fontSize' : '1.6em', 'color' : '#000'}}>
                            { formata &&
                                //formatter.format(value.toFixed(3))
                                (currency ? "R$ " : "") + valorFormatado
                            }
                            { !formata &&                                
                                value
                            }
                        </div>
                  }
            />
        </Card>
    // </Col>
    )
}   