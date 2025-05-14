import React, { useState, useEffect } from "react";
import { IconButton } from "./button";
import { List, ListItem, Modal, showToast } from "./ui-lib";
import styles from "./storage-selector.module.scss";

export function StorageSelector(props: {
  content: string;
  onClose: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [storageStatus, setStorageStatus] = useState<{
    local: boolean;
    zeroG: "checking" | "connected" | "disconnected";
  }>({
    local: true,
    zeroG: "checking",
  });

  useEffect(() => {
    const checkConnections = async () => {
      try {
        const response = await fetch("/api/storage/status");
        setStorageStatus((prev) => ({
          ...prev,
          zeroG: response.ok ? "connected" : "disconnected",
        }));
      } catch {
        setStorageStatus((prev) => ({
          ...prev,
          zeroG: "disconnected",
        }));
      }
    };
    checkConnections();
  }, []);

  const saveToLocal = async () => {
    try {
      setSaving(true);
      setError("");
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

      if (storageStatus.zeroG !== "connected") {
        throw new Error(
          "0G Network unavailable - Please check your connection",
        );
      }

      const formData = new FormData();
      const blob = new Blob([props.content], { type: "text/plain" });
      formData.append("file", blob, `chat-${Date.now()}.txt`);

      const response = await fetch("/api/storage/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          `RPC Error (${response.status}): ${
            data.error || response.statusText
          }`,
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
                disabled={saving || !storageStatus.local}
              />
            </ListItem>
            <ListItem title="Save to 0G Storage">
              <div className={styles["storage-status"]}>
                <span className={styles[`status-${storageStatus.zeroG}`]}>
                  ●
                </span>
                <IconButton
                  text={saving ? "Saving..." : "Save to 0G"}
                  onClick={saveToZeroG}
                  disabled={saving || storageStatus.zeroG !== "connected"}
                />
              </div>
            </ListItem>
          </List>
        </div>
      </Modal>
    </div>
  );
}
