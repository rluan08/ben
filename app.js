import { produtosBase } from "./produtosBase.js"

let produtos = JSON.parse(localStorage.getItem("produtos")) || []

function salvarLocal(){
  localStorage.setItem("produtos", JSON.stringify(produtos))
}

// 🔥 FORMATAÇÃO
function formatarData(input){

  let v = input.value.replace(/\D/g,"")

  if(v.length > 8) v = v.slice(0,8)

  if(v.length >= 5){
    v = v.replace(/(\d{2})(\d{2})(\d+)/,"$1/$2/$3")
  } else if(v.length >= 3){
    v = v.replace(/(\d{2})(\d+)/,"$1/$2")
  }

  input.value = v
}

// 🔥 TOAST
function mostrarMensagem(msg,tipo="ok"){
  let t=document.getElementById("toast")
  if(!t) return
  t.innerText=msg
  t.className="mostrar "+tipo
  setTimeout(()=>t.className="",2000)
}

// 🔥 VALIDAÇÃO COMPLETA (SEM BUG)
function validarDataCompleta(data){

  if(!data || data.length !== 10){
    mostrarMensagem("Data incompleta","erro")
    return false
  }

  let [d,m,a] = data.split("/")

  d = parseInt(d)
  m = parseInt(m)
  a = parseInt(a)

  // mês válido
  if(m < 1 || m > 12){
    mostrarMensagem("Mês inválido","erro")
    return false
  }

  // dias do mês correto
  let diasMes = new Date(a, m, 0).getDate()

  if(d < 1 || d > diasMes){
    mostrarMensagem("Dia inválido","erro")
    return false
  }

  let dataProd = new Date(a, m-1, d)

  let hoje = new Date()
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

// 🔥 SALVAR
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

// EXPORT
window.salvarProduto=salvarProduto
window.buscarSugestoes=buscarSugestoes
window.pesquisarProdutos=pesquisarProdutos
window.formatarData=formatarData
