import { useState } from "react";
import { IconButton } from "./button";
import { List, ListItem, Modal, showToast } from "./ui-lib";
import styles from "./storage-selector.module.scss";

export function StorageSelector(props: {
  content: string;
  onClose: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");

  const saveToLocal = async () => {
    try {
      setSaving(true);
      setError("");

      // Save to localStorage with timestamp as key
      const key = `chat-content-${Date.now()}`;
      localStorage.setItem(key, props.content);
      showToast("Content saved successfully to local storage!");
      props.onClose();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      setError(`Failed to save to local storage: ${errorMsg}`);
      showToast("Failed to save to local storage");
    } finally {
      setSaving(false);
    }
  };

  const saveToZeroG = async () => {
    try {
      setSaving(true);
      setError("");

      // Create formData with content
      const formData = new FormData();
      const blob = new Blob([props.content], { type: "text/plain" });
      formData.append("file", blob, `chat-${Date.now()}.txt`);

      // Upload to 0G storage endpoint
      const response = await fetch("/api/storage/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}: ${response.statusText}`,
        );
      }

      showToast("Content saved successfully to 0G storage!");
      props.onClose();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      setError(`Failed to save to 0G storage: ${errorMsg}`);
      showToast("Failed to save to 0G storage");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-mask">
      <Modal title="Save Content" onClose={props.onClose}>
        <div className={styles["storage-selector"]}>
          {error && <div className={styles["error-message"]}>{error}</div>}
          <List>
            <ListItem title="Save to Local Storage">
              <IconButton
                text={saving ? "Saving..." : "Save Local"}
                onClick={saveToLocal}
                disabled={saving}
              />
            </ListItem>
            <ListItem title="Save to 0G Storage">
              <IconButton
                text={saving ? "Saving..." : "Save to 0G"}
                onClick={saveToZeroG}
                disabled={saving}
              />
            </ListItem>
          </List>
        </div>
      </Modal>
    </div>
  );
}
