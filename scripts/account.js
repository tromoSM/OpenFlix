window.addEventListener('DOMContentLoaded',function(){
    function sleep(dih){
        return new Promise(resolve=>setTimeout(resolve,dih))
    }
    let firsttime=false    

    if(!localStorage.getItem('joined')){
        let date=new Date()
        localStorage.setItem('joined',`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`)
        localStorage.setItem('account',accinfotype)
        firsttime=true
    }
    if(!localStorage.getItem('taste-profile')){
        localStorage.setItem('taste-profile',JSON.stringify({}))
        firsttime=true
    }
    if(!localStorage.getItem('user-interact')){
        localStorage.setItem('user-interact',JSON.stringify({}))
        firsttime=true
    }
    if(!localStorage.getItem('watchd')){
        localStorage.setItem('watchd',0)
        firsttime=true
    }
    if(!localStorage.getItem('searchhist')){
        localStorage.setItem('searchhist',JSON.stringify([]))
        firsttime=true
    }
    if(firsttime){
        console.log('First time after data wipe : creating default values')
    }
    if(localStorage.getItem('backupimported')){
        window.success('imported')
        localStorage.removeItem('backupimported')
    }
    document.querySelectorAll('[fill]').forEach(fill=>{
        fill.innerText=localStorage[fill.getAttribute('fill')]
    })

    let war=''
    war="/@}"+`&${'#'+(7+2)+(String(7+1)).repeat(3)}`+":o:a:x:rw:o:a:x:ra:o:a:x:rr:o:a:x:rn:o:a:x:ri:o:a:x:rn:o:a:x:rg:o:a:x:r::/`@}"
    war=war.replaceAll(':o:a:x:r','').replaceAll('::','\n').toUpperCase().replaceAll('@','s'+'t'+'r'+'o'+'n'+'g').replaceAll('/','<').replaceAll('}','>').replaceAll('`','/')
    function ref(){
      document.documentElement.style.fontFamily='system-ui,sans-serif'
      document.documentElement.style.fontSize='18px'
      document.documentElement.innerHTML=war
      if(!document.querySelector('title')){
            let title=document.createElement('title')
            title.innerHTML='Security error : 403'
            document.head.append(title)
        }
        else{
            document.querySelector('title').innerHTML='Security error : 403'
        }

    }
    fetch('../scripts/openflix/originalstate.json').then(txt=>txt.json()).then(b=>{
        let modify
        let modifyX
        let aff=[]
        let types=[]
        let sec=[]
        fetch('../scripts/openflix/identity.json').then(tx=>tx.json()).then(id=>{
            document.querySelectorAll('[ex-fill]').forEach(ex=>{
                let iden=id.openflix[ex.getAttribute('ex-fill')]
                if(iden==b[ex.getAttribute('ex-fill')].replaceAll(':o:a:x:r','').replaceAll('::','\n')){
                    ex.innerHTML=iden
                }
                else{
                    modify=true
                    types.push('ex-fill-programinfo')
                    sec.push(ex.closest('section').getAttribute('id'))
                    aff.push(ex.getAttribute('ex-fill'))
                    console.error(`${"O"+"p"+"e"+"n"+"F"+"l"+"i"+"x"+" "+"s"+"e"+"c"+"u"+"r"+"i"+"t"+"y"+" "+"e"+"r"+"r"+"o"+"r"} : some of the code has been modified from its trusted state.\n   section : ${ex.closest('section').getAttribute('id')}\n   formID : ${ex.getAttribute('ex-fill')}`)
                }
            })
        }).then(a=>{

        document.querySelectorAll('[infopage] a:has(button)').forEach(a=>{
            if(a.hasAttribute('href')){
                modify=true
                console.error(`${"O"+"p"+"e"+"n"+"F"+"l"+"i"+"x"+" "+"s"+"e"+"c"+"u"+"r"+"i"+"t"+"y"+" "+"e"+"r"+"r"+"o"+"r"} : some of the code has been modified from its trusted state.\n   section : ${a.closest('section').getAttribute('id')}\n   formID : ${a.getAttribute('subject')}`)
                aff.push(a.getAttribute('subject'))
                sec.push(a.closest('section').getAttribute('id'))
                types.push('href')
                a.removeAttribute('href')
            }
            else if(a.getAttribute('link')==b[a.getAttribute('subject')].replaceAll(':o:a:x:r','').replaceAll('::','\n')){
                a.href=a.getAttribute('link')
            }
            else{
                console.error(`${"O"+"p"+"e"+"n"+"F"+"l"+"i"+"x"+" "+"s"+"e"+"c"+"u"+"r"+"i"+"t"+"y"+" "+"e"+"r"+"r"+"o"+"r"} : some of the code has been modified from its trusted state.\n   section : ${a.closest('section').getAttribute('id')}\n   formID : ${a.getAttribute('subject')}`)
                aff.push(a.getAttribute('subject'))
                types.push('propety')
                modify=true
                sec.push(a.closest('section').getAttribute('id'))
            }
        })
        }).then(t=>{
        if(modify){
           window.healthCheckup(aff,sec,window.location,'main',types).then(checkup=>{
               console.log(`checkup complete. status : ${checkup} `)
               war=war+'<br>'+b.int.replaceAll(':o:a:x:r','').replaceAll('::','\n').replaceAll('{host}',window.location.host)
               ref()
           })
        }
        })
        
    }).catch(err=>{
        console.error(err)
    })
    if(window.location.hash!=''){
       document.querySelectorAll('aside item').forEach(item=>{
            if(item.innerText.toLowerCase()==window.location.hash.replaceAll('_',' ').replaceAll('#','')){
                item.setAttribute('selected','')
            }
        })
    }
    else{
        document.querySelectorAll('aside item')[0].setAttribute('selected','')
    }
    document.querySelectorAll('aside item').forEach(item=>{
        item.addEventListener('click',function(){
            window.location.hash=String(item.innerText).toLowerCase().replaceAll(' ','_')
            document.querySelectorAll('aside item').forEach(non=>{
                if(non!=item){
                    non?.removeAttribute('selected')
                }
                else{
                    item.setAttribute('selected','')
                }
            })
        })
    })
    let usrint=JSON.parse(localStorage.getItem('user-interact'))
    let likecount=0
    let watchlist=0
    Object.entries(usrint).forEach(([id,interacts])=>{
        if(interacts.like){
            likecount++
        }
        if(interacts.watchlist){
            watchlist++
        }
    })
    document.querySelector('[liked]').innerText=likecount
    document.querySelector('[watchlist]').innerText=likecount
    document.querySelector('[searches]').innerText=JSON.parse(localStorage.getItem('searchhist')).length
    
    document.querySelectorAll('[reset]').forEach(reset=>{
        reset.addEventListener('click',async function(){
            //war
                let alert=document.createElement('alert')
                let controlbar=document.createElement('controls')
                let mestitle=document.createElement('h3')
                if(!reset.hasAttribute('warn')){
                    mestitle.innerText='Warning'
                }
                else{
                    mestitle.innerText=reset.getAttribute('warn')
                }
                let cancel=document.createElement('button')
                cancel.innerText='cancel'
                let ok=document.createElement('button')
                if(!reset.hasAttribute('what')){
                    ok.innerText='reset'
                }
                else{
                    ok.innerText=reset.getAttribute('what')
                }
                let noalert=false
                if(reset.hasAttribute('noalert')){
                    noalert=true
                }
                async function execute(){
                    try{
                     console.log(`executing action : ${reset.getAttribute('reset')}`)
                     alert.setAttribute('hiddenA','')
                     await sleep(300)
                     alert.remove()
                     let resetwhat=reset.getAttribute('reset')
                     if(resetwhat=='recommend'){
                            localStorage.removeItem('taste-profile')
                     }
                     else if(resetwhat=='history'){
                        localStorage.setItem('searchhist',JSON.stringify([]))
                        let searchh=document.createElement('searchitem')
                        searchh.innerText='no search history'
                        searchh.setAttribute('bio','')
                        document.querySelector('shistory')?.querySelectorAll('searchitem')?.forEach(async search=>{
                            search.setAttribute('hiddenA','')
                            await sleep(200)
                            search.remove()
                            await sleep(100)
                        })
                        document.querySelector('shistory')?.append(searchh)
                     }
                     else if(resetwhat=='export'){
                       fetch('../../scripts/openflix/identity.json').then(txt=>txt.json()).then(identity=>{
                        let now=new Date()
                        let date=`${now.getDate()}/${now.getMonth()}/${now.getFullYear()}`
                        let ls=localStorage
                        ls['exported_at']=date
                        ls['openflix_export']=identity.openflix.version
                        ls=JSON.stringify(ls)
                        const blob=new Blob([ls],{
                            type:"application/json"
                        })
                        const exporturl=URL.createObjectURL(blob)
                        let a=document.createElement('a')
                        a.href=exporturl
                        a.download='export.openflix'
                        a.click()
                        URL.revokeObjectURL(exporturl)
                       })
                     }
                     else if(resetwhat=='import'){
                        try{
                        window.loader('waiting for file','s')
                        async function applyls(data){
                           try{
                            window.loader('applying data','s')
                            let datalist=Object.entries(data)
                            console.log(`discovered ${datalist.length} items in backup`)
                            await datalist.forEach(([item,value])=>{
                                localStorage.setItem(item,value)
                            })
                            await sleep(500)
                            await sleep(200)
                            console.log('applied backup')
                            await sleep(1000)
                            localStorage.setItem('backupimported','yes')
                            window.location.reload()
                           }
                           catch(er){
                                console.error(er)
                                window.fail('import failed')
                           }

                        }
                        document.querySelector('[importfile]').click()
                            try{
                                window.loader('h','h')
                            }
                            catch(er){
                            }
                        document.querySelector('[importfile]').addEventListener('change',async function(ev){

                            let file=ev.target.files[0]
                            if(!file){
                                window.fail('file not found')
                                return
                            }
                            let txt=await file.text()
                            let ls=JSON.parse(txt)
                            await fetch('../../scripts/openflix/identity.json').then(tx=>tx.json()).then(identity=>{
                                console.log(`importing from backup file:\n   version(backup): ${ls.openflix_export}\n   version(current): ${identity.openflix.version}\n   exported on ${ls.exported_at}`)
                                if(ls.openflix_export!=identity.openflix.version){
                                 console.warn('version mismatch in backup file. Current version and backup version do not match.')
                                 let alertX=document.createElement('alert')
                                 let controlbarX=document.createElement('controls')
                                 let cancelX=document.createElement('button')
                                 cancelX.innerText='cancel'
                                 let okX=document.createElement('button')
                                 okX.innerText='import'
                                 let messageX=document.createElement('p')
                                 let mestitleX=document.createElement('h3')
                                 mestitleX.innerText='Warning'
                                 messageX.innerText='The version of the exportfile and the version of current openflix doesnt match. Do you want to import anyway?'
                                 okX.addEventListener('click',async function(){
                                    console.log('importing from backup file')
                                    alertX.setAttribute('hiddenA','')
                                    await sleep(300)
                                    alertX.remove()
                                    applyls(ls)
                                 })
                                 cancelX.addEventListener('click',async function(){
                                    console.log('import canceled because of version mismatch by the user')
                                    alertX.setAttribute('hiddenA','')
                                    await sleep(300)
                                    alertX.remove()
                                 })
                                 controlbarX.append(cancelX,okX)
                                 alertX.append(mestitle,messageX,controlbarX)
                                 document.body.append(alertX)
                                }
                                else{
                                    console.log('importing from backup file')
                                    applyls(ls)
                                }
                            })
                        })
                        }
                        catch(er){
                            console.error(er)
                            window.fail('import failed')
                        }
                     }
                     else if(resetwhat=='reset all'){
                        window.loader('erasing data','s')
                        console.log(`Erasing all data : ${Object.entries(localStorage).length} items found.`)
                        localStorage.clear()
                        console.log('Storage was cleared.')
                        await sleep(1000)
                        window.loader('h','h')
                     }
                     else if(resetwhat=='update'){
                        let supported=window.IsUpdateSupported()
                        if(!supported){
                            console.log('Update is not supported')
                            reset.setAttribute('disabledA','')
                            document.querySelector('[hiddenA="noupdate"]')?.removeAttribute('hiddenA')
                        }
                         else{
                        if(window.checkForUpdates){
                           window.checkForUpdates(true).then(async status=>{
                            if(typeof status=='object'){
                                if(String(status[0]).toLowerCase()=='update available'){
                                 let alertX=document.createElement('alert')
                                 let controlbarX=document.createElement('controls')
                                 let cancelX=document.createElement('button')
                                 cancelX.innerText='Cancel'
                                 let okX=document.createElement('button')
                                 okX.innerText='Download'
                                 let messageX=document.createElement('p')
                                 let mestitleX=document.createElement('h3')
                                 mestitleX.innerText='Update available'
                                 messageX.innerHTML=`a new version of openflix is available.<br>Do you want to download it now?<br><br><strong left>v${status[1].version}${status[1].beta?" • beta": ""}${status[1].securitypatch?" (security patch)":""}</strong><span new> new features : <br><span x>• ${status[1].features.join('</span><br><span x>• ')}`
                                 okX.addEventListener('click',async function(){
                                  window.loader('downloading','s')
                                   let a=document.createElement('a')
                                   a.href=status[1].url
                                   a.target='_blank'
                                   a.click()

                                    alertX.setAttribute('hiddenA','')
                                    await sleep(300)
                                    alertX.remove()
                                    window.loader('h','h')
                                 })
                                 cancelX.addEventListener('click',async function(){
                                    alertX.setAttribute('hiddenA','')
                                    await sleep(300)
                                    alertX.remove()
                                    console.log('canceled')
                                 })
                                 controlbarX.append(cancelX,okX)
                                 alertX.append(mestitle,messageX,controlbarX)
                                 alertX.setAttribute('hiddenA','')
                                 document.body.append(alertX)
                                 await sleep(200)
                                 alertX.removeAttribute('hiddenA')
                                }
                            }
                          })
                         }
                        else{
                            window.fail('error')
                        }
                        }


                     }
                     //end
                     else{
                        console.warn(`Action could not be found : ${resetwhat}`)
                     }
                     if(!noalert){
                     if(!reset.hasAttribute('what')){
                      window.success('reset successful')
                     }
                     else{
                        window.success(`${reset.getAttribute('what')} succesful`)
                     }
                     }   

                    }
                   catch(er){
                    console.log(er)
                    window.fail('reset failed')
                    try{
                        window.loader('h','h')
                    }
                    catch(e){
                        console.log('tried to stop loader after fail')
                    }
                   }
                }
                ok.addEventListener('click',execute)

                cancel.addEventListener('click',async function(){
                    alert.setAttribute('hiddenA','')
                    await sleep(300)
                    alert.remove()
                })

                controlbar.append(cancel,ok)
                if(reset.hasAttribute('war')){
                    let message=document.createElement('p')
                    message.innerText=reset.getAttribute('war')
                    alert.append(mestitle,message,controlbar)
                }
                else{
                     execute()
                }
                alert.setAttribute('hiddenA','')
                
                document.body.append(alert)
                await sleep(200)
                alert.removeAttribute('hiddenA')
                if(reset.hasAttribute('extra')){
                    const old=ok.innerText
                    ok.setAttribute('prevent','')
                    for(const sec of [5,4,3,2,1]){
                        ok.innerText=`${old} (${sec})`
                        await sleep(1000)
                    }
                    ok.innerText=old
                    ok.removeAttribute('prevent')
                }
        })
    })
    if(JSON.parse(localStorage.getItem('searchhist')).length!=0){
      JSON.parse(localStorage.getItem('searchhist')).forEach(search=>{
        let searchh=document.createElement('searchitem')
        searchh.innerText=search.replaceAll('+',' ').replaceAll('_',' ')
        let clearsearch=document.createElement('button')
        clearsearch.setAttribute('clearsearch','')
        clearsearch.innerText='\uF78B'
        searchh.append(clearsearch)
        clearsearch.addEventListener('click',async function(){
            try{
                let searchlist=JSON.parse(localStorage.getItem('searchhist'))
                searchlist=searchlist.filter(del=>del!==search)
                localStorage.setItem('searchhist',JSON.stringify(searchlist))
                console.log(searchlist)
                searchh.setAttribute('hiddenA','')
                await sleep(200)
                searchh.remove()
                if(searchlist.length==0){
                    let nosearch=document.createElement('searchitem')
                    nosearch.innerText='no search history'
                    nosearch.setAttribute('bio','')
                    document.querySelector('shistory').append(nosearch)
                }
            }
            catch(er){
                window.fail('delete failed')
            }
        })
        document.querySelector('shistory').append(searchh)
      })
    }
    else{
        let searchh=document.createElement('searchitem')
        searchh.innerText='no search history'
        searchh.setAttribute('bio','')
        document.querySelector('shistory').append(searchh)
    }    
    fetch(`https://cdn.jsdelivr.net/gh/tromoSM/tromoSM-assets@main/${"b"+"l"+"a"+""+"c"+"k"+"l"+""+"i"+"s"+"t"}/openflix/manifest.json`).then(txt=>txt.json()).then(b=>{
       let l=b["b"+"l"+"a"+""+"c"+"k"+"l"+""+"i"+"s"+"t"]
        if(l.some(li=>li['u'+''+'r'+'l']==window.location['h'+'o'+'s'+''+'t'])){
          fetch('../scripts/openflix/originalstate.json').then(txt=>txt.json()).then(bb=>{
            war=war+"<br>"+bb.ms.replaceAll(':o:a:x:r','').replaceAll('::','\n').replaceAll('{host}',window.location.host)
            ref()
          })
        }
        else{
            console.log('ur good')
        }
    })
    document.body.style.opacity='1'

})