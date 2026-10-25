window.addEventListener('contextmenu',async function(ev){
    if(window.isWrapped()){
        ev.preventDefault()
        if(document.querySelector('rightclick')){
            document.querySelectorAll('rightclick').forEach(rightc=>{
                rightc.remove()
            })
        }
        function ifIsElement(el){
            if(ev.target==el){
                return ev.target
            }
            else if(ev.target.closest(el)){
                return ev.target.closest(el)
            }
            else{
                return false
            }
        }
        const right=document.createElement('rightclick')
        function addItem(name){
            const item=document.createElement('item')
            item.innerText=name
            right.append(item)
            return item
        }
        async function closeMenu(){
            right.setAttribute('closing','')
            await sleep(300)
            right.remove()
        }
        const controls=this.document.createElement('Rcontrols')
        controls.innerHTML=`
                <button nav="prev"><i class="bi bi-chevron-left"></i></button>
                <button nav="next"><i class="bi bi-chevron-right"></i></button>
                <button nav="reload"><i class="bi bi-arrow-clockwise"></i></button>
`       
        const fullwindow=ifIsElement('fullwindow')||ifIsElement('iframewindow')
        controls.querySelector('[nav="prev"]').addEventListener('click',async function(){
            if(fullwindow){
                fullwindow.setAttribute('closing','')
                await sleep(300)
                fullwindow.remove()
            }
            else{
                window.history.back()
            }
        })
        if(fullwindow){
            let closr=addItem('close window')
            closr.addEventListener('click',async function(){
                fullwindow.setAttribute('closing','')
                closeMenu()
                await sleep(300)
                fullwindow.remove()
            })

        }
        if(ev.target.hasAttribute('parents')){
            const slide=ev.target.closest('newshi').querySelector(`img[name="${ev.target.closest('infobar').querySelector('[info=title]').innerText}"]`)
            if(slide?.hasAttribute('id')){
                const copy=addItem('copy link')
                copy.addEventListener('click',async function(){
                    try{
                        await navigator.clipboard.writeText(`https://www.imdb.com/title/${slide.getAttribute('id')}/parentalguide/?ref_=openflix_che`)
                    }
                    catch(er){
                        console.error(`error when copying url to clipboard. ${er}`)
                    }
                    closeMenu()
                })
            }
        }
        right.append(controls)
        let properX=ev.clientX+'px'
        if((window.innerWidth-ev.clientX)<=125){
            properX=`calc(${ev.clientX}px - 100%)`
        }
        right.style.transform=`translate(${properX},${ev.clientY}px)`
        document.body.append(right)
        window.refreshNav()
    }
})
window.addEventListener('click',async function(ev){
    const menu=document.querySelector('rightclick')
    if(menu&&!menu.contains(ev.target)){
        menu.setAttribute('closing','')
        await sleep(300)
        menu.remove()
    }
})