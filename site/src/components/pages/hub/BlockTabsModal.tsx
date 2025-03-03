import { VoidFunctionComponent } from "react";
import { Box, Modal } from "@mui/material";

import { BlockDataTabPanels } from "./BlockDataTabPanels";
import { BlockDataTabs } from "./BlockDataTabs";
import { BlockSchema } from "./HubUtils";
import { BlockModalButton } from "./BlockModalButton";

interface BlockTabsModalProps {
  open: boolean;
  setOpen: (setBlockCallback: (oldValue: boolean) => boolean) => void;
  blockDataTab: number;
  setBlockDataTab: (newValue: number) => void;
  schema: BlockSchema;
  text: string;
  setText: (newValue: string) => void;
}

export const BlockTabsModal: VoidFunctionComponent<BlockTabsModalProps> = ({
  open,
  setOpen,
  blockDataTab,
  setBlockDataTab,
  schema,
  text,
  setText,
}) => {
  return (
    <Modal open={open} onClose={() => setOpen((oldValue) => !oldValue)}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50vw",
          boxShadow: 24,
          borderBottomLeftRadius: 6,
          borderBottomRightRadius: 6,
        }}
      >
        <Box position="relative">
          <BlockDataTabs
            blockDataTab={blockDataTab}
            setBlockDataTab={setBlockDataTab}
            modalOpen
          />
          <BlockDataTabPanels
            blockDataTab={blockDataTab}
            schema={schema}
            text={text}
            setText={setText}
            modalOpen
          />
          <Box
            style={{
              position: "absolute",
              height: "80px",
              width: "100%",
              bottom: 0,
              borderBottomLeftRadius: 6,
              borderBottomRightRadius: 6,
              textAlign: "right",
            }}
          >
            <BlockModalButton modalOpen={open} setBlockModalOpen={setOpen} />
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
