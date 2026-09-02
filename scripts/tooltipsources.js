window.addEventListener('DOMContentLoaded',function(){
  function sleep(dih){
        return new Promise(resolve=>setTimeout(resolve,dih))
  }
  fetch("../scripts/openflix/tooltipsources.json").then(txt=>txt.json()).then(source=>{
    const sourcess=source.sources
    document.querySelectorAll('[q]')?.forEach(q=>{
    const pos=q.getBoundingClientRect()
        q.addEventListener('mouseenter',async function(){
            const tooltip=document.createElement('tooltip')
            tooltip.setAttribute('tooltip',q.getAttribute('q'))
            if(sourcess[q.getAttribute('q')]){
                tooltip.innerText=sourcess[q.getAttribute('q')]
            }
            else{
                console.error(`tooltip content source is missing in database. ${q.getAttribute('q')} is not valid.`)
                console.log(sourcess)
                return
            }
            tooltip.style.transform=`translate(${pos.x/2}px,${pos.y-20}px) scale(0)`
            document.body.append(tooltip)
            await sleep(200)
            tooltip.style.transform=`translate(${pos.x}px,${pos.y}px) scale(1)`
        })
        q.addEventListener('mouseleave',function(){
            const rem=document.querySelectorAll(`tooltip[tooltip=${q.getAttribute('q')}]`)
            rem.forEach(async remt=>{
                if(remt){
                    remt.style.transform=`translate(${pos.x/2}px,${pos.y-20}px) scale(0)`
                    await sleep(200)
                    remt.remove()
                }
            })
        })
    })
  })
})