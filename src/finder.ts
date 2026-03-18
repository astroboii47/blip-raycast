import { getSelectedFinderItems } from "@raycast/api";

export async function getSelectedFinderPaths() {
  const selectedItems = await getSelectedFinderItems();

  if (selectedItems.length === 0) {
    throw new Error("No Finder item is selected.");
  }

  return selectedItems.map((item) => item.path);
}
