export function parseQuery(search) {
    const args = search.substring(search.indexOf('?')+1).replace('+',' ').split('&');
    let argsParsed = {};

    let i, arg, kvp, key, value;

    for (i=0; i < args.length; i++) {

        arg = args[i];

        if (-1 === arg.indexOf('=')) {

            argsParsed[decodeURIComponent(arg).trim()] = true;
        }
        else {

            kvp = arg.split('=');

            key = decodeURIComponent(kvp[0]).trim();

            value = decodeURIComponent(kvp[1]).trim();

            argsParsed[key] = value;
        }
    }

    return argsParsed;
}