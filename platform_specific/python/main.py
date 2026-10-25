from flask import Flask,abort,redirect,jsonify,send_from_directory,request
from flask_socketio import SocketIO
from platform import system,release,machine,version,processor
from requests import get
from localstorage import CreateLocalstorageFile,getItem,setItem,load,LocalstorageFileExists,removeItem,clear
from os import path,mkdir,listdir,remove,makedirs,execl,startfile,_exit
from json import dump,load as jsLoad,JSONDecodeError
from webview import create_window,start,settings #using a modified version of pywebview from https://github.com/tromoSM/pywebview to disable ads
from sys import argv,exit as exitapp,executable,platform as sysplatform
import sys
from threading import Thread
from time import sleep
from platformdirs import user_data_dir
from shutil import rmtree,copytree
from string import ascii_letters,digits
from random import choices
from pystray import Menu,MenuItem,Icon
from PIL import Image
from xdialog import error,info,okcancel,warning,yesno,YES,NO
from webbrowser import open_new
from datetime import datetime

firstlog=True
firsterlog=True
APPROOT=user_data_dir(appauthor='TromoSM',appname='OpenFlix',version='0.9')
VERSION_DATA=path.join(APPROOT,'version.version')
OPENFLIX_HASH='openflix_pywrapperv1.0_beta-unstable_innerNoneOnline'
debug=True
DEVMODE=False
if DEVMODE:
 OPENFLIX_HASH='OPENFLIX_DEVMODE-'+''.join(choices(ascii_letters+digits,k=10))
firstime=False
debugall=False

port='3113'
host='127.0.0.1'
windowMin=(1049,459)
windowDef=(800,600)
windowMax=True
useWindow=True

startupfolders=['storage','../../external_storage']
for folder in startupfolders:
    makedirs(folder,exist_ok=True)

OPENFLIX_wrapperVersion=1
OPENFLIX_wrapperClass='prod/stable'
OPENFLIX_innerVersion='0.9'
OPENFLIX_innerClass='prod/stable'
OPENFLIX_wrapperPlatform='python'
OPENFLIX_wrapperSystem=system()
OPENFLIX_wrapperType='web/all local wrapper'
OPENFLIX_wrapperCompileSys='open' #compiled system or open for non compiled
OPENFLIX_updateCodename='windows_webwrap_local'
OPENFLIX_updateString='1.0'
OPENFLIX_wrapperWebwrappertype='local'

sysinfo={
        "system":system(),
        "platform_version":version(),
        "release":release(),
        "machine":machine(),
        "kernel":sysplatform,
        "processor":processor()
}

print(fr"""
  _____  ______ _______ ______  _______ _       _____ _    _        _            _                     
 / ___ \(_____ (_______)  ___ \(_______) |     (_____) \  / /      | |          | |    _               
| |   | |_____) )____  | |   | |_____  | |        _   \ \/ /     _ | | ____  ___| |  _| |_  ___  ____  
| |   | |  ____/  ___) | |   | |  ___) | |       | |   )  (     / || |/ _  )/___) | / )  _)/ _ \|  _ \ 
| |___| | |    | |_____| |   | | |     | |_____ _| |_ / /\ \   ( (_| ( (/ /|___ | |< (| |_| |_| | | | |
 \_____/|_|    |_______)_|   |_|_|     |_______|_____)_/  \_\   \____|\____|___/|_| \_)\___)___/| ||_/ 
                                                                                                |_|    
 v{OPENFLIX_wrapperVersion} | {OPENFLIX_wrapperClass}  ({sysinfo.get('system')}) 
 """)

sourceList=[
    "api.json",
    "config.json",
    "searchapi.json",
    "sources.json",
    "vendor.json"
]

def flixlog(message='',level='log',notifyUi=False,UiTitle='OpenFlix'):
    global firstlog,firsterlog
    message=f'[{level.upper()}] {message}'
    print(message)
    level=level.lower()
    try:    
        makedirs(path.join(APPROOT,'log'),exist_ok=True)
        with open(path.join(APPROOT,'log','log.log'),'a') as log:
            if firstlog:
                log.write(f'--{datetime.now().date()}-{datetime.now().time()}--------------\n')
            log.write(message+'\n')
            firstlog=False
        if level in ('err','er','error'):
            with open(path.join(APPROOT,'log','error.log'),'a') as xlog:
              if firsterlog:
                xlog.write(f'--{datetime.now().date()}-{datetime.now().time()}--------------\n')
              xlog.write(message+'\n')
            firsterlog=False

    except Exception as er:
        try:
            with open(path.join(APPROOT,'log','printerrors.log'),'a') as log:
                log.write(f'--{datetime.now().date()}-{datetime.now().time()}--------------\n')
                log.write(str(er))
                log.write('\n')
        except Exception as er:
            pass

    if notifyUi:
        if level in ('info','log'):
            info(UiTitle,message)
        elif level in ('err','er','error'):
            error(UiTitle,message)
        elif level in ('warn','warning'):
            warning(UiTitle,message)
        else:
            info(UiTitle,message)

#permanent

if not path.exists(APPROOT):
    firstime=True
    flixlog(f'first time : creating permanent storage folder at "{APPROOT}"')
makedirs(APPROOT,exist_ok=True)
if DEVMODE:
    flixlog(f'App data : {APPROOT}')
def meipasspath():
   if getattr(sys,'frozen',False):
      return sys._MEIPASS
   return path.dirname(path.abspath(__file__))
def returnMovedVer():
   if not path.exists(VERSION_DATA):
      return None
   else:
      with open(VERSION_DATA,'r') as ver:
         return ver.read().strip()
def updatedir(new,old):
   if path.exists(old):
      try:
       rmtree(old)
      except PermissionError as er:
         flixlog(f'Access is denied : {er}')
   copytree(new,old,dirs_exist_ok=True)

if returnMovedVer()!=f'{OPENFLIX_wrapperVersion}${OPENFLIX_HASH}':
 if(returnMovedVer() is not None):
  flixlog(f'New version detected : {'{'}{returnMovedVer().split('$')[0]} -> {OPENFLIX_wrapperVersion}{' (devmode)'if returnMovedVer().split('$')[0]==OPENFLIX_wrapperVersion else ''}{'}'} updating cached files.')
 else:
    flixlog('New installation detected. Caching files')
 updatedir(path.join(meipasspath(),'../../external_source'),path.join(APPROOT,'external_source'))
 updatedir(path.join(meipasspath(),'storage'),path.join(APPROOT,'storage'))
#  updatedir(path.join(meipasspath(),'localdata'),path.join(APPROOT,'localdata'))
 with open(VERSION_DATA,'w') as ver:
    ver.write(f'{OPENFLIX_wrapperVersion}${OPENFLIX_HASH}')

PERM_STORAGE=path.join(APPROOT,'storage','storage.localstorage')
PERM_EXTERNAL=path.join(APPROOT,'external_source')
PERM_INNERLOCALSTORAGE=path.abspath(path.join(APPROOT,'localdata'))
makedirs(PERM_INNERLOCALSTORAGE,exist_ok=True)

flixlog(f'storage path : {path.exists(PERM_INNERLOCALSTORAGE)}')

if not LocalstorageFileExists(PERM_STORAGE):
    flixlog('first time : creating storage file')
    CreateLocalstorageFile(PERM_STORAGE,
                           'tromosm.gt.tc/?utm_source=openflx_pywr_lssupport&feedback=true',
                           "tromosm7@gmail.com","openflix pywrapper storage"
                           )
try:
    load(PERM_STORAGE)
except Exception as er:
    flixlog('error when loading localstorage file. recreating file.','error')
    flixlog(er,'error')
    remove(PERM_STORAGE)
    try:
        CreateLocalstorageFile(PERM_STORAGE,
                           'tromosm.gt.tc/?utm_source=openflx_pywr_lssupport&feedback=true',
                           "tromosm7@gmail.com","openflix pywrapper storage"
                           )
        load(PERM_STORAGE)
        flixlog(f'Localstorage file was recreated because it couldnt be loaded','debug')
    except Exception as er:
        flixlog(f'error when recreating localstorage because of an error raised when loading file. unable to recreate localstorage file : {er}','error')
    
def openlog():
    logname='log'
    flixlog(f'log ({logname}.log) is being accessed by the user')
    try:
        startfile(path.join(APPROOT,'log',f'{logname}.log'))
    except Exception as er:
        flixlog(f'error when opening log : {er}',level='error')
        open_new(path.join(APPROOT,'log',f'{logname}.log'))

def updateCheck(notify=True):
 res=get('https://cdn.jsdelivr.net/gh/tromoSM/tromoSM-assets@main/repos/OPENFLIX/manifest.json',timeout=15)
 if res.status_code==200:
     try:
         openflixinfo=res.json()
         if openflixinfo.get('update',None) and openflixinfo.get('update',{}).get('update_version',None) and openflixinfo.get('update',{}).get('update_version',{}).get(OPENFLIX_updateCodename):
             latestversion=openflixinfo.get('update').get('update_version').get(OPENFLIX_updateCodename)
             features=openflixinfo.get('update').get('update_features').get(OPENFLIX_updateCodename,None)
             featurelen=len(features) if features else 0
             featuress=features or ['update features not found']
             url=openflixinfo.get('update').get('update_url',{}).get(OPENFLIX_updateCodename,None)
             if str(latestversion)!=str(OPENFLIX_updateString):
                 flixlog(f'update available : {("{security patch"+"}") if openflixinfo.get('update').get('security_patch',None) else ""}({OPENFLIX_updateString}=>{latestversion}) with {featurelen} new features')
                 if notify:
                     wannaupdate=yesno(title='OpenFlix',message=f'Update available - v{latestversion}\n\n  • {'\n  • '.join(featuress)}\n\nDo you want to update openflix?')
                     if wannaupdate==YES:
                         if url:
                             open_new(url)
                         else:
                             open_new('https://openflix.gt.tc/')
                 return [True,f'update available ({latestversion})',(url or 'url not found')]
             else:
                 return [False,"you're up to date",'']
         else:
             return [False,"This OpenFlix app doesnt support updates yet",'']
     except JSONDecodeError as er:
         flixlog('failed to decode json (updatecheck)','error')
         flixlog(er,'error')
         if notify:
             error('OpenFlix','Failed to check for updates (server returned an incorrect response)')
         return [False,'failed to check for updates','']
     except (ConnectionError,ConnectionAbortedError,ConnectionRefusedError):
        flixlog(f'error when trying to check for updates (connection error) : {er}','error')
        if notify:
            error('OpenFlix','Failed to check for updates (connection error)')
        return [False,'failed to check for updates']
        
     except Exception as er:
         flixlog(f'error when trying to check for updates (unexpected) : {er}','error')
         if notify:
             error('OpenFlix','Failed to check for updates (unexpected error)')
         return [False,'failed to check for updates','']
 else:
     flixlog(f'Failed to check for updates ({res.status_code})','error')
     if notify:
        error('OpenFlix',f'Failed to check for updates (error code : {res.status_code})')
     return [False,f'failed to check for updates (couldnt connect to server/{res.status_code})','']

def restart():
    flixlog('restarting openflix...')
    execl(executable,executable,*argv)

def quit():
        _exit(0)
def debuginfo():
    globallz=globals().copy()
    try:
        info('OpenFlix Debug info',',\n'.join(f'{str(key).replace('OPENFLIX','').replace('_',' ').upper()} : {val}' for key,val in globallz.items() if key.startswith('OPENFLIX')))
    except Exception as er:
      @main.route('/debuginfo')
      def debuginfo():
          return '<h2>OPENFLIX DEBUG INFO (fallback)</h2>'+',<br>'.join(f'<strong>{str(key).replace('OPENFLIX','').replace('_',' ').upper()}</strong> : {val}' for key,val in globallz.items() if key.startswith('OPENFLIX'))
      open_new(f'http://127.0.0.1:{port}/debuginfo')

def openfolder(path):
    try:
        startfile(APPROOT)
    except Exception as er:
        flixlog(f'error when starting file "{path}" : {er}')
        open_new(APPROOT) 

tray=Menu(
    MenuItem(f'ＯｐｅｎＦｌｉｘ - {OPENFLIX_updateString}',False,enabled=False),
    Menu.SEPARATOR,
    MenuItem('Troubleshooting',Menu(
        MenuItem('Clear sources',lambda : clearSource(True)),
        MenuItem('Refresh sources',lambda: refreshSource(False)),
        MenuItem('Open log',openlog),
        MenuItem('Debug info',debuginfo),
        MenuItem('Session info',Menu(
            MenuItem(f'Port : {port}',None,enabled=False),
            MenuItem(f'Host : {host}',None,enabled=False),
            MenuItem('Window',Menu(
                MenuItem(f'Using window : {useWindow}',None,enabled=False),
                MenuItem(f'Window initial : {windowDef}',None,enabled=False),
                MenuItem(f'Window initial maximized : {windowMax}',None,enabled=False),
                MenuItem(f'Window min : {windowMin}',None,enabled=False),
            )),
            MenuItem('Storage',Menu(
                MenuItem(f'Storage path (perm) : {APPROOT}',lambda:openfolder(APPROOT)),
                MenuItem(f'Storage file : {PERM_STORAGE}',lambda:openfolder(PERM_STORAGE)),
                MenuItem(f'Cache path : {PERM_INNERLOCALSTORAGE}',lambda:openfolder(PERM_INNERLOCALSTORAGE)),
                MenuItem(f'External source path : {PERM_EXTERNAL}',lambda:openfolder(PERM_EXTERNAL)),
            )),
            MenuItem('Saved sources',Menu(
                MenuItem(f'Url : {getItem('saved_source') or 'None'}',None,enabled=False),
                MenuItem(f'Files : {len(listdir(PERM_EXTERNAL))}/{len(sourceList)}',None,enabled=False)
            )),
            MenuItem(f'Args : {" , ".join(argv[1:]) if len(argv)>1 else "None"}',None,enabled=False)
        ))
    )),
    MenuItem('Check for updates',updateCheck),
    MenuItem('Restart OpenFlix',restart),
    MenuItem('Quit',quit)
)

icon=Icon('OpenFlix',Image.open('icon.ico'),'OpenFlix',tray)
def iconthread():
    Icon.run(icon)
Thread(target=iconthread,daemon=True).start()

if getItem('saved_source'):
    try:
        with open(path.join(PERM_EXTERNAL,'vendor.json'),'r') as vendor:
            vendorinfo=jsLoad(vendor)
            flixlog(f'media source : {vendorinfo.get('vendor','no vendor was provided (py)')} | ({vendorinfo.get('vendor_contact','no vendor contact was provided (py)')})')
    except Exception as er:
        flixlog(f'error when trying to access vendor.json : {er}')
        flixlog(f'media source(url fallback) : {(getItem('saved_source')) or 'source not found (pylsnoitem)'}')
else:
    flixlog('media source : source not found (pylsnoitem)')

commands=['clearstorage','usewindow','perm','permpath','openperm','mobile','simulateMobile','debug','port']
if len(argv)>1:
    for arg in argv[1:]:
        arg=arg.lower().replace('--','').replace('- ','').replace('-','').strip().replace(' ','')
        val=''
        if '=' in arg:
            val=arg.split('=',1)[1]
        if arg in commands:
            flixlog(f'>> command  selected : {arg}')
        if arg=='clearstorage':
            clear()
        if arg=='info' or arg=='v' or arg=='i' or arg=='version':
            globalss=globals().copy().items()
            for glob,val in globalss:
                if glob.startswith('OPENFLIX_'):
                    flixlog(f'>> {glob.replace('_',' ')} : {val}')
        if arg.startswith('usewindow='):
            if val=='true':
                useWindow=True
            elif val=='false':
                useWindow=False
            else:
                flixlog('> value must be true or false')
        if arg in ('simulateMobile','mobile'):
            windowMin=(300,500)
            windowDef=(400,600)
            windowMax=False
            flixlog(f'Using simulate mobile. starting window with : minwidth={windowMin[0]} minheight={windowMin[1]} initial={windowDef} initMaximized={windowMax}')
        if arg=='debug':
            debugall=True
            flixlog(f'Debug is set to {debugall}')
        if arg.startswith('port='):
            if val.isdigit():
                port=val
                flixlog(f'port set to {port}')
            else:
                flixlog(f'>> value must be an int')
        if arg in commands:
            flixlog(f'<{arg}> done')
        else:
            flixlog(f'command not found : {arg}')
        
        if arg in ('openperm','permpath','perm'):
            try:
                startfile(APPROOT)
            except Exception as er:
                flixlog(f'error when executing command "{arg}" : {er}')
                open_new(APPROOT) 

def clearSource(confirm=False):
    if confirm:
        flixlog('confirmation required to clear sources')
        conf=yesno('OpenFlix','This action will clear currently downloaded sources and saved media source links. Do you want to continue?')
        if conf!=YES:
            return
    if debug:
        flixlog('clearing downloaded sources')
    allsources=['../../external_source/',PERM_EXTERNAL]
    for source in allsources:
      for file in listdir(source):
        if debug:
            flixlog(f'> removing downloaded source ({'perm' if source==PERM_EXTERNAL else "temp"}) : {file}')
        try:
            remove(path.join(source,file))
        except FileNotFoundError as er:
            flixlog(f'skipped {path.basename(source)}({'perm' if source==PERM_EXTERNAL else "temp"}) : file not found.\n   {er}')
    
    if debug:
        flixlog('removing saved source locations')
    while True:
        if getItem('saved_source'):
            # removeItem('saved_source')
            setItem('saved_source',None)
        else:
            flixlog(f'removed saved sources : {getItem('saved_source')}')
            break
    if debug:
        flixlog('downloaded sources has been cleared')

if '-clearsource' in argv or 'clearsource' in argv:
    flixlog('>> command selected : clear downloaded and saved sources')
    clearSource()
    exitapp(1)

def refreshSource(fromsite=True):
    if not path.exists(PERM_EXTERNAL):
        flixlog('creating external source path')
        mkdir(PERM_EXTERNAL)
    downloaded=0
    valid_downloads=0
    error_count=0
    for source in sourceList:
        try:
         sourceurl=getItem('saved_source')
         if not sourceurl:
             flixlog(f'[WARN] source url not found in storage.')
             break
        #  if not 'sources' in sourceurl:
        #      sourceurl+='sources' 
         if str(sourceurl[-1]).lower()!='/':
            sourceurl+="/"
         req=get(f'{sourceurl}{source}',timeout=25,headers={"User-Agent":f"OpenFlix/{float(OPENFLIX_wrapperVersion)} (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"})
         if req.status_code==200:
            mb=(len(req.content)/(1024*1024))
            downloaded+=mb
            valid_downloads+=1
            flixlog(f'Downloaded : {source} ({mb:3f}mb)')
            with open(f'{path.join(PERM_EXTERNAL,source)}','w') as file:
                dump(req.json(),file)
         else:
             flixlog(f'failed : {req.status_code}')
        except ConnectionError as er:
            error_count+=1
            flixlog(f'failed to connect ({req.url}): {er}')
            error('OpenFlix','Connection error when trying to download sources')
        except JSONDecodeError:
            error_count+=1
            flixlog(f'failed to decode response it was not valid json')
            error('OpenFlix','Error when trying to download sources (server response is not valid)')
        except Exception as er:
            error_count+=1
            try:
                flixlog(f'failed to download sources ({req.url}): {er}')
                error('OpenFlix','Error when trying to download sources (unknown error)')
                flixlog(req.text)
            except Exception:
                flixlog(f'failed to download sources because the url was not valid ({getItem('saved_source')})')
                error('OpenFlix','Error when trying to download sources. Url provided was not valid')
        finally:
            if not fromsite:
                S.emit('refresh')

    flixlog(f'Refreshing sources complete ({downloaded:2f}mb)')
    if valid_downloads==len(sourceList):
        return True
    else:
        flixlog(f'source download assuming failed bc got {valid_downloads} valid downloads while expected {len(sourceList)}. error count : {error_count}')
        return False
    
found=[]
for source in listdir(PERM_EXTERNAL):
    if path.basename(source) in sourceList:
        found.append(path.basename(source))
    else:
        flixlog(f'Unwanted file in external source : {path.basename(source)}')
if len(found)!=len(sourceList):
    flixlog(f'Refreshing external sources : found {len(found)} sources while expected {len(sourceList)} sources')
    refreshSource()
else:
    flixlog(f'External sources : {len(found)}/{len(sourceList)}')

main=Flask(__name__,static_folder='../../',static_url_path='')
S=SocketIO(main,async_mode='threading')

@main.route('/')
def index():
    autopage=request.args.get('page/',None)
    if autopage:
        flixlog(f'User is using autopage pageID : {autopage}')
    return redirect(f'/index.html{f"?page/={autopage}" if autopage else ""}')

@main.route('/account/')
def account():
    return redirect('/account/index.html')
@main.route('/legal/')
def legal():
    return redirect('/legal/index.html')

@main.route('/search/')
@main.route('/search')
def search():
    search=request.args.get('q','')
    flixlog(f'User is searching "{search}"')
    return redirect(f'/search/index.html?q={search}')

@main.route('/error')
@main.route('/error/')
def error():
    code=request.args.get('code','not found (py)')
    message=request.args.get('message','not found (py)')
    error=request.args.get('error','not found (py)')
    flixlog(f'new error page : "{message}" ({code}) : {error}','error')
    return redirect(f'/error/index.html?code={code}&message={message}&error={error}')

@main.route('/systeminfo')
def sysinf():
    return jsonify(sysinfo)

@main.route('/search/platforminfo')
@main.route('/search/platformInfo')
@main.route('/legal/platforminfo')
@main.route('/legal/platformInfo')
@main.route('/account/platformInfo')
@main.route('/account/platforminfo') #./account and ./ uses the same js
@main.route('/platformInfo')
@main.route('/platforminfo')
def platform():
    return jsonify({
        "wrapper":{
            "version":OPENFLIX_wrapperVersion,
            "class":OPENFLIX_wrapperClass,
            "type":OPENFLIX_wrapperType,
            "system":OPENFLIX_wrapperSystem,
            "platform":OPENFLIX_wrapperPlatform,
            "compilesys":OPENFLIX_wrapperCompileSys,
            "local":False,
            "web_wrapper_type":OPENFLIX_wrapperWebwrappertype,
            "fullstring":f"{OPENFLIX_wrapperPlatform} wrapper for {OPENFLIX_wrapperSystem}({OPENFLIX_wrapperCompileSys}) | v{OPENFLIX_wrapperVersion}/{OPENFLIX_wrapperClass} - {OPENFLIX_wrapperType}",
            "update":{
                "string":OPENFLIX_updateString,
                "codename":OPENFLIX_updateCodename
            }
        },
        "internal":{
            "version":OPENFLIX_innerVersion,
            "class":OPENFLIX_wrapperClass,
            "fullstring":f"{OPENFLIX_innerVersion}/{OPENFLIX_innerClass}"
        }
    })

@main.route('/sources',defaults='')
@main.route('/sources/',defaults='')
@main.route('/sources/<path:path>')
def nah(path=None):
   if not path:
       return abort(404,'file not found. path was not provided. ex: ./sources/<filename>')
   if not getItem('saved_source'):
       return abort(404,'user has not provided any sources to fetch media from')
   return send_from_directory(PERM_EXTERNAL,path)

@main.route('/scripts/openflix/identity.json')
def identity():
   try:
    modified={}
    with open('../../scripts/openflix/identity.json','r') as iden:
        identityinfo=jsLoad(iden)
        original=identityinfo.get('openflix',{}).get('webcontainer','webcontainer not found (pyjsnoobj)')
        identityinfo.setdefault('openflix',{})['webcontainer']=f'{str(system()).lower()}/{OPENFLIX_wrapperWebwrappertype}'
        modified=identityinfo
        flixlog(f'identity from {original} to {identityinfo.get('openflix',{}).get('webcontainer','webcontainer not found (pyjsnoobj)')}')
    return jsonify(modified)
   except Exception as er:
        flixlog(f'error when modifying identity.json (might not be able to update) : {er}')
        return send_from_directory(PERM_EXTERNAL,'/openflix/identity.json')

@S.on('sources')
def sources():
    available=False
    if not getItem('saved_source'):
        available=False
    elif(len(sourceList)==len(listdir(PERM_EXTERNAL))):
        available=True
    else:
        available=False
    flixlog(f'[wrapmgr] requested sources availability : {"no sources available" if not available else "sources available"}')
    return available

@S.on('setSource')
def setsource(user='unnamed user',source=None):
    flixlog(f'{user} has provided sources : {source or "source unavailable"}')
    if source:
        setItem('saved_source',source)
        return refreshSource()
    else:
        return False

@S.on('clearsources')
def clears(user='unnamed user'):
    try:
        clearSource()
        return True
    except Exception as er:
        flixlog(er)
        error('OpenFlix','failed to clear sources - unknown error (check log)')
        return False

@S.on('openlog')
def oplog():
    openlog()

@S.on('firsttime')
def first():
 global firstime
 if firstime:
    installation_region='not found (py)'
    firstime=False
    try:
        res=get('http://ip-api.com/json',timeout=10)
        if res.status_code==200:
            regioninfo=res.json()
            if regioninfo.get('status','notsuccess')=='success':
                regionarr=[
                    regioninfo.get('country',''),
                    regioninfo.get('countryCode',''),
                    regioninfo.get('regionName',''),
                    regioninfo.get('city',''),
                    regioninfo.get('as',''),
                    regioninfo.get('isp',''),
                    regioninfo.get('org','')
                ]
                installation_region=' | '.join(info for info in regionarr if info!='')
            else:
                flixlog(f'failed to get region. status was not success ({regioninfo.get('status','notsuccess')}) : {regioninfo}','error')
                pass
        else:
            flixlog(f'failed to get region : {res.status_code}','error')
    except Exception as er:
        flixlog(f'error when requesting region : {er}','error')
        
    globalss=globals().copy().items()
    localsysinfo=sysinfo.copy()
    localsysinfo['openflix_string']=" | ".join(str(value) for key,value in globalss if value is not None and str(key).startswith('OPENFLIX_'))
    localsysinfo['product_region']=installation_region
    return localsysinfo
 else:
     return False

def startserver():
    S.run(app=main,port=int(port),debug=True,host='0.0.0.0',use_reloader=False)

if useWindow:
    Server=Thread(target=startserver,daemon=True)
    Server.start()
    sleep(2)
    settings['ALLOW_DOWNLOADS']=True
    # settings['OPEN_EXTERNAL_LINKS_IN_BROWSER']=False
    if settings.get('POPUP_ALLOWED_DOMAINS',None)!=None:
        settings['POPUP_ALLOWED_DOMAINS']=['tromosm','github','mail','example','supabase','imdb']
        if debugall:
            flixlog("Popup allowed : "+repr(settings),'debug|all')
        else:
            flixlog("Popup debug off : ",'deb')
    else:
        flixlog('not using the modified version of pywebview','warn')
    window=create_window('OpenFlix',f'http://127.0.0.1:{port}',min_size=windowMin,maximized=windowMax,width=windowDef[0],height=windowDef[1])

    #window events
    @S.on('fullscreen')
    def fullsc():
        flixlog(f'fullscreen toggled by user')
        window.toggle_fullscreen()
    @S.on('title')
    def title(windowtitle=None):
        if windowtitle!=None and type(windowtitle)==str:
            window.title=windowtitle
            flixlog(f'window title set to "{windowtitle}"')
        else:
            flixlog(f'window title set failed : {type(windowtitle)}','error')

    @main.route('/auth_callback/')
    def signin():
        code=request.args.get('code','')
        if code!='':
            S.emit('supaauth',code)
            window.on_top=True
            sleep(1)
            window.on_top=False
            return f'success : {window.get_current_url()}'
        else:
            return f'authentication failed'
    @S.on('openurl')
    def opendx(title,url):
        create_window(title=title,url=url)
        flixlog(f'"{title}" with url:"{url}" opened in new wrapwindow')

    start(debug=True,storage_path=PERM_INNERLOCALSTORAGE,private_mode=False,icon='icon.ico')
else:
    startserver()

flixlog(f'after storage file : {path.exists(PERM_INNERLOCALSTORAGE)}')