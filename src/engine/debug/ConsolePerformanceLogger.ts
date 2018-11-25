import { Injectable } from "../di/Injectable";
import { ConsoleLogger } from "./ConsoleLogger";
import { ConsoleLoggerPrefix } from "./ConsoleLoggerPrefix";

@Injectable()
export class ConsolePerformanceLogger extends ConsoleLogger {

    private total: number = performance.now();
    private roundTime: number = this.total;

    /**
     * prints a text onto the console with aditional performance measureing since
     * the last call to this function
     * @param text the text to print
     * @param prefix optional prefix
     */
    public printText(text: string, prefix: ConsoleLoggerPrefix = ConsoleLoggerPrefix.None): void {

        // get current performance offset
        const current = performance.now();
        const offsetMs = Math.floor(current - this.roundTime);

        // get the color
        const style = this.getPerformanceStyle(offsetMs);

        // print the text
        console.log(`${prefix}${text} %c[+${offsetMs}ms]`, style);

        // update round time
        this.roundTime = current;
    }

    /**
     * prints the total time since the start of the application with the given text
     * @param text the text to print
     * @param prefix optional prefix
     */
    public printTotalText(text: string, prefix: ConsoleLoggerPrefix = ConsoleLoggerPrefix.None): void {

        // get current performance offset
        const current = performance.now();
        const offsetMs = Math.floor(current - this.total);

        // get the color
        const style = this.getPerformanceStyle(offsetMs, 500, 250);

        // print the text
        console.log(`${prefix}${text} %c[${offsetMs}ms]`, style);
    }

    /**
     * get the correct console style for the given time
     * @param time the offset time in ms
     */
    private getPerformanceStyle(time: number, red: number = 50, yellow: number = 25): string {

        let color: string = "green";
        if (time > red) {
            color = "red";
        } else if (time > yellow) {
            color = "#d6d634";
        }

        return `color: ${color};`;
    }
}
