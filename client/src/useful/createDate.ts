export default function createDate() {
    return `${new Date().toLocaleDateString()}  ${new Date().toLocaleTimeString()}`
}