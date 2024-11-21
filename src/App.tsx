import './App.css';
// import ProviderButton from 'remote/button';
// import Config from 'portalConfig/Config'
import {Suspense, useState} from "react";
import {getRemoteFunction, initializeModuleFederation, loadComponent} from "./module-federation.utils.ts";


initializeModuleFederation().then(() =>{})

const Rem = loadComponent('remoteButton')


const App = () => {
    const [showRem, setShowRem] = useState(false)


    const onClick = async () => {
        setShowRem(true)
        // loadRemote('remote/getItem').then((res:any)=>{
        //     console.log(res.getItem())
        // }).catch(()=>{})
       const tst = await getRemoteFunction('remoteGetItem')
        console.log(tst)
    }

    // console.log(Config.menuItems)
    return (
        <div className="content">
            <h1>HOST</h1>

            {/*{Config.version}*/}
            <p>Start building amazing things with Rsbuild.</p>
            {/*{version}*/}
            <button onClick={onClick}>Show Rem</button>
            {showRem && <Suspense>
                <Rem></Rem>
            </Suspense>}

            {/*{Config.version}*/}
            {/*<Suspense fallback="Loading Button">*/}

            {/*<ProviderButton />*/}
            {/*</Suspense>*/}
        </div>
    );
};

export default App;
