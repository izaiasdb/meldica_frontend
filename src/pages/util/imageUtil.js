import React, { Component } from "react";
import semFotoPerfil from "../../assets/images/semfoto.png";
import { Modal, Button } from "antd";
import { URL_IMAGEM } from '../util/constUtils'

class ImageUtil extends Component {

    constructor(props) {
        super(props);
        this.state = { modal: false };
    }
   
    toggle = () => this.setState((prevState) => ({modal: !prevState.modal}))

    render() {
        const { src, title = "Pessoa", maxHeight = "", maxWidth = "100%", size, className, fixed = false } = this.props
        const { modal } = this.state
        const style = {
            maxWidth, cursor : 'pointer', maxHeight, borderRadius : "5px", 
            display: 'block',margin: '0 auto'
        }

        const styleFixed = {
            maxWidth, cursor : 'pointer', maxHeight, borderRadius : "5px", 
            display: 'block',margin: '0 auto', width: size + "px", height: size + "px"
        }

        if (src && src !== 'INDI.JPG' && src.length > 0) {
            var element = (<div><img alt="Sem foto de perfil" src={semFotoPerfil} style={{maxWidth, height: maxHeight, borderRadius : "5px"}}></img></div>)
            
            // checkUrl("http://172.18.4.42:3100/imageUtil?tamanho=400&path=" + src, function() { 
            //     console.log('ok')
                element = (
                    <div>
                        <img onClick={this.toggle} 
                            style={fixed ? styleFixed : style}
                            title={title} 
                            alt={title}
                            // src={"http://172.18.4.42:3100/imageUtil?tamanho="+size+"&path="+src}
                            src={URL_IMAGEM + "?tamanho="+size+"&path="+src}                            
                            />
                        <Modal title={title} 
                            visible={modal} 
                            className={className}
                            onOk={this.toggle}
                            onCancel={this.toggle}
                            footer={[
                                <div key={"1"} style={{textAlign: "center"}}>
                                        <Button key="esc" type={"primary"} onClick={this.toggle}>
                                        ok
                                        </Button>
                                </div>
                                ]}>
                            <img style={{ maxWidth, borderRadius : "5px"}} 
                                    title={title} 
                                    alt={title}
                                    src={ URL_IMAGEM + "?tamanho=400&path="+src}/> 
                        </Modal>
                    </div>
                )            
            // }, function(){ 
            // //     console.log('false')
            // })

            return element;
            
            //checkUrl("http://172.18.4.42:3100/imageUtil?tamanho=400&path=" + src, function(){ ok = true }, function(){ ok = false } );
        } else {
            return (<div><img alt="Sem foto de perfil" src={semFotoPerfil} style={{maxWidth, height: maxHeight, borderRadius : "5px"}}></img></div>)
        }
    }
}

export default ImageUtil;

// export const checkUrl = function(url, good, bad) {
//     //var deferred = Q.defer();
//     var img = new Image();
//     img.onload = good; 
//     img.onerror = bad;
//     //img.onsuccess = good;
//     img.src = url;
//     //deferred.resolve();
// }

//https://bharatchodvadiya.wordpress.com/2015/04/08/how-to-check-if-an-image-exists-using-javascript/
export const checkUrl = function(imageUrl, callBack) {
    var imageData = new Image();
    imageData.onload = function() {
        callBack(true);
    };
    imageData.onerror = function() {
        callBack(false);
    };
    imageData.src = imageUrl;
}