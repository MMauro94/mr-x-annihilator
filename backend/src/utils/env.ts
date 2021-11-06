/**
 * Obtains an environment variable
 * @param name the name of the environment variable
 * @param defaultValue default value, in case it doesn't exists. If unprovided or undefined, an Rrror is thrown instead.
 */
export function env(name: string, defaultValue?: string): string {
    const ret = process.env[name]
    if (ret === undefined) {
        if(defaultValue === undefined) {
            throw new Error(`Unable to obtain environment variable "${name}". Please make sure to have it defined and try again`)
        } else {
            return defaultValue
        }
    }
    return ret
}

export function envInt(name: string, defaultValue?: number): number {
    const value = parseInt(env(name, defaultValue?.toString()))
    if (isNaN(value)) {
        throw new Error(`Invalid value for environment variable "${name}": unparsable integer`)
    }
    return value
}