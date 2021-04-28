export const STORE_STATI = {
    INITIAL: 'INITIAL',
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
};

export const objWithHexStrToBn = (obj) => {
    if (typeof obj === 'string') {
        return new BN(obj, 16);
    }

    Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === 'object') {
            objWithHexStrToBn(value);
        } else {
            obj[key] = new BN(value.toString(), 16);
        }
    });
};

export const idpAPIUrl = 'http://localhost:5000';
export const randomizerAPIUrl = 'http://localhost:7000';
