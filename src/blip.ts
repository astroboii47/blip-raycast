import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const BLIP_SHARE_SCRIPT = `
function run(argv) {
  ObjC.import("AppKit");

  const items = argv.map((path) => $.NSURL.fileURLWithPath(path));
  const services = $.NSSharingService.sharingServicesForItems(items);
  let blipService = null;

  for (let index = 0; index < services.count; index++) {
    const service = services.objectAtIndex(index);
    if (ObjC.unwrap(service.title) === "Blip") {
      blipService = service;
      break;
    }
  }

  if (!blipService) {
    throw new Error("Blip share service not found");
  }

  blipService.performWithItems(items);
  delay(1);
}
`;

export async function sendPathToBlip(path: string) {
  return sendPathsToBlip([path]);
}

export async function sendPathsToBlip(paths: string[]) {
  if (paths.length === 0) {
    throw new Error("Choose at least one file or folder first.");
  }

  for (const path of paths) {
    if (!path) {
      throw new Error("Choose at least one file or folder first.");
    }

    if (!existsSync(path)) {
      throw new Error(`Path does not exist: ${path}`);
    }
  }

  try {
    await execFileAsync("/usr/bin/osascript", ["-l", "JavaScript", "-e", BLIP_SHARE_SCRIPT, "--", ...paths]);
  } catch (error) {
    const details = error instanceof Error ? error.message : "Unknown share service failure.";
    throw new Error(buildBlipShareError(details));
  }
}

function buildBlipShareError(details: string) {
  const normalizedDetails = details.toLowerCase();

  if (
    normalizedDetails.includes("blip share service not found") ||
    normalizedDetails.includes("share service not found")
  ) {
    return "Blip's share service was not found. Make sure Blip is installed and available in the macOS Share menu.";
  }

  return `Blip could not be triggered from the macOS Share menu. ${details}`;
}
