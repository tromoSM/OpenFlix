const userdatalist=[
        'account',
        'exported_at',
        'joined',
        'openflix_export',
        'searchhist',
        'taste-profile',
        'topGenre',
        'user-interact',
        'username',
        'watchd'
        //add column for new ones
]
let syncfrominform=false
let synctoinform=false

window.SyncFromCloud=async ()=>{
  if(localStorage.getItem('account')=='cloud'){
    const {data,error}=await supabase.from('OpenFlix_userdata').select()
    if(error){
        window.fail('sync failed')
        console.error(error)
        return
    }
    if(data){
        Object.entries(data[0]).forEach(([key,value])=>{
            localStorage.setItem(key,value)
        })
    }
  }
  else if(!syncfrominform){
    console.log(`[sync] not syncing from cloud. using local userdata (account type : ${localStorage.getItem('account')}).`)
    syncfrominform=true
  }
}
window.SyncToCloud=async(calledby='')=>{
  if(localStorage.getItem('account')=='cloud'){
    if(calledby!=''){
        console.log(`Syncing with cloud : called by [${calledby}]`)
    }
    else{
        console.log('Syncing with cloud : called by unnamed process')
    }
    const {data,error}=await supabase.auth.getUser()
    let userdata=Object.fromEntries(
        Object.entries(localStorage).filter(([key])=>userdatalist.includes(key))
    )
    userdata.user_id=data.user.id
    const {error:syncerr}=await supabase.from('OpenFlix_userdata').upsert(userdata)
    if(syncerr){
        window.fail('sync failed')
        console.error(syncerr)
    }
  }
  else if(!synctoinform){
    console.log(`[sync] user data was only stored locally to be synced later (account type : ${localStorage.getItem('account')}).`)
    synctoinform=true
  }
}