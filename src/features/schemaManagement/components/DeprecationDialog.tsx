import type { ChangeEvent, FC } from "react";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import CloseIcon from "@diligentcorp/atlas-react-bundle/icons/Close";
import type { AttributeDefinition } from "../../../types/attribute.js";
import { STR } from "../../../utils/i18n.js";

interface Props {
  attribute: AttributeDefinition | null;
  onConfirm: (id: string, reason?: string) => void;
  onClose: () => void;
}

/**
 * Confirmation dialog shown before deprecating a custom attribute.
 * Includes an optional free-text reason field — the reason is displayed
 * in the DeprecatedChip tooltip on the attribute list.
 */
export const DeprecationDialog: FC<Props> = ({ attribute, onConfirm, onClose }) => {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (!attribute) return;
    onConfirm(attribute.id, reason.trim() || undefined);
    setReason("");
    onClose();
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <Dialog
      open={!!attribute}
      onClose={handleClose}
      aria-labelledby="deprecation-dialog-title"
      aria-describedby="deprecation-dialog-description"
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle component="div">
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={1}>
          <div>
            <h2 style={{ margin: 0 }}>{STR.deprecationDialog.title}</h2>
            {attribute && (
              <p style={{ margin: "4px 0 0" }}>
                <strong>{attribute.name}</strong>
              </p>
            )}
          </div>
          <IconButton
            aria-label="Close dialog"
            onClick={handleClose}
            color="inherit"
            size="small"
          >
            <CloseIcon aria-hidden />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack gap={2}>
          <DialogContentText id="deprecation-dialog-description">
            {STR.deprecationDialog.subtitle}
          </DialogContentText>
          <TextField
            label={STR.deprecationDialog.reasonLabel}
            value={reason}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setReason(e.target.value)}
            placeholder="e.g. Replaced by 'Regulatory classification'"
            fullWidth
            multiline
            minRows={2}
            helperText={STR.deprecationDialog.reasonHint}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          {STR.deprecationDialog.cancel}
        </Button>
        <Button variant="contained" color="warning" onClick={handleConfirm} autoFocus>
          {STR.deprecationDialog.confirm}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
