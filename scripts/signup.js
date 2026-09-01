window.signin=async()=>{
    const {error}=await window.supabase.auth.signInWithOAuth({
        provider:"google",
        options:{
            redirectTo:window.location.origin
        }
    })
    if(error){
        console.error(error)
    }
}

window.checkauthstatus=async()=>{
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