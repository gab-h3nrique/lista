
export function Params(url: string, param?: string):any {

    const searchParams = (new URLSearchParams(url.split('?')[1])) as any;

    let params: any = {};

    for (const [key, value] of searchParams.entries()) {

        if(!param) params[key] = value;

        if(param && param === key) params = { [key]: value }
        
    }

    return params


}

