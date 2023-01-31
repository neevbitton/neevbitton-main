export default interface User {
    id: string,
    email: string,
    hash?: string | null,
    firstName?: string | null,
    lastName?: string | null,
    role: string
}