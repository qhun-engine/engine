import { ConsoleLoggerPrefix } from "./ConsoleLoggerPrefix";

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
     * @param prefix optional prefix
     */
    public printGrey(text: string, prefix: ConsoleLoggerPrefix = ConsoleLoggerPrefix.None): void {

        console.log(`%c${prefix}${text}`, "color: #afafaf;");
    }

    /**
     * logs all arguments using console.log
     * @param args the arguments to log
     */
    public log(...args: any[]): void {

        console.log(...args);
    }
}
