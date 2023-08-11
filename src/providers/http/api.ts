import Cookie from "./../storage/cookie";

type Options = {
    cache?:RequestCache;
} | null

function fetchApi() {

    return {

        get: async (url: string ,object: any = null, init?: RequestInit | undefined): Promise<JSON | any> => {
        
            const response = await fetch(url + `${ object ? `?${new URLSearchParams(object)}` : ''}`, {
                method: 'GET',
                cache: init?.cache || 'no-store',
                next: { revalidate: init?.next?.revalidate } || undefined,
                headers: init?.headers || {
                    'Content-Type': 'application/json;charset=utf-8',
                },
            })
            return response.json()
              
        },
        
        post: async (url: string ,object: any = null, init?: RequestInit | undefined): Promise<JSON | any> => {
                
            const response = await fetch(url, {
                method: 'POST',
                cache: init?.cache || 'no-store',
                next: { revalidate: init?.next?.revalidate } || undefined,
                headers: init?.headers || {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify(object)
            })
            return response.json()
        },
        
        delete: async (url: string, object?: any): Promise<JSON | any> => {
                
            const response = await fetch(url, {
                method: 'DELETE',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    // 'Authorization': `Bearer ${await Cookie.get('auth')}`,
                },
                body: JSON.stringify(object)
            })
            return response.status === 204 ? response : response.json()
        },

    }

}

const Api = fetchApi();

export default Api
