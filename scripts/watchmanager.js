let allowprint=true
let disablerclick=false
let disablepopups=true

const logdebug=false

//logicshi
const minwatchcount=60

function sleep(dih){
        return new Promise(resolve=>setTimeout(resolve,dih))
}
function logg(log='',type='log',private=false,watchlog=true,fallback=null,notifyredact=true){
    if(logdebug){
        console.log(`[watchmanager/debug=log]\n   log: ${log}\n   type: ${type}\n   private: ${private}\n   watchlog : ${watchlog}\n   printallowed: ${allowprint}`)
    }
    if(!allowprint&&private){
        if(fallback==null){
            return
        }
        else{
            log=fallback
        }
    }
    if(typeof log=='object'){
        log=JSON.stringify(log)
    }
    if(watchlog){
        if(!allowprint&&private&&fallback!=null&&notifyredact){
            log="[watchmanager]/B] "+log
        }
        else{
            log="[watchmanager] "+log
        }
    }
    let loggg=console.log
    if(type!='log'){
        loggg=console[type]
    }
    loggg(log)
}

window.watchdebug=()=>{
    logg('visual debugger is on')
    document.querySelectorAll('video,iframewindow,iframe,controls,progr,value,shadowval,button,i,button *').forEach((de,index)=>{
        if(index%2==0){
            de.style.border='1px solid #ff0048'
        }
        else{
            de.style.border='1px solid #00a2ff'
        }
    })
}
let servers=[]
const waitforsources=new Promise(res=>{
  fetch('sources/sources.json').then(txt=>txt.json()).then(sources=>{
    servers=sources.server_list
    fetch('sources/config.json').then(tx=>tx.json()).then(config=>{
        allowprint=!config.config.hide_server_printing.value
        logg(`starting watchmanager <config:${allowprint}>`)
        disablerclick=config.config.player_disable_rightclick.value
        logg(`<config> config_pdr : ${disablerclick}`)
        disablepopups=config.config.player_disable_popups.value
        logg(`<config> config_expop : ${disablepopups}`)
        res()
    }).catch(er=>{
        logg(er,'error')
        res()
    })
  }).catch(er=>{
    logg(er,'error')
    res()
  })
})
window.externalEvents=0
window.addEventListener('DOMContentLoaded',async function(){
    await waitforsources
    let trash=0
    logg(`Found ${servers.length} servers.`)
    window.watch=async (info={title:'Using debug mode : contact developer',imdb:window.debug_currentID,useDefault:true,type:window.lastItemType},useidroot=false,keyword={},debug='none',adsallowed=true,itemtype='movies',itemtype_series={episode:null,season:null})=>{

        window.performancemanager={blockingMainPage:true,performanceHeavy:true,calledBy:"watchmanager"}
        let working=false
        let preferredType=(debug=='none')?'embed':'test'
        if(!useidroot){
            info.imdb=info[keyword.id_list][keyword.imdb]
        }
        if(info.useDefault){
            logg(`[DEBUGGER] using debuggers default values. movie chosen from latest openpage visit :\n\n${JSON.stringify(info)}`,'warn')
        }
        if(!adsallowed){
            console.log('[ADMANAGER] servers with ad attributes will not be used because the current player setting doesnt allow any ads')
        }
        for(const server of servers){
                if(server.type==preferredType){
                    if(!adsallowed&&server?.attributes?.popup_ads||server?.attributes?.incontent_ads||server?.attributes?.fixed_ads){
                        logg(`[ADMANAGER] server hidden because it contains an ad attribute while the current player setting doesnt allow any ads (${server.name}):\n   popup: ${server?.attributes?.popup_ads}\n   incontent : ${server?.attributes?.incontent_ads}\n   fixed : ${server?.attributes?.fixed_ads}`,
                            'warn',true,true,'[ADMANAGER] server hidden because it contains ads while the current player setting doesnt allow any ads',true
                        )
                        trash++
                    }
                    if(itemtype!='movies'&&!(server?.type_specific_url&&server?.type_specific_url[itemtype.toLowerCase()])){
                        logg(`[WATCHMANAGER] server:"${server.name}" hidden because it does not support type_specific:${itemtype}`,'log',true,true,`[WATCHMANAGER] server hidden because it does not support type_specific:${itemtype}`,true)
                    }
                    
                    else{
                        working=server
                        break
                    }
                }
                trash++
            }
        if(working){
            let imdbX=''
            let tmdbX=''
            let openflixid=''
            let openflixidtype=''
            let season=''
            let episode=''

            if(info.imdb){
                imdbX=info.imdb
                openflixid=Number(String(imdbX).replaceAll('t',''))+67
                openflixidtype='i'
            }
            if(info.tmdb){
                tmdbX=info.tmdb
                if(!info.imdb){
                    openflixid=Number(String(tmdbX).replaceAll('t',''))+67
                    openflixidtype='t'
                }
            }
            if(itemtype_series?.season&&itemtype_series?.episode){
                season=itemtype_series.season
                episode=itemtype_series.episode
            }
            else{
                logg(`couldnt find tmdb id for "${info.title}"`,'warn')
            }
            if(info.type){
              if(info?.type.includes('tv')||info?.type.includes('series')){
                //add support to series
             }
            }
            else{logg('Info.Type is not supported')}
            
            const dynamiclink=String(itemtype=='movies'?working.url:(working.type_specific_url[itemtype]||working.url)).replaceAll('{imdb}',imdbX).replaceAll('{tmdb}',tmdbX).replaceAll('{openflixID}',openflixid).replaceAll('{trailer}','trailer').replaceAll('{season}',season).replaceAll('{episode}',episode).replaceAll('{slug}',info.title)
            // logg(dynamiclink)
            const normaltitle=document.querySelector('title').innerText
            document.querySelector('title').innerText=info.title
            logg(`Found a working server (failed-attempts->${trash}) : using "${working.name}"`,'log',true)
            window.loader('loading','s')
            const wrapper=document.createElement('iframewindow')
            wrapper.setAttribute('closing','')
            wrapper.setAttribute('player','')
            const back=document.createElement('button')
            back.setAttribute('hiddenA','')
            back.setAttribute('back','')
            wrapper.append(back)

            back.addEventListener('click',async function(){
                logg('closing player (closed by user)')
                document.querySelector('title').innerText=normaltitle
                wrapper.setAttribute('closing','')
                await sleep(300)
                wrapper.remove()
            })
            const controlbar=document.createElement('controls')
            const playstate=document.createElement('button')
            playstate.innerHTML=`<i class="bi bi-pause-fill"></i>`
            const volume=document.createElement('button')
            volume.innerHTML='<i class="bi bi-volume-up-fill"></i></i>'
            const progress=document.createElement('progr')
            const progressvalue=document.createElement('value')
            const shadowval=document.createElement('shadowval')
            const progresspredict=document.createElement('p')
            shadowval.append(progresspredict)
            progress.append(progressvalue,shadowval)
            const aspect=document.createElement('button')
            aspect.innerHTML='<i class="bi bi-aspect-ratio-fill"></i></i>'
            controlbar.append(playstate,volume,progress,aspect)
            if(working.type=='url'||working.type=='test'){
                let playing=true
                let changingbyuser=false
                let gonnachangets=false
                wrapper.append(controlbar)
                const vid=document.createElement('video')
                vid.setAttribute('a','normal')
                const srcc=document.createElement('source')
                if(vid.muted){
                  volume.innerHTML='<i class="bi bi-volume-mute-fill"></i></i>'
                  logg('current playing media is muted automatically by browser.')
                }
                volume.addEventListener('click',function(){
                    if(vid.muted){
                         volume.innerHTML='<i class="bi bi-volume-up-fill"></i></i>'
                         vid.muted=false
                         logg('volume set to 100 by user')
                    }
                    else{
                         volume.innerHTML='<i class="bi bi-volume-mute-fill"></i></i>'
                         vid.muted=true
                         logg('volume set to 0 by user')
                    }
                })
                let lastvolumechange=Date.now()
                let setvolx
                wrapper.addEventListener('keydown',async function(ev){
                    if(ev.key==' '){
                        playstate.click()
                    }
                    else if(ev.key=='m'){
                        volume.click()
                    }
                    else if(ev.key=='ArrowRight'){
                        logg(`skipping 10 seconds (${(vid.currentTime/60).toFixed(3)}m -> ${(vid.currentTime+10/60).toFixed(3)}m)`)
                        vid.currentTime+=10
                    }
                    else if(ev.key=='ArrowLeft'){
                        logg(`rewinding 10 seconds (${(vid.currentTime/60).toFixed(3)}m -> ${(vid.currentTime-10/60).toFixed(3)}m)`)
                        vid.currentTime-=10
                    }
                    else if(['ArrowUp','ArrowDown'].includes(ev.key)){
                        let beforevol='<i class="bi bi-volume-up-fill"></i>'
                        if(vid.muted){
                            beforevol='<i class="bi bi-volume-mute-fill"></i>'
                        }
                        const beforevolume=vid.volume
                        if(ev.key=='ArrowUp'){
                            if(vid.volume<1){vid.volume=Number((vid.volume+0.1).toFixed(1))}
                            else{
                                logg('user is trying to raise volume when its at max')
                                volume.setAttribute('max','')
                                await sleep(1000)
                                volume?.removeAttribute('max')
                            }
                        }
                        else{
                            if(vid.volume>0){vid.volume=Number((vid.volume-0.1).toFixed(1))}//not using -= bc floatshi
                            else{
                                logg('user is trying to reduce volume when its at min')
                                beforevol='<i class="bi bi-volume-mute-fill"></i>'
                                volume.setAttribute('max','')
                                await sleep(1000)
                                volume?.removeAttribute('max')
                            }
                        }
                        lastvolumechange=Date.now()
                        if(vid.volume==1){
                            volume.style.fontSize='13px'
                        }
                        volume.innerHTML=(vid.volume*100).toFixed(0)
                        
                        clearTimeout(setvolx)

                        setvolx=setTimeout(async()=>{
                            const beforecolor=volume.style.color
                            volume.style.color='transparent'
                            await sleep(300)
                            volume.style.fontSize='20px'
                            volume.style.color=beforecolor
                            volume.innerHTML=beforevol
                        },700)
                        logg(`volume changed by user ${beforevolume*100} -> ${vid.volume*100}`)
                    }
                })
                aspect.addEventListener('click',async function(){
                    const current=vid.getAttribute('a')
                    vid.setAttribute('change','')
                    let mediatype
                    if(current=='normal'){
                        mediatype='cover'
                        aspect.innerHTML='<i class="bi bi-arrows-angle-expand"></i>'
                    }
                    else if(current=='cover'){
                        mediatype='stretch'
                        aspect.innerHTML='<i class="bi bi-arrows-angle-contract"></i>'
                    }
                    else if(current=='stretch'){
                        mediatype='normal'
                        aspect.innerHTML='<i class="bi bi-aspect-ratio-fill"></i>'
                    }
                    await sleep(200)
                    vid.setAttribute('a',mediatype)
                    logg(`user changed media fill mode to ${vid.getAttribute('a')}`)
                    vid?.removeAttribute('change')
                })
                playstate.addEventListener('click',function(){
                    if(playing){
                        vid.pause()
                        playstate.innerHTML=`<i class="bi bi-play-fill"></i>`
                        logg('paused by user')
                    }
                    else{
                        vid.play()
                        logg('resumed by user')
                        playstate.innerHTML=`<i class="bi bi-pause-fill"></i>`
                    }
                    playing=!playing
                })
                vid.addEventListener('timeupdate',function(){
                    if(!changingbyuser){
                        progressvalue.style.width=`${(vid.currentTime/vid.duration)*100}%`
                    }
                    else{
                        logg('skipping auto progress styling. managed by progresschanger [manual]')
                    }
                    if(!gonnachangets){
                        shadowval.style.width=`${(vid.currentTime/vid.duration)*100}%`
                    }
                    else{
                        logg('user might change progress. managed by progresspredictor [manual]')
                    }
                })
                progress.addEventListener('click',async function(ev){
                    changingbyuser=true
                    const raw=ev.clientX-progress.getBoundingClientRect().left
                    const goto=(raw/progress.getBoundingClientRect().width)*100
                    progressvalue.setAttribute('user','')
                    progressvalue.style.width=goto+'%'
                    await sleep(200)
                    progressvalue?.removeAttribute('user')
                    vid.currentTime=vid.duration*(goto/100)
                    logg(`skipping to ${vid.duration*(goto/100)}[${(vid.duration*(goto/100)/60).toFixed(2)} min] (${vid.duration}/${(goto/100)}%) - ${((vid.duration-vid.currentTime)/60).toFixed(3)} mins to go`)   
                    changingbyuser=false
                    shadowval?.removeAttribute('using')
                })
                progress.addEventListener('mousemove',async function(ev){
                    gonnachangets=true
                    shadowval.setAttribute('using','')
                    const raw=ev.clientX-progress.getBoundingClientRect().left
                    const goto=(raw/progress.getBoundingClientRect().width)*100
                    shadowval.style.width=goto+'%'
                    let gotoshi
                    if(vid.duration/(60*60)>=1){gotoshi=(vid.duration*(goto/100)/(60*60)).toFixed(2)+'h'}
                    else{gotoshi=(vid.duration*(goto/100)/60).toFixed(2)+'m'}
                    progresspredict.innerText=gotoshi
                    await sleep(200)
                })
                progress.addEventListener('mouseleave',async function(ev){
                    gonnachangets=false
                    shadowval?.removeAttribute('using')
                })
                srcc.src=dynamiclink
                vid.append(srcc)
                wrapper.append(vid)
                vid.autoplay=true
                logg(`now playing ${info.title} on ${working.name}.`,'log',true,true,`now playing ${info.title}`)
                vid.addEventListener('ended',function(){
                    logg(`user finished watching ${info.title}.`)
                    playstate.innerHTML=`<i class="bi bi-play-fill"></i>`
                    playing=false
                })
                if(disablerclick){
                    wrapper.addEventListener('contextmenu',function(ev){
                        ev.preventDefault()
                    })
                }
            }
            else if(working.type=='embed'){
                logg(`Getting external player ready : ${dynamiclink}`,'log',true,true,'Getting ex-player ready',true)
                const mainframe=document.createElement('iframe')
                mainframe.src=dynamiclink
                if(disablepopups){
                    // Source - https://stackoverflow.com/a/43298617
                    // Posted by Sollace
                    // Retrieved 2026-09-08, License - CC BY-SA 3.0
                    if(info.useDefault){
                        logg(`[DEBUG] Selected server info :\n${JSON.stringify(working)}`,'log',true,true,'Debugger is activated while config:prv is turned off',true)
                    }
                    if(!working.optional.disable_sandbox){
                        mainframe.setAttribute('sandbox','allow-scripts allow-same-origin')
                    }
                    else{
                        logg(`Sandboxing was turned on by config but later turned off via sources file for this selected server (${working.title}).\n url : ${dynamiclink}`,'warn',true,true,
                            `Sandboxing was turned on by config but later turned off via sources file for this selected server.`,true
                        )
                    }
                }
                if(working.optional.events){
                    window.addEventListener('message',({origin,data})=>{
                        if(!data){return}
                        const servercommlist=working.optional.events
                        if(data.type==servercommlist.data_type){
                            const recieved=data[servercommlist.data_internalname]
                            if(recieved){
                                const returned=servercommlist.event_callback
                                if(returned?.event_callback?.event){
                                    if(recieved[returned.event_callback.event]==recieved[returned.ended]){
                                        // alert('ended')
                                    }
                                }
                                else{
                                    logg(`This source does not support end events (${working})`,'log',true,true,'This source does not support end events',true)
                                }
                                if(returned.currentTime&&returned.duration){
                                    const currentat=(recieved[returned.currentTime]/recieved[returned.duration])*100
                                    logg(`user is at ${currentat.toFixed(2)}%`)
                                    if(currentat>=minwatchcount){
                                        logg(`User has watched more than minwatch progress (${currentat.toFixed(0)}% -> min(${minwatchcount}%)): calling userinteraction manager.`)
                                        //add watched
                                    }
                                    if(currentat>=100){
                                        logg('User has finished watching the current media')
                                        try{
                                            document.querySelectorAll('iframewindow').forEach(async windowX=>{
                                                windowX.setAttribute('closing','')
                                                await sleep(300)
                                                windowX.remove()
                                            })
                                        }
                                        catch(er){}
                                    }
                                }
                                else{
                                    logg(` [WatchEvent manager] returned data cannot be found :\n\nServerCom :\n  ${JSON.stringify(servercommlist)}\nCallback :\n  ${JSON.stringify(recieved)}`,'warn',true,true,` [WatchEvent manager] recieved/${servercommlist.timeupdate} cannot be found`,true)
                                }
                            }
                            else{
                                logg(`Couldnt find internal data named ${working.optional.ev.data_internalname} (invalid internal sourcename) :\n\n  ${working}`,'error',true,true,`Couldnt find internal data named ${working.optional.ev.data_internalname} (invalid internal sourcename)`,true)
                            }
                            window.externalEvents++
                            // logg(data)
                        }
                    })
                }
                wrapper.append(mainframe)
            }        
            else{
                const warn=document.createElement('p')
                logg(`Error : MediaFrameType "${working.type}" is not a valid media type. Error-code : source-readtype-error1`,'error')
                warn.innerText=`Error : MediaFrameType "${working.type}" is not a valid media type. Error-code : source-readtype-error1`
                wrapper.append(warn)
            }
            document.body.append(wrapper)
            window.loader('loading','h')
            await sleep(300)
            back.removeAttribute('hiddenA')
            wrapper.removeAttribute('closing')
        }
        else{
            logg(`No working servers were found (failed-attempts->${trash})`,'error')
        }
    }
})
