import React, { Component } from 'react'
import { Row , Col } from 'antd'
import { isEqual, isNil } from 'lodash'
import moment from 'moment'

// import { getTagAtivoInativo , getTagCargoServidor } from '../../util/helper'
import { CLIENTE, 
        FUNCIONARIO,
        FORNECEDOR
        } from '../../util/tipoPessoa'

export default class TabDadosPessoais extends Component {

    render() {
        const { 
            tipoPessoa , 
            nome,
            dataNascimento,            
            sexo,
            cpfCnpj, 
            clienteEnderecoList = [],
            clienteTelefoneList = [],
            //documentos = [],
            // rg,
            // rgOrgaoExpedidor,
            // rgUf,
            // rgDataExpedicao,
            //uf,            
            //nomePai,
            //nomeMae,
            //nacionalidade,
            //naturalidade,            
            // nomeOrganizacaoLotacao , //SERVIDOR SCC 
            // oficios , //SERVIDOR SCC  
        } = this.props

        return (
            <div>
                <Row gutter={12}>
                    <Col span={24}>
                        <label>Nome</label>
                        <div>{!isNil(nome) ? nome : '' }</div>
                        {/* <label>{nome}</label><br/>   */}
                    </Col> 

                    {/* {!isEqual(tipoPessoa, SERVIDOR) && !isEqual(tipoPessoa, TERCEIRIZADO) &&
                        <Col span={6}>
                            <label>Unidade cadastro</label>
                            <div>{!isNil(unidade) && !isNil(unidade.abreviacao) ? unidade.abreviacao : '' }</div>
                        </Col>
                    }

                    { (isEqual(tipoPessoa, SERVIDOR)) &&
                        <Col span={6}>
                            <label>Lotação</label>
                            <div>{(!isNil(nomeOrganizacaoLotacao) ? nomeOrganizacaoLotacao : '')}</div>
                        </Col>
                    } */}
                </Row>
                <Row gutter={12}>
                    <Col span={6}>
                        <label>Data de Nascimento</label>
                        <div>{dataNascimento && moment(dataNascimento, 'YYYY-MM-DD').format('DD/MM/YYYY')}</div>
                    </Col>
                    <Col span={6}>
                        <label>Sexo</label>
                        <div>{(!isNil(sexo) && sexo == 'M' ? 'MASCULINO' : !isNil(sexo) && sexo == 'F' ? 'FEMININO' : '' )}</div>
                    </Col>
                    <Col span={6}>
                        <label>CPF/CNPJ</label>
                        <div>{!isNil(cpfCnpj) ? cpfCnpj : '' }</div>
                    </Col>                    
                </Row>
                {/* { isEqual(tipoPessoa, VISITANTE_FAMILIAR) &&
                <Row gutter={12}>
                    <Col span={12}>
                        <label>Mãe</label>
                        <div>{!isNil(nomeMae) ? nomeMae : ''}</div>
                    </Col> 
                    <Col span={12}>
                        <label>Pai</label>
                        <div>{!isNil(nomePai) ? nomePai : ''}</div>
                    </Col>
                </Row> 
                }                   
                <Row gutter={12}>  
                    { isEqual(tipoPessoa, ADVOGADO_DEFENSOR) &&                  
                    <Col span={6}>
                        <label>OAB</label>
                        <div>{!isNil(numeroOab) ? numeroOab : '' }</div>
                    </Col>                    
                    }
                    <Col span={6}>
                        <label>Naturalidade</label>
                        <div>{`${!isNil(naturalidade) ? naturalidade : '' } - ${!isNil(uf) ? uf : ''}` }</div>
                    </Col>
                    <Col span={6}>
                        <label>Nacionalidade</label>
                        <div>{!isNil(nacionalidade) && !isNil(nacionalidade.descricao) ? nacionalidade.descricao : '' }</div>
                    </Col>                    
                </Row> */}
                {/* <Row gutter={12}>
                    <Col span={6}>
                        <label>RG</label>
                        <div>{!isNil(rg) ? rg : '' }</div>
                    </Col> 
                    <Col span={6}>
                        <label>Orgão expedidor</label>
                        <div>{`${!isNil(rgOrgaoExpedidor) ? rgOrgaoExpedidor : '' } - ${!isNil(rgUf) ? rgUf : ''}` }</div>
                    </Col>                     
                    <Col span={6}>
                        <label>Data de expedição</label>
                        <div>{!isNil(rgDataExpedicao) ? moment(rgDataExpedicao, 'YYYY-MM-DD').format('DD/MM/YYYY') : '' }</div>
                    </Col>
                </Row>      */}

                {/* { isEqual(tipoPessoa, SERVIDOR) &&
                    <fieldset style={{marginTop: '5px'}}>
                        <legend>Dados do cargo</legend>
                        <Row gutter={12}>
                            <Col span={6}>
                                <label>Matrícula</label>
                                <div>{(!isNil(matricula) ? matricula : '')}</div>
                            </Col> 

                            <Col span={6}>
                                <label>Data Posse</label>
                                <div>{(!isNil(dataAdmissao) ? moment(dataAdmissao, 'YYYY-MM-DD').format('DD/MM/YYYY') : '')}</div>
                            </Col>
                            
                            <Col span={6}>
                                <label>Data Desligamento</label>
                                <div>{(!isNil(dataDemissao) ? moment(dataDemissao, 'YYYY-MM-DD').format('DD/MM/YYYY') : '')}</div>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={6}>
                                <label>Lei</label>
                                <div>{(!isNil(lei) && !isNil(lei.numero) ? lei.numero : '')}</div>
                            </Col>

                            <Col span={6}>
                                <label>Edital</label>
                                <div>{(!isNil(edital) && !isNil(edital.numero) ? edital.numero : '')}</div>
                            </Col>
                            
                            <Col span={6}>
                                <label>Nível</label>
                                <div>{(!isNil(nivel) ? nivel : '')}</div>
                            </Col>
                            
                            <Col span={6}>
                                <label>Tipo Vínculo</label>
                                <div>{(!isNil(vinculo) && !isNil(vinculo.nome) ? vinculo.nome : '')}</div>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={6}>
                                <label>Cargo comissionado/função</label>
                                <div>{(!isNil(cargoComissionadoFuncao) && !isNil(cargoComissionadoFuncao.nome) ? cargoComissionadoFuncao.nome : '')}</div>
                            </Col>

                            <Col span={6}>
                                <label>Orgão origem</label>
                                <div>{(!isNil(orgaoOrigem) && !isNil(orgaoOrigem.nome) ? orgaoOrigem.nome : '')}</div>
                            </Col>

                            <Col span={6}>
                                <label>Desvio função</label>
                                <div>{(!isNil(desvioFuncao) ? desvioFuncao ? 'SIM' : 'NÃO' : '')}</div>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={6}>
                                <label>Adicional Noturno</label>
                                <div>{(!isNil(adicionalNoturno) ? adicionalNoturno ? 'SIM' : 'NÃO' : '')}</div>
                            </Col>
                        </Row>

                    </fieldset>
                } */}

                {/* <fieldset style={{marginTop: '5px'}}>
                    <legend>Documentos</legend>
                    {
                        (documentos && documentos.length > 0) &&
                        documentos.map((documento, key) => (
                            <Row key={key} gutter={12}>
                                <Col span={6}>
                                    <label>Tipo de Documento</label>
                                    <div>{!isNil(documento) && !isNil(documento.tipoDocumentoPessoa) && !isNil(documento.tipoDocumentoPessoa.descricao) ? documento.tipoDocumentoPessoa.descricao :  ''}</div>
                                </Col>
                                <Col span={6}>
                                    <label>Número do Documento</label>
                                    <div>{!isNil(documento) && !isNil(documento.numeroDocumento) ? documento.numeroDocumento : ''}</div>
                                </Col>
                                <Col span={6}>
                                    <label>Origem do Documento</label>
                                    <div>{!isNil(documento) && !isNil(documento.origem) ? documento.origem : ''}</div>
                                </Col> 
                            </Row>
                        ))
                    }
                </fieldset>  */}

                <fieldset style={{marginTop: '5px'}}>
                    <legend>Endereços</legend>
                    {
                        (clienteEnderecoList && clienteEnderecoList.length > 0) &&
                        clienteEnderecoList.map((endereco, key) => (
                            <Row key={key} gutter={12}>
                                <Col span={4}>
                                    <label>Tipo de Endereço</label>
                                    <div>{!isNil(endereco) && !isNil(endereco.tipoEndereco) && !isNil(endereco.tipoEndereco.descricao) ? endereco.tipoEndereco.descricao : '' }</div>
                                </Col>
                                <Col span={6}>
                                    <label>Logradouro</label>
                                    <div>
                                        {`${!isNil(endereco) && !isNil(endereco.rua) ? endereco.rua : '' } , ${!isNil(endereco) && !isNil(endereco.numero) ? endereco.numero : ' S/N'}`}
                                    </div>
                                </Col>
                                <Col span={5}>
                                    <label>Bairro</label>
                                    <div>{!isNil(endereco) && !isNil(endereco.bairro) ? endereco.bairro : '' }</div>
                                </Col>
                                <Col span={4}>
                                    <label>Complemento</label>
                                    <div>{!isNil(endereco) && !isNil(endereco.complemento) ? endereco.complemento : '' }</div>
                                </Col> 
                                <Col span={5}>
                                    <label>Cidade</label>
                                    <div>{`${!isNil(endereco) && !isNil(endereco.cidade) ? endereco.cidade : '' } - ${!isNil(endereco) && !isNil(endereco.uf) ? endereco.uf : ''}`}</div>
                                </Col>
                            </Row>
                        ))
                    }
                </fieldset> 

                <fieldset style={{marginTop: '5px'}}>
                    <legend>Telefones</legend>
                    {
                        (clienteTelefoneList && clienteTelefoneList.length > 0) &&
                        clienteTelefoneList.map((telefone, key) => (
                            <Row key={key} gutter={12}>
                                <Col span={6}>
                                    <label>Tipo de Telefone</label>
                                    <div>{!isNil(telefone) && !isNil(telefone.tipoTelefone) && !isNil(telefone.tipoTelefone.descricao) ? telefone.tipoTelefone.descricao : '' }</div>
                                </Col>
                                <Col span={6}>
                                    <label>DDD</label>
                                    <div>{!isNil(telefone) && !isNil(telefone.ddd) ? telefone.ddd : '' }</div>
                                </Col>
                                <Col span={6}>
                                    <label>Telefone</label>
                                    <div>{!isNil(telefone) && !isNil(telefone.numero) ? telefone.numero : ''}</div>
                                </Col> 
                            </Row>
                        ))
                    }
                </fieldset>                      
            </div>
        )
    }

}
