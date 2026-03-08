import * as vscode from "vscode";
import moment from "moment";

export default class Logger {
  static channel: vscode.OutputChannel;

  static log(...message: any[]) {
    if (this.channel) {
      const time = moment().format("MM-DD HH:mm:ss");
      for (const m of message) {
        try {
          let str: string;
          if (typeof m === "string") {
            str = m;
          } else {
            try {
              str = JSON.stringify(m, null, 2);
            } catch (jsonError) {
              // Handle circular references or other JSON errors
              str = `[Object: ${m?.constructor?.name || typeof m}]`;
            }
          }
          // Ensure str is actually a string before calling substring
          if (typeof str !== "string") {
            str = String(str);
          }
          const logmsg = `[${time}] ${str.substring(0, 256)}`;
          this.channel.appendLine(logmsg);
        } catch (error) {
          // Fallback: just convert to string and log
          const fallbackMsg = `[${time}] [Logger error: ${error}] ${String(m)}`;
          this.channel.appendLine(fallbackMsg.substring(0, 256));
        }
      }
    }
  }

  static showInformationMessage(
    message: string,
    ...items: string[]
  ): Thenable<string> {
    this.log(message);
    return vscode.window.showInformationMessage(message, ...items);
  }

  static showErrorMessage(
    message: string,
    ...items: string[]
  ): Thenable<string> {
    this.log(message);
    return vscode.window.showErrorMessage(message, ...items);
  }
}
