export abstract class ConsoleLogger {

    /**
     * fils the console line with the given char
     * @param char the character to use when filling the line
     */
    public fillLine(char: string = "-"): void {

        console.log(char.repeat(50));
    }

    /**
     * prints the given text with grey color
     * @param text the text to print
     */
    public printGrey(text: string): void {

        console.log(`%c${text}`, "color: #afafaf;");
    }
}
