import { Action, ActionPanel, Form, Icon, Toast, showToast } from "@raycast/api";
import { useEffect, useState } from "react";
import { sendCurrentFinderSelectionToBlip, sendPathsToBlip } from "./blip";
import { getSelectedFinderPaths } from "./finder";

type Values = {
  path: string[];
};

export default function Command() {
  const [selectedPaths, setSelectedPaths] = useState<string[]>([]);
  const [finderSelectionPaths, setFinderSelectionPaths] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadFinderSelection() {
      try {
        const paths = await getSelectedFinderPaths();
        if (isMounted) {
          setFinderSelectionPaths(paths);
          setSelectedPaths(paths);
        }
      } catch {
        // Finder selection is optional for this command.
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadFinderSelection();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(values: Values) {
    try {
      if (matchesFinderSelection(values.path, finderSelectionPaths)) {
        await sendCurrentFinderSelectionToBlip();
      } else {
        await sendPathsToBlip(values.path);
      }
      await showToast({
        style: Toast.Style.Success,
        title: values.path.length === 1 ? "Sent to Blip" : `Sent ${values.path.length} items to Blip`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to send the selected file to Blip.";
      await showToast({
        style: Toast.Style.Failure,
        title: "Blip send failed",
        message,
      });
    }
  }

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Send to Blip" onSubmit={handleSubmit} icon={Icon.Upload} />
        </ActionPanel>
      }
    >
      <Form.Description text="Choose one or more files or folders to send. If Finder has a current selection, it will appear here automatically. Raycast needs Accessibility permission to trigger Blip's Finder Services action." />
      <Form.FilePicker
        id="path"
        title="File or Folder"
        value={selectedPaths}
        onChange={setSelectedPaths}
        allowMultipleSelection={true}
        canChooseDirectories
        canChooseFiles
      />
    </Form>
  );
}

function matchesFinderSelection(paths: string[], finderSelectionPaths: string[]) {
  if (paths.length === 0 || paths.length !== finderSelectionPaths.length) {
    return false;
  }

  return paths.every((path, index) => path === finderSelectionPaths[index]);
}
