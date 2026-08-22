fetch('../scripts/openflix/identity.json').then(id=>id.json()).then(identity=>{

    let id=identity.openflix.webcontainer
    let platform=identity.openflix.platform
    let auto
    let update
    let updateid
    let updateroot
    fetch('../scripts/openflix/originalstate.json').then(org=>org.json()).then(orgg=>{
        if(orgg.update_root.replaceAll(':o:a:x:r','').replaceAll('::','\n')!=identity.openflix.updateroot){
            console.error('yo they done replaced da el update')
        }
        else{
            updateroot=orgg.update_root.replaceAll(':o:a:x:r','')
        }
    }).catch(er=>{
        console.error(er)
    })
    if(id=='alldevice/nolocal'){
        //no container or containers with no local files
        auto=false
        update=false  //turn to false in prod
        updateid='web'
    }
    else if(id=='android/local'){
        auto=false
        update=true
        updateid='android_webwrap_local'
        //android container with local files -android_webwrap_local
    }
    else if(id=='android/nolocal'){
        auto=false
        update=true
        updateid='android_webwrap'
        //android container with no local files - android_webwrap
    }
    else if(id=='windows/local'){
        auto=false
        update=true
        updateid='windows_webwrap_local'
        //windows container with local files - windows_webwrap_local
    }
    else if(id=='windows/nolocal'){
        auto=false
        update=this
        updateid='windows_webwrap'
        //windows container with no local files - windows_webwrap
    }
    else{        
        updateid=false
        console.error(`couldn't find the update package information to update :\n   ${id}(${platform}) doesnt seem to be right.`)
    }

    window.IsUpdateSupported=()=>{
        return update
    }
    window.IsAutoUpdate=()=>{
        return auto
    }
    window.getUpdateID=()=>{
        return updateid
    }
    window.checkForUpdates=(debug=false)=>{
        function debuglog(log){
            if(debug){
                console.log(log)
            }
        }
        if(update){
           debuglog('your platform supports update')
           return fetch(updateroot).then(txt=>txt.json()).then(updateX=>{
            debuglog('fetched update metadata')
            if(Number(updateX.update['update-count'])>Number(identity.openflix.version_release)){
                debuglog(`update found : ${Number(identity.openflix.version_release)}(${identity.openflix.version}) => ${Number(updateX.update['update-count'])}(v${updateX.update.update_version[updateid]}) `)
                console.log(updateX.update.update_url[updateid])
                updateX.update.update_features[updateid].forEach(feature=>{
                   debuglog(feature)
                 })
                console.log(`Update available [v${updateX.update.update_version[updateid]}]:   
                   release : ${updateX.update['update-count']}
                   beta : ${updateX.update.beta}
                   released : ${updateX.update.update_date}
                   added features : ${updateX.update.update_features[updateid].length}
                   `
                )
                return ['Update available',{url:updateX.update.update_url[updateid],
                    features:updateX.update.update_features[updateid],
                    beta:updateX.update.beta,
                    date:updateX.update.update_date,
                    update_common_reason:updateX.update.update_main,
                    version:updateX.update.update_version[updateid],
                    securitypatch:updateX.update.security_patch
                }]
            }
            else{
                debuglog(`Openflix is up to date : ${Number(identity.version_release)} =< ${Number(updateX.update['update-count'])}`)
                console.log('OpenFlix is up to date ')
                return ['OpenFlix is up to date',{}]
            }
        })
        }
        else{
            debuglog('Your platform or openflix version doesnt support updates. On some platforms updating is disabled because itll update it self automatically')
            return [`OpenFlix - ${updateid}(${id}-${platform}) \n The version of openflix you're using doesnt support updating. On some platforms updating isnt supported because it will update it self automatically`,{}]
        }  
  }
})