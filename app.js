import { produtosBase } from "./produtosBase.js"

let produtos = JSON.parse(localStorage.getItem("produtos")) || []

let produtoEditando = null
let produtoExcluindo = null

function salvarLocal(){
  localStorage.setItem("produtos", JSON.stringify(produtos))
}

// FORMATAR DATA
function formatarData(input){

  let v = input.value.replace(/\D/g,"") // remove tudo que não é número

  if(v.length > 8) v = v.slice(0,8)

  if(v.length >= 5){
    v = v.replace(/(\d{2})(\d{2})(\d+)/,"$1/$2/$3")
  } else if(v.length >= 3){
    v = v.replace(/(\d{2})(\d+)/,"$1/$2")
  }

  input.value = v
}

// TOAST
function mostrarMensagem(msg,tipo="ok"){
  let t=document.getElementById("toast")
  if(!t) return
  t.innerText=msg
  t.className="mostrar "+tipo
  setTimeout(()=>t.className="",2000)
}

// VALIDAR DATA
function validarDataCompleta(data){

  let [d,m,a]=data.split("/")
  let dataProd=new Date(a,m-1,d)

  let hoje=new Date()
  hoje.setHours(0,0,0,0)

  if(dataProd.getTime() === hoje.getTime()){
    mostrarMensagem("Vence hoje ❌","erro")
    return false
  }

  if(dataProd < hoje){
    mostrarMensagem("Já venceu ❌","erro")
    return false
  }

  return true
}

// SALVAR PRODUTO
function salvarProduto(){

  let codigo=document.getElementById("codigo").value
  let nome=document.getElementById("nome").value
  let validade=document.getElementById("validade").value

  if(!codigo || !nome || !validade){
    mostrarMensagem("Preencha tudo","erro")
    return
  }

  if(!validarDataCompleta(validade)) return

  produtos.push({
    id: Date.now(),
    codigo,
    nome,
    validade
  })

  salvarLocal()
  mostrarMensagem("Salvo ✅")

  document.getElementById("codigo").value=""
  document.getElementById("nome").value=""
  document.getElementById("validade").value=""
}

// 🔍 PESQUISA
function pesquisarProdutos(){

  let termo=document.getElementById("pesquisa").value.toLowerCase()
  let div=document.getElementById("resultadoPesquisa")

  if(!div) return

  div.innerHTML=""

  if(!termo) return

  let count=0

  for(let codigo in produtosBase){

    let nome=produtosBase[codigo].toLowerCase()

    if(codigo.includes(termo) || nome.includes(termo)){

      let el=document.createElement("div")
      el.className="item-pesquisa"
      el.innerHTML=`${codigo} - ${produtosBase[codigo]}`
      div.appendChild(el)

      count++
      if(count>=20) break
    }
  }
}

// ⚡ SUGESTÕES
function buscarSugestoes(){

  let codigoInput=document.getElementById("codigo")
  let nomeInput=document.getElementById("nome")
  let div=document.getElementById("sugestoes")

  if(!div) return

  let termo=(codigoInput.value || nomeInput.value).toLowerCase()

  div.innerHTML=""

  if(!termo) return

  let count=0

  for(let codigo in produtosBase){

    let nome=produtosBase[codigo].toLowerCase()

    if(codigo.includes(termo) || nome.includes(termo)){

      let el=document.createElement("div")
      el.className="item-sugestao"
      el.innerHTML=`${codigo} - ${produtosBase[codigo]}`

      el.onclick=()=>{
        codigoInput.value=codigo
        nomeInput.value=produtosBase[codigo]
        div.innerHTML=""
      }

      div.appendChild(el)

      count++
      if(count>=10) break
    }
  }
}

// 🔥 CARREGAR VENCIMENTOS (ESSENCIAL)
function carregarVencimentos(){

  let container=document.getElementById("listaVencimentos")
  if(!container) return

  container.innerHTML=""

  let lista=[...produtos]

  lista.sort((a,b)=>{
    let da=a.validade.split("/")
    let db=b.validade.split("/")
    return new Date(da[2],da[1]-1,da[0]) - new Date(db[2],db[1]-1,db[0])
  })

  lista.forEach((p,index)=>{

    let d=p.validade.split("/")
    let validade=new Date(d[2],d[1]-1,d[0])

    let hoje=new Date()
    hoje.setHours(0,0,0,0)

    let dias=Math.ceil((validade-hoje)/(1000*60*60*24))
    let borda=dias<=5?"red":"green"

    let card=document.createElement("div")
    card.className="card"
    card.style.border="2px solid "+borda

    card.innerHTML=`
      <h3>${p.nome}</h3>
      <p>Código: ${p.codigo}</p>
      <p>Validade: ${p.validade}</p>

      <div class="acoes">
        <button onclick="abrirEditar(${index})">Editar</button>
        <button onclick="abrirExcluir(${index})">Excluir</button>
      </div>
    `

    container.appendChild(card)
  })
}

// EDITAR
function salvarEdicao(){

  let novaData=document.getElementById("editarData").value
  if(!validarDataCompleta(novaData)) return

  produtos[produtoEditando].validade = novaData

  salvarLocal()
  fecharModal()
  carregarVencimentos()
}

// EXCLUIR
function confirmarExcluir(){

  produtos.splice(produtoExcluindo,1)

  salvarLocal()
  fecharModal()
  carregarVencimentos()
}

// MODAIS
function abrirEditar(index){
  produtoEditando=index
  document.getElementById("editarData").value=produtos[index].validade
  document.getElementById("modalEditar").style.display="flex"
}

function abrirExcluir(index){
  produtoExcluindo=index
  document.getElementById("modalExcluir").style.display="flex"
}

function fecharModal(){
  document.querySelectorAll(".modal").forEach(m=>m.style.display="none")
}

// 🔙 VOLTAR (AGORA FUNCIONA)
function voltar(){
  window.location.href="index.html"
}

// AUTO LOAD
document.addEventListener("DOMContentLoaded", ()=>{
  carregarVencimentos()
})

// EXPORT
window.salvarProduto=salvarProduto
window.buscarSugestoes=buscarSugestoes
window.pesquisarProdutos=pesquisarProdutos
window.formatarData=formatarData
window.voltar=voltar
window.abrirEditar=abrirEditar
window.abrirExcluir=abrirExcluir
window.salvarEdicao=salvarEdicao
window.confirmarExcluir=confirmarExcluir
window.fecharModal=fecharModal
