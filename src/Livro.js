import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import TratadorErros from './TratadorErros';

class FormularioLivro extends Component {

    constructor() {
        super();
        this.state = {lista : [],nome:'',email:'', senha:''};
        this.handleLivroSubmit = this.handleLivroSubmit.bind(this);
        this.setTitulo = this.setTitulo.bind(this);
        this.setPreco = this.setPreco.bind(this);
        this.setAutorId = this.setAutorId.bind(this);
      }

      handleLivroSubmit(evento){
        evento.preventDefault();    
        $.ajax({
          url:'https://cdc-react.herokuapp.com/api/livros',
          contentType:'application/json',
          dataType:'json',
          type:'post',
          data: JSON.stringify({titulo:this.state.titulo,preco:this.state.preco,autorId:this.state.autorId}),
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
    
      setTitulo(evento){
        this.setTitulo({titulo:evento.target.titulo});
      }
    
      setPreco(evento){
        this.setPreco({preco:evento.target.value});
      }  
    
      setAutorId(evento){
        this.setState({autorId:evento.target.value});
      }
    render() {
        var autores = this.props.autores.map(function(autor){
            return <option key={autor.id} value={autor.id}>{autor.nome}</option>;
          });   
    return(
        <div className="pure-form pure-form-aligned">
        <form className="pure-form pure-form-aligned" onSubmit={this.handleLivroSubmit}>
          <InputCustomizado id="titulo" name="titulo" label="Titulo: " type="text" value={this.state.titulo} placeholder="Titulo do livro" onChange={this.setTitulo} />
          <InputCustomizado id="preco" name="preco" label="Preco: " type="decimal" value={this.state.preco} placeholder="Preço do livro" onChange={this.setPreco} />
          <div className="pure-controls">
            <select value={this.state.autorId} name="autorId" onChange={this.setAutorId}>
              <option value="">Selecione</option>
              {autores}
            </select>
          </div>
          <div className="pure-control-group">                                  
            <label></label> 
            <button type="submit" className="pure-button pure-button-primary">Gravar</button>                                    
          </div>          
        </form>             
      </div>);
    }

}

class TabelaLivros extends Component {
    
    render() {
        var livros = this.props.lista.map(function(livro){
            return(
                <tr key={livro.titulo}>
                  <td>{livro.titulo}</td>
                  <td>{livro.autor.nome}</td>
                  <td>{livro.preco}</td>
                </tr>
              );
         });
        return(
            <table className="pure-table">
            <thead>
              <tr>
                <th>Titulo</th>
                <th>Autor</th>
                <th>Preco</th>
              </tr>
            </thead>
            <tbody>
              {livros}
            </tbody>
          </table>
            );
    }
}

export default class LivroBox extends Component {

    constructor(props) {
        super(props);
        this.state = {lista : [],autores:[]};
        this.atualizaListagem = this.atualizaListagem.bind(this);
      }

      componentDidMount() {
        $.ajax({
          url: "https://cdc-react.herokuapp.com/api/livros",
          dataType: 'json',
          success: function(data) {
            this.setState({lista: data});
          }.bind(this)
        });
        
        $.ajax({
          url: "https://cdc-react.herokuapp.com/api/autores",
          dataType: 'json',
          success: function(data) {
            this.setState({autores: data});
          }.bind(this)
        });
        
    }

    atualizaListagem(novaLista) {
        this.setState({lista:novaLista});
      }
        render() {
            return(
              <div>
                <div className="header">
                  <h1>Cadastro de Livros</h1>
                </div>
                <div className="content" id="content">
                  <FormularioLivro autores={this.state.autores} callbackAtualizaListagem={this.atualizaListagem}/>
                  <TabelaLivros lista={this.state.lista}/>
                </div>
              </div>
            );
          }

}