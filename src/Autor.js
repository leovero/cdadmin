import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import CheckboxCustomizado from './componentes/CheckboxCustomizado';
import TratadorErros from './TratadorErros';

class FormularioAutor extends Component {

    constructor() {
        super();
        this.state = {lista : [],nome:'',email:'', senha:'',checked: false };
        this.enviaForm = this.enviaForm.bind(this);
        this.setNome = this.setNome.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setSenha = this.setSenha.bind(this);
        this.checked = this.checked.bind(this);
      }

    enviaForm(evento){
        evento.preventDefault();    
        $.ajax({
          url:'https://cdc-react.herokuapp.com/api/autores',
          contentType:'application/json',
          dataType:'json',
          type:'post',
          data: JSON.stringify({nome:this.state.nome,email:this.state.email,senha:this.state.senha}),
          success: function(resposta){
            this.props.callbackAtualizaListagem(resposta);       
          }.bind(this),
          error: function(resposta){
            if(resposta.status === 400){
              new TratadorErros().publicaErros(resposta.responseJSON);
            }
            console.log("erro");
          }      
        });
      }
    
      setNome(evento){
        this.setState({nome:evento.target.value});
      }
    
      setEmail(evento){
        this.setState({email:evento.target.value});
      }  
    
      setSenha(evento){
        this.setState({senha:evento.target.value});
      }

      checked(evento) {
        console.log(evento.target);
        console.log(evento.target.checked);
        if (evento.target.checked) {        
          this.setState({ checked: true });
        } else {
          this.setState({ checked: false });
        }
      }
    render() {
    return(
    <div className="pure-form pure-form-aligned">
    <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
      <InputCustomizado id="nome" type="text" name="nome" value={this.state.nome} onChange={this.setNome} label="Nome"/>                                              
      <InputCustomizado id="email" type="email" name="email" value={this.state.email} onChange={this.setEmail} label="Email"/>                                              
      <InputCustomizado id="senha" type="password" name="senha" value={this.state.senha} onChange={this.setSenha} label="Senha"/>
      <CheckboxCustomizado
          id="checkbox"
          value="nome"
          name="nome"
          label="Usar nome default"
          isChecked={this.state.checked}
          onChange={this.checked}/>
      <div className="pure-control-group">                                  
        <label></label> 
        <button type="submit" className="pure-button pure-button-primary">Gravar</button>                                    
      </div>
    </form>             
  </div>);
    }
}
class TabelaAutores extends Component {
    
    render() {
        return(
            <div>            
            <table className="pure-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>email</th>
                </tr>
              </thead>
              <tbody>
                {
                   this.props.lista.map(function(autor){
                    return (
                      <tr key={autor.id}>
                        <td>{autor.nome}</td>
                        <td>{autor.email}</td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table> 
          </div>  
            );
    }
}

export default class AutorBox extends Component{

    constructor() {
        super();    
        this.state = {lista : []};
        this.atualizaListagem = this.atualizaListagem.bind(this);
      }
    
      componentDidMount(){  
        $.ajax({
            url:"https://cdc-react.herokuapp.com/api/autores",
            dataType: 'json',
            success:function(resposta){    
              this.setState({lista:resposta});
            }.bind(this)
          } 
        );          
      }

      atualizaListagem(novaLista) {
        this.setState({lista:novaLista});
      }

    render() {
      return(
        <div>
           <div className="header">
          <h1>Cadastro de autores</h1>
        </div>
        <div className="content" id="content">                            
          <FormularioAutor callbackAtualizaListagem={this.atualizaListagem}/>
          <TabelaAutores lista={this.state.lista}/>   
        </div>       
        </div>
      );
    }
  }  