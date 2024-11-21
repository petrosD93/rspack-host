import {init, loadRemote} from "@module-federation/runtime";
import {ComponentType, lazy, LazyExoticComponent} from "react";


let globalRemotes: Remote[] = []


export const initializeModuleFederation = async () => {
    const res = await Promise.all([fetch('./config.json'), fetch('./remoteUrls.json')]);
    const config: { subdomain: string; [k: string]: any; } = await res[0].json();
    const remoteConfig: { domain: string; remotes: Remote[]; } = await res[1].json();
    const remotes: Remote[] = (remoteConfig.remotes as Remote[]).filter(r => !r.disabled);
    init({
        name: 'host',
        remotes: remotes.map((r_1: Remote) => {
            const url = r_1.urlOverride
                ? `${r_1.urlOverride}/${r_1.filename}?${new Date().getTime()}`
                : `https://${r_1.subdomainUri}${config.subdomain}.${remoteConfig.domain}/${r_1.filename}?${new Date().getTime()}`;

            return {
                name: r_1.name,
                alias: r_1.alias,
                entry: url,
            };
        })
    });
    globalRemotes = remotes.map((r_2: Remote) => {
        const modules: RemoteModule[] = r_2.modules.map((m: RemoteModule) => {
            if (m.preload && m.type === 'function') {
                loadRemote(`${r_2.alias}${m.value.replace('.', '')}`).then((res_1: any) => {
                    (window as any)[m.name] = res_1?.[m.value.replace('./', '')]?.();
                }).catch((e) => {
                    console.error(e);
                });
            }

            return {...m, loadEntry: `${r_2.alias}${m.value.replace('.', '')}`};
        });
        return {...r_2, modules};

    });
}

const getModule = (name: string): RemoteModule | undefined => globalRemotes.find(r => r.modules.find(m => m.name === name))?.modules.find(m => m.name === name)


const loadRemoteFunction = async (name: string): Promise<any> => {
    const module: RemoteModule | undefined = getModule(name)
    if (module && module.type === 'function' && module.loadEntry) {
        if ((window as any)[name]) {
            return Promise.resolve((window as any)[name])
        } else {
            try {
                let res = await (loadRemote(module.loadEntry) as Promise<any>);
                (window as any)[module.name] = res?.[module.value.replace('./', '')]?.()
                return (window as any)[module.name]
            } catch (e) {
                console.error(e)
                return Promise.reject(e)
            }
        }
    } else if (module && module.type !== 'function') {
        console.error(`Module '${name}' is not a function`)
    } else {
        console.error(`Function '${name}' not found in configuration file remoteUrls.json`)
    }
    return Promise.reject(undefined)
}

export const getRemoteFunction = async (name: string): Promise<any> => {
    return loadRemoteFunction(name).then((res) => {
        return res
    }).catch(() => {})
}


export const loadComponent = (name: string): LazyExoticComponent<ComponentType<any>> => lazy(() => {
    const module: RemoteModule | undefined = getModule(name)
    if (module && module.type === 'component' && module.loadEntry) {
        return loadRemote<any>(module.loadEntry, {from: 'runtime'}) as Promise<any>
    } else if (module && module.type !== 'component') {
        console.error(`Module '${name}' is not a component`)
    } else {
        console.error(`Component '${name}' not found in configuration file remoteUrls.json`)

    }

    const FallbackComponent = () => null;
    return Promise.resolve({default: FallbackComponent})
})

export interface Remote {
    alias: string
    name: string
    subdomainUri: string
    urlOverride?: string
    disabled?: boolean
    filename: string
    modules: RemoteModule[]
}

export interface RemoteModule {
    name: string
    value: string,
    type: 'function' | 'component',
    preload?: boolean
    loadEntry?: string
}
