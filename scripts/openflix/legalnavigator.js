//for legal/ section highlight
window.addEventListener('DOMContentLoaded',function(){
    function sleep(dih){
        return new Promise(resolve=>setTimeout(resolve,dih))
    }
    async function refreshselected(){
     if(window.location.hash!=''){
        const selected=document.getElementById(window.location.hash.replaceAll('#',''))
        if(selected){
            selected.setAttribute('selected','')
            await sleep(3000)
            selected.removeAttribute('selected')
        }
    
     }
    }
    refreshselected()
    document.querySelectorAll('a').forEach(a=>{
        a.addEventListener('click',async ()=>{
            await sleep(300)
            refreshselected()
        })
    })
})