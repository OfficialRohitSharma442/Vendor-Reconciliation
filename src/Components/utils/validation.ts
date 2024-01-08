export function UserNamevalidation(input: string) {
    const regex = /^[a-zA-Z0-9]+$/;
    return regex.test(input)
}