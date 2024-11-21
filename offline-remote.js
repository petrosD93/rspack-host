export default function () {
    const getErrorMessage = (id, error) => `Remote ${id} is offline due to error: ${error}`;

    const getModule = (pg, from) => {
        if (from === 'build') {
            return () => ({
                __esModule: true,
                default: pg,
            });
        } else {
            return {
                default: pg,
            };
        }
    };

    return {
        name: 'offline-remote-plugin',
        // async beforePreloadRemote(args){
        //     console.log(args)
        //     const scope = args.preloadOps[0].nameOrAlias
        //
        //     const remote = args.options.remotes.find(r=> r.name ===scope)
        //
        //     const manipulateUrl=(url)=> {
        //         const parsedUrl = new URL(url);
        //         parsedUrl.pathname = '/mf-manifest.json';
        //         return parsedUrl.toString();
        //     }
        //
        //     remote.entry= manipulateUrl(remote.entry)
        //     return args
        // },
        errorLoadRemote({id, error, from, origin, lifecycle}) {
            const pg = function () {
                return null;
            };

            if (lifecycle === 'onLoad') {
                const remoteId = id.split('/')?.[0] ?? id
                console.log(`%cError Loading Remote: ${remoteId}`, 'color: red; font-size: 20px')

                // console.log('Error Loading Remote:', remoteId)
                console.error(getErrorMessage(remoteId, error));
            }

            return getModule(pg, from);
        },
    };
}
