window.addEventListener('DOMContentLoaded',function(){
function sleep(dih){
        return new Promise(resolve=>setTimeout(resolve,dih))
}
let XS
let isStandalone=false
window.tryopenurl=(title,url)=>{
    try{
        XS.emit('openurl',title,url)
    }
    catch(er){
        console.error(er)
    }
}
fetch('/platformInfo').then(txt=>txt.json()).then(info=>{
    isStandalone=false
    S=io()
    XS=S
    console.log(`[packagemgr] using "${info.wrapper.fullstring}" of openflix. (wrapper)`)
    Object.entries(info.wrapper).forEach(([key,val])=>{
        console.log(`   > ${key} : ${val} (${typeof val})`)
    })
    S.on('connect',function(){
        S.emit('firsttime',async function(info){
         if(info){
            info['username']=(localStorage.getItem('username')||'not found (jslsnoitem)')
            info['docname']='temp'
            console.log(info)
            const {error}=await supabase.from('OpenFlix_wrappers').insert(info)
            if(error){
                console.log(error)
            }
         }
        })
        S.on('refresh',function(){
            window.location.reload()
        })
        S.on('supaauth',function(code){
            sessionCode(code)
            console.log('auth callback recieved')
        })
        S.emit('sources',SourceAdded=>{
            if(!SourceAdded){
                async function sendsource(gsource){
                if(document.querySelector('wrappersource')){
                    document.querySelectorAll('wrappersource').forEach(wrappr=>{
                        wrappr.setAttribute('load','')
                    })
                }
                window.loader('loading','s')
                S.emit('setSource',(localStorage.getItem('username')||'username::befrsetup'),gsource,async added=>{
                    try{
                        window.loader('loading','h')
                    }
                    catch(er){}
                    if(added){
                        if(document.querySelector('wrappersource')){
                            document.querySelectorAll('wrappersource').forEach(async wrp=>{
                                wrp.setAttribute('hiddenA','')
                                await sleep(300)
                                document.querySelector('wrappersource').remove()
                            })
                        }
                        window.location.reload()
                        console.log('[wrapmgr] source import successful')
                    }
                    else{
                        window.fail('failed')
                        if(document.querySelector('wrappersource')){
                            document.querySelector('wrappersource').forEach(wrpp=>{
                                wrpp?.removeAttribute('load')
                            })
                        }
                        console.error('[wrapmgr] source import failed')
                    }
                 })
                }
                if(document.querySelector('wrappersource[setup]')){
                    document.querySelector('wrappersource[setup]')?.removeAttribute('hidden')
                    document.querySelector('wrappersource[setup]')?.removeAttribute('hiddenB','')
                    document.querySelector('wrappersource[setup]')?.removeAttribute('hiddenA','')
                    document.querySelector('wrappersource[setup] button[mainchoice]').addEventListener('click',function(){
                        sendsource('https://openflix.site/sources/')
                    })
                    document.querySelector('wrappersource[source] button[back="setup"]').addEventListener('click',async function(){ 
                        // document.querySelector('wrappersource[source]').setAttribute('hidden','')
                        document.querySelector('wrappersource[source]').setAttribute('hiddenA','')
                        document.querySelector('wrappersource[source]').setAttribute('hiddenB','')
                        document.querySelector('wrappersource[setup]')?.removeAttribute('hidden')
                        document.querySelector('wrappersource[setup]')?.removeAttribute('hiddenA')
                        document.querySelector('wrappersource[setup]')?.removeAttribute('hiddenB')
                    })
                    document.querySelector('wrappersource[setup] button:not([mainchoice])').addEventListener('click',function(){
                        document.querySelector('wrappersource[setup]').setAttribute('hidden','')
                        document.querySelector('wrappersource[setup]').setAttribute('hiddenA','')
                        document.querySelector('wrappersource[setup]').setAttribute('hiddenB','')
                        document.querySelector('wrappersource[source]')?.removeAttribute('hidden')
                        document.querySelector('wrappersource[source]')?.removeAttribute('hiddenA')
                        document.querySelector('wrappersource[source]')?.removeAttribute('hiddenB')
                    })
                document.querySelector('wrappersource[source]').querySelectorAll('wrtab').forEach(tab=>{
                    tab.addEventListener('click',function(){
                        document.querySelector(`wropt[tab=${tab.getAttribute('tab')}]`).setAttribute('selected','')
                        document.querySelector(`wropt:not([tab=${tab.getAttribute('tab')}])`)?.removeAttribute('selected')
                        document.querySelectorAll('wrtab').forEach(tabb=>{
                            if(tab!=tabb){
                                tabb?.removeAttribute('selected')
                            }
                            else{
                             tab.setAttribute('selected','')
                            }
                        })
                    })
                })
                document.querySelector('wrappersource button[submit]').addEventListener('click',function(){
                    const val=document.querySelector('wrappersource input').value
                    if(val.replaceAll(' ','').trim()!=''){
                        sendsource(val)
                    }
                })
                }
                

                fetch('https://cdn.jsdelivr.net/gh/tromoSM/OpenFlix_sources_library@refs/heads/main/manifest.json').then(lib=>lib.json()).then(library=>{
                    console.log(library)
                    library.sources.forEach(sources=>{
                        if(document.querySelector('wropt[tab="choose"] library')){
                            const item=document.createElement('item')
                            const main=document.createElement('h4')
                            main.innerHTML=sources.name
                            const by=document.createElement('p')
                            by.innerHTML=sources.by
                            item.append(main,by)
                            document.querySelector('wropt[tab="choose"] library').append(item)
                            item.addEventListener('click',function(){
                                sendsource(sources.url)
                            })
                        }
                    })
                })

            }
        })
       if(document.querySelector('[wrapc="clearsources"]')){
            document.querySelectorAll('[wrapc="clearsources"]').forEach(clear=>{
              clear.addEventListener('click',function(){
                console.log('action: clear sources')
                S.emit('clearsources',(localStorage.getItem('username')||'username::befrsetup'),cleared=>{
                    if(cleared){
                        alert('sources and saved source links has been cleared.')
                        window.location.reload()
                        if(window.location.pathname.includes('account')){
                            window.location.pathname='/'
                        }
                    }
                    else{
                        alert('failed to clear sources. check log')
                    }
                })
              })
            })
       }
       if(document.querySelector('[wrapc="openlog"]')){
            document.querySelectorAll('[wrapc="openlog"]').forEach(log=>{
              log.addEventListener('click',function(){
                S.emit('openlog',(localStorage.getItem('username')||'username::befrsetup'),opened=>{
                    if(!opened){
                        alert('failed to open log. open the log manually : %APPDATA%TromoSM/OpenFlix/{APPVERSION}/log.log')
                    }
                })
              })
            })
       }
    })

    document.documentElement.setAttribute('wrapped',info.wrapper.platform)
    window.isWrapped=()=>(info.wrapper.platform || 'unknown wrapper')
        document.querySelectorAll('[nav="prev"]').forEach(prev=>{
            function refresh(){
                if(window.history.length>1){
                    prev.setAttribute('clickable','')
                }
            }
            refresh()
            prev.addEventListener('click',async function(){
                let method
                if(document.querySelector('fullwindow')){
                    method='fullwindow'
                    document.querySelector('fullwindow').setAttribute('closing','')
                    await sleep(300)
                    document.querySelector('fullwindow').remove()
                }
                else if(document.querySelector('iframewindow')){
                    method='player or full window'
                    document.querySelector('iframewindow').setAttribute('closing','')
                    await sleep(300)
                    document.querySelector('iframewindow').remove()  
                }
                else if(window.history.length>1){
                    method='native page'
                    window.history.back()
                }
                console.log(`[wrapper] user navigated backwards from ${method}`)
                refresh()
            })
        })
        window.refreshNav=()=>{
        document.querySelectorAll('[nav="next"]').forEach(next=>{
            next.setAttribute('clickable','')
            next.addEventListener('click',function(){
                window.history.forward()
                console.log(`[wrapper] user navigated forwards`)
            })
        })
        document.querySelectorAll('[nav="reload"]').forEach(reload=>{
            reload.setAttribute('clickable','')
            reload.addEventListener('click',function(){
                console.log(`[wrapper] page reloaded by user`)
                window.location.reload()
            })
        })
        window.addEventListener('keyup',async function(ev){
            if(ev.key=='F11'){
                ev.preventDefault()
                document.body.setAttribute('transition','all')
                S.emit('fullscreen')
                await sleep(300)
                document.body?.removeAttribute('transition')
            }
        })
        window.wrapperSetTitle=function(title=null){
            if(title){
                S.emit('title',title)
            }
        }
        }
        window.refreshNav()

}).catch(er=>{
    isStandalone=true
    window.isWrapped=()=>{
     try{            
        if(window.platform_debug){
            console.error(er)
        }
        else{
            // console.log('window.platform_debug to debug platforminfo')
        }
        return false
        }
     catch(er){return false}
    }
})
})
