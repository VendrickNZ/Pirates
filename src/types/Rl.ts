export interface Rl {
    question(query: string, callback: (answer: string) => void): void;
    close(): void;
}
