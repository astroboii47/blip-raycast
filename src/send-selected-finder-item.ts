import { closeMainWindow, popToRoot, showHUD, showToast, Toast } from "@raycast/api";
import { getSelectedFinderPaths } from "./finder";
import { sendPathsToBlip } from "./blip";

export default async function command() {
  try {
    const paths = await getSelectedFinderPaths();
    await closeMainWindow();
    await sendPathsToBlip(paths);
    await popToRoot();
    await showHUD(paths.length === 1 ? "Sent to Blip" : `Sent ${paths.length} items to Blip`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to send the selected Finder item to Blip.";
    await showToast({
      style: Toast.Style.Failure,
      title: "Blip send failed",
      message,
    });
  }
}
