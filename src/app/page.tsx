"use client";

import LoadingModal from '@/components/modals/LoadingModal';
import Modal from '@/components/modals/Modal';
import { useState, useRef, useEffect  } from 'react'
import Image from 'next/image'
import loading from '../../public/cloud-upload.gif'
import loading1 from '../../public/cloud.gif'
import Api from '@/providers/http/api';

interface Convidado {
  id?: number;
  nome: string, 
  convidadoPor?: string, 
  grupo: string, 
  confirmouPresenca: boolean, 
  cor?: number
}

const convidadoLimpo = { nome: '', convidadoPor: '', grupo: "", confirmouPresenca: false}

export default function Home() {

  const inputNome = useRef(null)

  const [ lista, setLista ] = useState<Convidado[]>([])
  const [ input, setInput ] = useState<string>('')


  const [ modal, setModal ] = useState<boolean>(false)
  const [ modalAdiciona, setModalAdiciona ] = useState<boolean>(false)
  const [ modalEdita, setModalEdita ] = useState<boolean>(false)
  const [ modalCarregando, setModalCarregando ] = useState<boolean>(false)

  const [ etapa, setEtapa ] = useState<number>(1)

  const [ convidado, setConvidado ] = useState<Convidado>(convidadoLimpo)
  const [ editaConvidado, setEditaConvidado ] = useState<Convidado>(convidadoLimpo)

  ////////// Busca convidado ///////////

  async function buscaConvidados() {

    const response = await Api.get('/api/convidado');

    if(!response.convidados) return;

    setLista(response.convidados);

  }

  ////////// Busca convidado ///////////

  ////////// Modal Adiciona convidado ///////////
  function abreModalAdiciona() {

    (inputNome.current as any).focus();

    setEtapa(1);

    setConvidado(convidadoLimpo);

    setModalAdiciona(true);

  }

  function fechaModalAdiciona() {

    setEtapa(1)

    setConvidado(convidadoLimpo)

    setModalAdiciona(false)

  }
  async function adicionar() {

    // caso input seja vazio
    if(!convidado.nome) return console.log('nome não pode ser vazio');

    abreModalCarregando();

    setTimeout(fechaModalAdiciona, 1000)

    const response = await Api.post('/api/convidado', convidado)

    if(!response.convidado) return alert('ocorreu um erro')

    setLista([ convidado, ...lista ])

    setConvidado(convidadoLimpo)

    setEtapa(1)

    setTimeout(fechaModalCarregando, 2500)
    
  }

  function proximaEtapa() {

    setEtapa( etapa + 1 );

  }
  ////////// Modal Adiciona convidado ///////////

  ////////// Modal Edita convidado ///////////
  function abreModalEdita() {

    setModalEdita(true);

  }

  function fechaModalEdita() {

    setModalEdita(false);

  }

  async function salvaEdicao() {

    // caso input seja vazio
    if(!editaConvidado.nome) return console.log('nome não pode ser vazio');

    abreModalCarregando();

    setTimeout(fechaModalAdiciona, 1000)

    const response = await Api.post('/api/convidado', convidado)

    if(!response.convidado) return alert('ocorreu um erro')

    const novalista = lista.map((object)=> object.id === editaConvidado.id ? response.convidado : object)

    setLista(novalista)

    setEditaConvidado(convidadoLimpo)

    setTimeout(fechaModalCarregando, 2500)

    fechaModalEdita()

  }

  async function removeConvidado() {

    abreModalCarregando();

    setTimeout(fechaModalEdita, 1000)

    const response = await Api.delete('/api/convidado', { id: editaConvidado.id })

    if(!response.convidado) return alert('ocorreu um erro')

    const novalista = lista.filter((object)=> object.id !== editaConvidado.id)

    setLista(novalista)

    setEditaConvidado(convidadoLimpo)

    setTimeout(fechaModalCarregando, 2500)

    fechaModalEdita()

  }

  ////////// Modal Edita convidado ///////////

  ////////// Modal Loading ///////////

  function abreModalCarregando() {

    setModalCarregando(true);

  }

  function fechaModalCarregando() {

    setModalCarregando(false)

  }

  ////////// Modal Loading ///////////


  useEffect(()=>{
    buscaConvidados()
  },[])

  return (

    <main className="relative p-5 gap-5 w-full h-full bg-slate-100 flex flex-col justify-center items-center">

      <section onClick={()=> buscaConvidados()} className="w-full h-fit flex gap-3 rounded-xl">

        <input type="text" className="w-full bg-gray-50 p-3 border-4 border-white text-gray-900 text-sm rounded-xl focus:border-blue-500 outline-0 duration-150 shadow-xl" placeholder="Pesquise o nome . . ."/>

        <button className="py-3 px-4 rounded-xl bg-blue-500 hover:bg-white hover:scale-105 focus:bg-white focus:scale-105 duration-150 group">
          <svg className="h-6 fill-white group-hover:fill-blue-500 group-focus:fill-blue-500" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>
        </button>

      </section>

      <section onClick={()=> console.log(lista)} className="px-2 py-2 flex flex-col overflow-auto bg-white rounded-2xl w-full h-full shadow-xl border-4 border-slate-150">

      {
        // array de lista na tela
        lista.map(({id, nome, convidadoPor, grupo, confirmouPresenca, cor}, i)=>( 

          <div onClick={()=> {setEditaConvidado({ id, nome, convidadoPor, grupo, confirmouPresenca, cor }); abreModalEdita()}} key={i} className={`px-3 py-2 gap-2 rounded-xl flex items-center justify-start hover:scale-x-[.97] cursor-pointer text-white duration-150 opacity-80 focus:opacity-100 hover:opacity-100 ${ i%2 == 0 ? 'bg-slate-50' : 'bg-slate-200'}`}>
            
            <svg className={`fill-blue-500 h-5 ${ confirmouPresenca ? 'hidden ' : 'block' }`} viewBox="0 0 512 512"><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"/></svg>
            <svg className={`fill-blue-500 h-5 ${ confirmouPresenca ? 'block ' : 'hidden' }`} viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>
            
            <p className="text-blue-500 text-2xl font-bold mr-auto">{ nome }</p>



            <section className={`py-1 px-2  text-sm font-bold rounded-lg ${
              cor == 1 ? 'bg-fuchsia-200' :
              cor == 2 ? 'bg-violet-200' :
              cor == 3 ? 'bg-emerald-200' :
              cor == 4 ? 'bg-cyan-200' :
              'bg-gray-200'
            }`}>
              <p className={`text-xs font-bold ${
              cor == 1 ? 'text-fuchsia-600' :
              cor == 2 ? 'text-violet-600' :
              cor == 3 ? 'text-emerald-600' :
              cor == 4 ? 'text-cyan-600' :
              'text-gray-600'
            }`}>{ grupo || '-' }</p>
            </section>

            <section className={`py-1 px-2 bg-indigo-200 text-sm font-bold rounded-lg`}>
              <p className={`text-indigo-600 text-xs font-bold`}>{ convidadoPor || '-' }</p>
            </section>

          </div> 

        ))

      }

      </section>

      {/* modal adiciona convidado */}
      <Modal close={()=> fechaModalAdiciona()} open={modalAdiciona} className="">

        <div className="flex flex-col bg-white w-screen h-screen">

          {/* header */}
          <section className="p-3 flex justify-between items-center w-full h-16">

            <p className="text-xl text-blue-500 font-bold">Adicionar convidado</p>

            <button onClick={fechaModalAdiciona} className="shadow-xl p-2 bg-blue-500 rounded-xl hover:scale-110 duration-150">
              <svg className="fill-white w-7 h-7 rotate-45" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
            </button>

          </section>
          {/* header */}

          {/* content */}
          <section className="p-6 gap-5 bg-slate-200 w-full h-full flex flex-col justify-center items-center">

            <div className="gap-4 flex flex-col justify-center items-center w-full">

              <p className="text-xl text-slate-400 font-bold">{ etapa == 1 ? 'Nome do convidado' : etapa == 2 ? 'Quem convidou essa pessoa?' : etapa == 3 ? 'Escolha o grupo do convidado' : 'Confirmou presença?'}</p>

              <input type="text" onKeyUp={({key}) => key === 'Enter' && proximaEtapa() } onChange={(e)=> setConvidado({ ...convidado, nome: e.target.value }) } value={convidado.nome} ref={inputNome} className={`w-full bg-gray-50 p-4 text-slate-500 text-center font-bold text-base rounded-xl outline-0 duration-150 ${ etapa === 1 ? 'block': 'hidden' }`} placeholder="Digite o nome . . ."/>

              <input type="text" onKeyUp={({key}) => key === 'Enter' && proximaEtapa() } onChange={(e)=> setConvidado({ ...convidado, convidadoPor: e.target.value }) } value={convidado.convidadoPor} className={`w-full bg-gray-50 p-4 text-slate-500 text-center font-bold text-base rounded-xl outline-0 duration-150 ${ etapa === 2 ? 'block': 'hidden' }`} placeholder="Quem convidou . . ."/>
                
              {/* <div onClick={()=> setConvidado({ ...convidado, confirmouPresenca: !convidado.confirmouPresenca })} className={`p-3 gap-3 border-2 rounded-full w-full justify-start items-center cursor-pointer group duration-150 ${ convidado.confirmouPresenca ? 'border-blue-500 bg-blue-500' : 'border-slate-500 bg-slate-100' } ${ etapa === 4 ? 'flex' : 'hidden' }`}>
                  
                <svg className={`fill-slate-500 duration-150 ${ convidado.confirmouPresenca ? 'hidden h-7' : 'block h-5' }`} viewBox="0 0 512 512"><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"/></svg>
                <svg className={`fill-white duration-150 ${ convidado.confirmouPresenca ? 'block h-7' : 'hidden h-5' }`} viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>

                <p className={`text-slate-500 font-semibold duration-150 w-fit h-fit ${ convidado.confirmouPresenca ? 'text-white text-2xl' : 'text-slate-500 text-xl' } `}>Sim</p>

              </div> */}

              <div className={`grid grid-cols-2 gap-5 w-full ${ etapa === 4 ? 'flex' : 'hidden' }`}>

                <button onClick={()=> setConvidado({ ...convidado, confirmouPresenca: true })} className={`col-span-1 w-full h-14 bg-slate-400 rounded-2xl ${ convidado.confirmouPresenca ? 'scale-110 bg-blue-400' : 'scale-100 bg-slate-400' } duration-150 text-white font-bold`}>Sim</button>
                <button onClick={()=> setConvidado({ ...convidado, confirmouPresenca: false })} className={`col-span-1 w-full h-14 bg-slate-400 rounded-2xl ${ !convidado.confirmouPresenca ? 'scale-110 bg-blue-400' : 'scale-100 bg-slate-400' } duration-150 text-white font-bold`}>Não</button>

              </div>

            </div>

            <div className={`grid grid-cols-2 gap-5 w-full ${ etapa === 3 ? 'grid': 'hidden' }`}>

              <button onClick={()=> setConvidado({ ...convidado, cor: 1, grupo: 'familia' })} className="col-span-1 w-full h-28 bg-fuchsia-400 rounded-2xl focus:scale-110 duration-150 text-white font-bold">Familia</button>
              <button onClick={()=> setConvidado({ ...convidado, cor: 2, grupo: 'padrinhos' })} className="col-span-1 w-full h-28 bg-violet-400 rounded-2xl focus:scale-110 duration-150 text-white font-bold">Padrinhos</button>
              <button onClick={()=> setConvidado({ ...convidado, cor: 3, grupo: 'amigos' })} className="col-span-1 w-full h-28 bg-emerald-400 rounded-2xl focus:scale-110 duration-150 text-white font-bold">Amigos</button>
              <button onClick={()=> setConvidado({ ...convidado, cor: 4, grupo: 'conhecidos' })} className="col-span-1 w-full h-28 bg-cyan-400 rounded-2xl focus:scale-110 duration-150 text-white font-bold">Conhecidos</button>

            </div>


          </section>
          {/* content */}

          {/* footer */}
          <section className="gap-3 p-3 flex bg-white center-between items-center w-full h-16 text-white">
            
          { 
              etapa === 1 ? 

              <button onClick={proximaEtapa} className={`p-2 gap-2 w-full flex font-bold rounded-xl bg-blue-500 justify-center items-center duration-150 ${convidado.nome ? 'opacity-100' : 'opacity-40'}`}>
                {/* <svg className="fill-white h-5" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg> */}
                avançar
              </button>

              : null
            }

            {
              etapa === 2 ? 

              <button onClick={proximaEtapa} className={`p-2 gap-2 w-full flex font-bold rounded-xl bg-blue-500 justify-center items-center duration-150 ${convidado.convidadoPor ? 'opacity-100' : 'opacity-40'}`}>
                {/* <svg className="fill-white h-5" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg> */}
                avançar
              </button>
              
              : null
            }

{
              etapa === 3 ? 

              <button onClick={proximaEtapa} className={`p-2 gap-2 w-full flex font-bold rounded-xl bg-blue-500 justify-center items-center duration-150 ${convidado.convidadoPor ? 'opacity-100' : 'opacity-40'}`}>
                {/* <svg className="fill-white h-5" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg> */}
                avançar
              </button>
              
              : null
            }

            {
              etapa === 4 ?

              <button onClick={adicionar} className={`p-2 gap-2 w-full flex font-bold rounded-xl bg-blue-500 justify-center items-center duration-150 ${convidado.nome && convidado.convidadoPor ? 'opacity-100' : 'opacity-40'}`}>
                {/* <svg className="fill-white h-5" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg> */}
                adicionar
              </button>
              
              : null
            }

          </section>
          {/* footer */}

        </div>

      </Modal>
      {/* modal adiciona convidado */}

      {/* modal edita convidado */}
      <Modal close={()=> fechaModalEdita()} open={modalEdita} className="p-3">

        <div className="flex flex-col bg-white w-screen h-screen">

          {/* header */}
          <section onClick={()=> console.log(editaConvidado)} className="p-3 flex justify-between items-center w-full h-16">

            <p className="text-xl text-blue-500 font-bold">Editar convidado</p>

            <button onClick={fechaModalEdita} className="shadow-xl p-2 bg-blue-500 rounded-xl hover:scale-110 duration-150">
              <svg className="fill-white w-7 h-7 rotate-45" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
            </button>

          </section>
          {/* header */}

          {/* content */}
          <section className="p-6 gap-3 bg-slate-200 w-full h-full flex flex-col justify-center items-center">


            <p className="w-full text-slate-400 font-bold">Nome</p>
            <input type="text" onKeyUp={({key}) => key === 'Enter' && proximaEtapa() } onChange={(e)=> setEditaConvidado({ ...editaConvidado, nome: e.target.value }) } value={editaConvidado.nome} className={`w-full bg-gray-50 p-4 text-slate-500 text-center font-bold text-base rounded-xl outline-0 duration-150 block`} placeholder="Digite o nome . . ."/>
            
            <p className="w-full text-slate-400 font-bold">Quem convidou</p>
            <input type="text" onKeyUp={({key}) => key === 'Enter' && proximaEtapa() } onChange={(e)=> setEditaConvidado({ ...editaConvidado, convidadoPor: e.target.value }) } value={editaConvidado.convidadoPor} className={`w-full bg-gray-50 p-4 text-slate-500 text-center font-bold text-base rounded-xl outline-0 duration-150 block`} placeholder="Convidado por . . ."/>
            
            <p className="w-full text-slate-400 font-bold">Grupo</p>
            <div className={`grid grid-cols-2 gap-5 w-full`}>

              <button onClick={()=> setEditaConvidado({ ...editaConvidado, cor: 1, grupo: 'familia' })} className={`col-span-1 w-full h-28 bg-fuchsia-400 ${ editaConvidado.grupo == 'familia' ? 'scale-110 opacity-100' : 'scale-100 opacity-50'} rounded-2xl duration-150 text-white font-bold`}>Familia</button>
              <button onClick={()=> setEditaConvidado({ ...editaConvidado, cor: 2, grupo: 'padrinhos' })} className={`col-span-1 w-full h-28 bg-violet-400 ${ editaConvidado.grupo == 'padrinhos' ? 'scale-110 opacity-100' : 'scale-100 opacity-50'} rounded-2xl duration-150 text-white font-bold`}>Padrinhos</button>
              <button onClick={()=> setEditaConvidado({ ...editaConvidado, cor: 3, grupo: 'amigos' })} className={`col-span-1 w-full h-28 bg-emerald-400 ${ editaConvidado.grupo == 'amigos' ? 'scale-110 opacity-100' : 'scale-100 opacity-50'} rounded-2xl duration-150 text-white font-bold`}>Amigos</button>
              <button onClick={()=> setEditaConvidado({ ...editaConvidado, cor: 4, grupo: 'conhecidos' })} className={`col-span-1 w-full h-28 bg-cyan-400 ${ editaConvidado.grupo == 'conhecidos' ? 'scale-110 opacity-100' : 'scale-100 opacity-50'} rounded-2xl duration-150 text-white font-bold`}>Conhecidos</button>

            </div>

            <p className="w-full text-slate-400 font-bold">Confirmou presença</p>
            <div className={`flex gap-5 w-full`}>

              <button onClick={()=> setEditaConvidado({ ...editaConvidado, confirmouPresenca: true })} className={`col-span-1 w-full h-14 bg-slate-400 rounded-2xl ${ editaConvidado.confirmouPresenca ? 'scale-110 bg-blue-400' : 'scale-100 bg-slate-400' } duration-150 text-white font-bold`}>Sim</button>
              <button onClick={()=> setEditaConvidado({ ...editaConvidado, confirmouPresenca: false })} className={`col-span-1 w-full h-14 bg-slate-400 rounded-2xl ${ !editaConvidado.confirmouPresenca ? 'scale-110 bg-blue-400' : 'scale-100 bg-slate-400' } duration-150 text-white font-bold`}>Não</button>

            </div>

          </section>
          {/* content */}

          {/* footer */}
          <section className="gap-3 p-3 flex bg-white center-between items-center w-full h-16 text-white">

            <button onClick={removeConvidado} className={`p-2 gap-2 w-full flex font-bold rounded-xl bg-red-400 justify-center items-center duration-150`}>
              {/* <svg className="fill-white h-5" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg> */}
              remover
            </button>

            <button onClick={salvaEdicao} className={`p-2 gap-2 w-full flex font-bold rounded-xl bg-blue-500 justify-center items-center duration-150 ${ convidado.convidadoPor && editaConvidado.nome ? 'opacity-100' : 'opacity-40'}`}>
              {/* <svg className="fill-white h-5" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg> */}
              salvar
            </button>

          </section>
          {/* footer */}

        </div>

      </Modal>

      <LoadingModal open={modalCarregando}>
        <div onClick={fechaModalCarregando} className="flex flex-col bg-white w-screen h-screen justify-start items-center">
          <Image src={loading} width={500} height={500} alt="Picture of the author" className="animate-pulse"/>
          <p className={`text-[#1897ff] text-5xl font-bold opacity-80 animate-pulse animate-bounce dutarion-50`}>Salvando</p>
        </div>
      </LoadingModal>

      <button onClick={abreModalAdiciona} className="bottom-10 right-3 absolute p-4 bg-blue-500 rounded-full hover:scale-110 duration-150">
        <svg className="fill-white h-6" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
      </button>

      <p className="left-2 bottom-6 absolute text-sm font-bold text-slate-400">{lista.length} convidados</p>

    </main>

  )
}
