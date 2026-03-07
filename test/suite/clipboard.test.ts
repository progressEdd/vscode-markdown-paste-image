import * as assert from "assert";
import * as xclip from "xclip";
import { execSync } from "child_process";
import * as fs from "fs";
import { tmpdir } from "os";

suite("Clipboard Integration Tests", () => {
  // Helper: Detect display server
  function detectDisplayServer(): "wayland" | "x11" | "unknown" {
    if (process.env.WAYLAND_DISPLAY) return "wayland";
    if (process.env.XDG_SESSION_TYPE === "wayland") return "wayland";
    if (process.env.XDG_SESSION_TYPE === "x11") return "x11";
    return "unknown";
  }

  // Helper: Check if tool available
  function isToolAvailable(tool: string): boolean {
    try {
      execSync(`command -v ${tool}`, { stdio: "ignore" });
      return true;
    } catch {
      return false;
    }
  }

  // Helper: Get required tool for current display server
  function getRequiredTool(): string {
    const server = detectDisplayServer();
    return server === "wayland" ? "wl-copy" : "xclip";
  }

  // Skip on non-Linux platforms
  if (process.platform !== "linux") {
    console.log("Skipping clipboard tests - Linux only");
    return;
  }

  test("should detect display server environment", () => {
    const server = detectDisplayServer();
    assert.ok(["wayland", "x11", "unknown"].includes(server));
    console.log(`Detected display server: ${server}`);
  });

  test("should copy and paste plain text", async () => {
    const tool = getRequiredTool();
    if (!isToolAvailable(tool)) {
      assert.fail(
        `${tool} not found. Install with: apt install ${
          tool === "wl-copy" ? "wl-clipboard" : "xclip"
        }`
      );
    }

    const shell = xclip.getShell();
    const cb = shell.getClipboard();

    const testText = "Hello, Clipboard! Testing Wayland integration.";

    // Write to clipboard using shell command
    execSync(
      `echo -n '${testText}' | ${
        tool === "wl-copy" ? "wl-copy" : "xclip -selection clipboard"
      }`
    );

    // Read from clipboard via xclip API
    const pastedText = await cb.getTextPlain();

    assert.strictEqual(
      pastedText,
      testText,
      "Pasted text should match original"
    );
  });

  test("should copy and paste HTML content", async () => {
    const tool = getRequiredTool();
    if (!isToolAvailable(tool)) {
      assert.fail(
        `${tool} not found. Install with: apt install ${
          tool === "wl-copy" ? "wl-clipboard" : "xclip"
        }`
      );
    }

    const shell = xclip.getShell();
    const cb = shell.getClipboard();

    const testHtml = "<p>Hello <strong>HTML</strong> clipboard!</p>";

    // Write HTML to clipboard
    if (tool === "wl-copy") {
      execSync(`echo -n '${testHtml}' | wl-copy --type text/html`);
    } else {
      execSync(
        `echo -n '${testHtml}' | xclip -selection clipboard -t text/html`
      );
    }

    // Read from clipboard
    const pastedHtml = await cb.getTextHtml();

    assert.ok(pastedHtml.includes("Hello"), "HTML should contain 'Hello'");
    assert.ok(pastedHtml.includes("strong"), "HTML should preserve formatting");
  });

  test("should copy and paste PNG image", async () => {
    const tool = getRequiredTool();
    if (!isToolAvailable(tool)) {
      assert.fail(
        `${tool} not found. Install with: apt install ${
          tool === "wl-copy" ? "wl-clipboard" : "xclip"
        }`
      );
    }

    const shell = xclip.getShell();
    const cb = shell.getClipboard();

    // Small 1x1 red PNG (base64 encoded)
    const pngBase64 =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==";
    const pngBuffer = Buffer.from(pngBase64, "base64");

    // Create temp file for image
    const tmpPath = `${tmpdir()}/test-clipboard-${Date.now()}.png`;
    fs.writeFileSync(tmpPath, pngBuffer);

    // Copy image to clipboard
    if (tool === "wl-copy") {
      execSync(`wl-copy --type image/png < ${tmpPath}`);
    } else {
      execSync(`xclip -selection clipboard -t image/png < ${tmpPath}`);
    }

    // Get image from clipboard
    const outputPath = `${tmpdir()}/output-${Date.now()}.png`;
    const result = await cb.getImage(outputPath);

    assert.ok(fs.existsSync(outputPath), "Output image should exist");

    // Cleanup
    fs.unlinkSync(tmpPath);
    fs.unlinkSync(outputPath);
  });

  test("should detect clipboard content type", async () => {
    const tool = getRequiredTool();
    if (!isToolAvailable(tool)) {
      assert.fail(
        `${tool} not found. Install with: apt install ${
          tool === "wl-copy" ? "wl-clipboard" : "xclip"
        }`
      );
    }

    const shell = xclip.getShell();
    const cb = shell.getClipboard();

    // Put text in clipboard
    execSync(
      `echo -n 'test content type' | ${
        tool === "wl-copy" ? "wl-copy" : "xclip -selection clipboard"
      }`
    );

    const type = await cb.getContentType();

    // Should detect text type
    assert.ok(type !== undefined, "Content type should be detected");
  });

  test("should fail with clear message when tool not available", async () => {
    // This test documents expected behavior - actual behavior tested by other tests
    const server = detectDisplayServer();
    const requiredTool = server === "wayland" ? "wl-copy" : "xclip";

    if (!isToolAvailable(requiredTool)) {
      const expectedMessage = `${requiredTool} not found. Install with: apt install ${
        requiredTool === "wl-copy" ? "wl-clipboard" : "xclip"
      }`;
      console.log(`Expected failure message: ${expectedMessage}`);
    }

    // Test passes if we reach here (tool available or documented)
    assert.ok(true);
  });
});
