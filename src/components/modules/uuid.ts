export default function uuid(size: number): string {
    const hexStr = 'abcdifghijklmnopqrstuvwxyz123456789';
    let newStr = '';
    for (let i = 0; i < size; i++) {
        newStr += hexStr[Math.round(Math.random() * (hexStr.length - 1))];
    }
    return newStr;
}
