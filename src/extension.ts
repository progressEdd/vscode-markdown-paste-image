import vscode from "vscode";
import { latexSymbols } from "./latex";
import Logger from "./Logger";
import { Paster } from "./paster";

class LatexSymbol {
  latexItems: vscode.QuickPickItem[] = [];

  public getItems() {
    return this.latexItems;
  }

  public load(latexSymbols) {
    this.latexItems = [];
    for (let name in latexSymbols) {
      this.latexItems.push({
        description: latexSymbols[name],
        label: name,
      });
    }
  }

  public async insertToEditor(item: vscode.QuickPickItem) {
    if (!item) {
      return;
    }
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    try {
      await editor.edit((editBuilder) => {
        editBuilder.delete(editor.selection);
      });
      await editor.edit((editBuilder) => {
        editBuilder.insert(editor.selection.start, item.description);
      });
    } catch (error) {
      Logger.log("Failed to insert math symbol:", error);
    }
  }
}

export function activate(context: vscode.ExtensionContext) {
  Logger.channel = vscode.window.createOutputChannel("Markdown Paste");
  Logger.log('"vscode-markdown-paste" is now active!');
  let LatexMathSymbol = new LatexSymbol();
  LatexMathSymbol.load(latexSymbols);

  // Fix: Register telesoho.insertMathSymbol with context.subscriptions and proper error handling
  context.subscriptions.push(
    vscode.commands.registerCommand("telesoho.insertMathSymbol", async () => {
      try {
        const item = await vscode.window.showQuickPick(
          LatexMathSymbol.getItems(),
          {
            ignoreFocusOut: true,
          }
        );
        await LatexMathSymbol.insertToEditor(item);
      } catch (error) {
        Logger.log("Failed to insert math symbol:", error);
      }
    })
  );

  // Fix: Await async Paster.pasteDownload() with error handling
  context.subscriptions.push(
    vscode.commands.registerCommand("telesoho.MarkdownDownload", async () => {
      try {
        await Paster.pasteDownload();
      } catch (error) {
        Logger.log("MarkdownDownload failed:", error);
      }
    })
  );

  // Fix: Await async Paster.paste() with error handling
  context.subscriptions.push(
    vscode.commands.registerCommand("telesoho.MarkdownPaste", async () => {
      try {
        await Paster.paste();
      } catch (error) {
        // Log detailed error information
        Logger.log("MarkdownPaste failed - error type:", typeof error);
        Logger.log(
          "MarkdownPaste failed - error constructor:",
          error?.constructor?.name
        );
        Logger.log(
          "MarkdownPaste failed - error instanceof Error:",
          error instanceof Error
        );
        if (error instanceof Error) {
          Logger.log("MarkdownPaste failed - error message:", error.message);
          Logger.log("MarkdownPaste failed - error stack:", error.stack);
        } else {
          Logger.log("MarkdownPaste failed - error value:", error);
          Logger.log("MarkdownPaste failed - error toString:", String(error));
          Logger.log(
            "MarkdownPaste failed - error JSON:",
            JSON.stringify(error, null, 2)
          );
        }
      }
    })
  );

  // Already correct: Paster.Ruby() is not async
  context.subscriptions.push(
    vscode.commands.registerCommand("telesoho.MarkdownRuby", () => {
      Paster.Ruby();
    })
  );

  // Fix: Await async Paster.pasteCode() with error handling
  context.subscriptions.push(
    vscode.commands.registerCommand("telesoho.MarkdownPasteCode", async () => {
      try {
        await Paster.pasteCode();
      } catch (error) {
        Logger.log("MarkdownPasteCode failed:", error);
      }
    })
  );
}

export function deactivate() {
  Logger.log('"vscode-markdown-paste" is now inactive!');
}
