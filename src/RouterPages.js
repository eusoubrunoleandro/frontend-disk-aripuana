import React, { useContext, useState } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';

// importação
import Home from './pages/home'
import Login from './pages/acesso/login'
import Pesquisa from './pages/pesquisa'
import PerfilCliente from './pages/perfilCliente'
import Categorias from './pages/categoria'
import Promocoes from './pages/promocoes'
import SobreNos from './pages/sobrenos'
import Planos from './pages/planos'
import PromocaoShow from './pages/promocaoShow'

import Cadastrar1 from './pages/acesso/cadastrar-1'
import Cadastrar2 from './pages/acesso/cadastrar-2'
import Cadastrar3 from './pages/acesso/cadastrar-3'
import Cadastrar4 from './pages/acesso/cadastrar-4'
import Cadastrado from './pages/acesso/Cadastrado'

// area do cliente
import ClienteDados from './pages/area_cliente/cliente_dados'
import ClientePromocoes from './pages/area_cliente/cliente_promocoes'
import ClientePlanos from './pages/area_cliente/cliente_planos'
import ClienteSeguranca from './pages/area_cliente/cliente_seguranca'

// admin
import AdminClientes from './pages/admin/admin_clientes';

import NotFound from './pages/notfound';
import { AuthContext } from './context/AuthContext'
import AdminPlanos from './pages/admin/admin_planos';
import ValidacaoDeConta from './pages/acesso/ValidacaoDeConta';
import AdminHome from './pages/admin/admin_home';
import AdminCategoria from './pages/admin/admin_categoria';
import PesquisaNexa from './pages/pesquisa-nexa';
import AdminNexa from './pages/admin/admin_empreendedores_nexa';
import AdminRelatorios from './pages/admin/admin_relatorios';
import Message from './Components/Messagers';

export default function RouterPages(){
  const [ mensagem, novaMensagem ] = useState(null);

  function RotasPrivadas({ children, nivelAcesso = 1 }) {
    const location = useLocation();
    const { dadosSessao:{ Autenticado, dadosSessaoAtual } } = useContext(AuthContext);
    const { tipo_acesso } = dadosSessaoAtual;
  
    if(Autenticado){
      if(tipo_acesso < nivelAcesso) {
        const { state = '/' } = location
        novaMensagem({ content: `Sem autorização para acessar o recurso!` })
        return <Navigate to={state} state={location.pathname} replace={true}/>
      }

      return children
    }
    return <Navigate to="/login" state={location.pathname} replace={true}/>
  }
  
  function RedirectDoLogin ({ children }){
    const { dadosSessao:{ Autenticado } } = useContext(AuthContext);
    
    if(Autenticado){
      return <Navigate to={'/pesquisa'} replace={true}/>
    }
  
    return children
  }


  return(
    <>
    <Message message={mensagem} clearMessages={() => novaMensagem(null)}/>
    <Routes>      
      <Route path='/' element={<Home/>} />
      <Route path='/cadastrar/1/' element={<Cadastrar1/>} />
      <Route path='/cadastrar/2/' element={<Cadastrar2/>} />
      <Route path='/cadastrar/3/' element={<Cadastrar3/>} />
      <Route path='/cadastrar/4/' element={<Cadastrar4/>} />
      <Route path='/cadastrar/finalizado/' element={<Cadastrado/>} />

      <Route path='/login' element={
        <RedirectDoLogin>
          <Login/>
        </RedirectDoLogin>
      } />

      <Route path='/validacao/:id_negocio/:token_acesso' element={<ValidacaoDeConta/>}/>

      <Route path='/programa-de-empreendedores-ariapuana' element={<PesquisaNexa/>}/>

      <Route path='/pesquisa' element={<Pesquisa/>}/>
      <Route path='/perfil/:id_negocio/:nome_negocio' element={<PerfilCliente/>} />
      <Route path='/categoria' element={<Categorias/>} />
      <Route path='/promocoes' element={<Promocoes/>} />
      <Route path='/promocoes/visualizar/:id_promocao/:nome_promocao' element={<PromocaoShow/>} />
      <Route path='/sobre-nos' element={<SobreNos/>} />
      <Route path='/planos' element={ <Planos/> }/>

      {/* -------------------Rotas privadas--------------------- */}
      
      <Route path='/cliente/meusdados' element={
        <RotasPrivadas>
          <ClienteDados/>
        </RotasPrivadas>
      }/>

      <Route path='/cliente/minhaspromocoes' element={
        <RotasPrivadas>
          <ClientePromocoes/>
        </RotasPrivadas>
      }/>
      <Route path='/cliente/meusplanos' element={
        <RotasPrivadas>
          <ClientePlanos/>
        </RotasPrivadas>
      }/>
      <Route path='/cliente/minhaseguranca' element={
        <RotasPrivadas>
          <ClienteSeguranca/>
        </RotasPrivadas>
      }/>

      {/* ------------- Administrador ---------------- */}
      <Route path='/administrador' element={
        <RotasPrivadas nivelAcesso={9}>
          <AdminHome/>
        </RotasPrivadas>
      } />
      <Route path='/administrador/clientes' element={
        <RotasPrivadas nivelAcesso={9}>
          <AdminClientes/>
        </RotasPrivadas>
      } />
      <Route path='/administrador/planos' element={
        <RotasPrivadas nivelAcesso={9}>
          <AdminPlanos/>
        </RotasPrivadas>
      } />
      <Route path='/administrador/categorias' element={
        <RotasPrivadas nivelAcesso={9}>
          <AdminCategoria/>
        </RotasPrivadas>
      } />

      <Route path='/administrador/relatorios' element={
        <RotasPrivadas nivelAcesso={9}>
          <AdminRelatorios/>
        </RotasPrivadas>
      } />

      <Route path='/administrador/nexa' element={
        <RotasPrivadas nivelAcesso={9}>
          <AdminNexa/>
        </RotasPrivadas>
      } />

      <Route path='*' element={<NotFound/>} />
    </Routes>
    </>
  )
}