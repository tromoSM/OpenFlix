let signinOptions={redirectTo:window.location.origin,}
let wrap_signinOptions={
    skipBrowserRedirect:true,
    redirectTo:window.location.origin+'/auth_callback/',
}
function sleep(dih){
        return new Promise(resolve=>setTimeout(resolve,dih))
}
window.signin=async(method='google')=>{
    if(window.isWrapped()){
        signinOptions=wrap_signinOptions
    }
    const {data,error}=await window.supabase.auth.signInWithOAuth({
        provider:"google",
        options:signinOptions
    })
    if(error){
        console.error(error)
    }
    if(data?.url){
        if(window.isWrapped()){
            const fullwindow=document.createElement('fullwindow')
            fullwindow.setAttribute('auth','pre')
            const title=document.createElement('h2')
            title.innerText='Check your browser'
            const des=document.createElement('p')
            des.innerText=`We've opened a browser tab for you to sign into OpenFlix via ${method}. After signing in you'll return here`
            const bgvec=document.createElement('i')
            bgvec.classList='bi bi-person-fill'
            const back=document.createElement('button')
            back.setAttribute('back','')
            back.addEventListener('click',function(){
                fullwindow.remove()
            })
            const tryagain=document.createElement('button')
            tryagain.innerHTML='try again'
            tryagain.setAttribute('try','')
            fullwindow.append(title,des,bgvec,back,tryagain)
            fullwindow.setAttribute('closing','')
            document.body.append(fullwindow)
            function openurl(){window.open(data.url,'_blank')}
            tryagain.addEventListener('click',openurl)
            // openurl()
            await sleep(300)
            fullwindow.removeAttribute('closing')
        }
    }
}
window.sessionCode=async(code)=>{
    const {data,error}=await window.supabase.auth.exchangeCodeForSession(code)
    if(error){
        console.error(error)
    }
    else{
        window.checkauthstatus()
        console.log('session for code successful')
        document.querySelector('fullwindow[auth=pre]').setAttribute('closing','')
        await sleep(300)
        document.querySelector('fullwindow[auth=pre]').remove()
        await sleep(100)
        await window.authDone()
        await sleep(300)
        window.location.reload()
    }
}
window.checkauthstatus=async()=>{
  try{
   if(window.supabase.auth){
    const {data,error}=await window.supabase.auth.getSession()
    if(error){
        console.error(error)
        return 'error'
    }
    if(data.session){
        document.querySelector('button[sign]').remove()
        return true
    }
    else{
        return false
    }
  }
  else{
        return false
  }
  }
  catch(er){
    console.error(er)
    return 'error'
  }
}
async function refreshUserData(){
    const {data,error}=await supabase.auth.getUser()
    if(error){
        console.error(error)
        return
    }
    const user=data.user
    localStorage.setItem('profile',user.user_metadata.avatar_url)
    const {error:profileError}=await supabase.from('OpenFlix_profiles').upsert({
        user_id:user.id,
        email:user.email,
        name:user.user_metadata.full_name??user.user_metadata.name,
        avatar:user.user_metadata.avatar_url
    })
    console.log(user)
    if(profileError){
        console.error(profileError)
    }
    console.log('syncing user profile data')
}

window.addEventListener('DOMContentLoaded',async function(){
    await sleep(300) //keepts supabase script timeout
    const auth=await checkauthstatus()
    if(auth=='error'){
        window.fail('sign in error')
    }
    else{
        if(!auth){
            document.querySelector('button[sign]').addEventListener('click',async function(){
               console.log('Signing in')
               await signin()
            })
        }
        else{
            localStorage.setItem('account','cloud')  
            await refreshUserData()
            console.log('Syncing profile data to cloud')
            await window.SyncFromCloud()
            console.log('Syncing user data from cloud')
            const profile=document.createElement('img')
            profile.src=localStorage.getItem('profile')
            document.querySelector('button[account]').querySelector('i').style.display='none'
            document.querySelector('button[account]').append(profile)
            profile.addEventListener('error',function(){
                document.querySelector('button[account]').querySelector('i').style.display='block'
                profile.remove()
                console.error(`[experience] using default account picture for login because it wansnt loaded :\n   culprit : might be from google photos rate limiting (429) \n   url : ${localStorage.getItem('profile')}`)
            })
        }
    }
})