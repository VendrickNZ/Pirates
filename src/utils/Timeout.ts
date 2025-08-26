export default function TimeoutInSeconds(seconds: number): Promise<NodeJS.Timeout> {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000)) // timeout uses milliseconds
}