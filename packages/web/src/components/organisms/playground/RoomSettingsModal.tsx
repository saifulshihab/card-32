import { IRoomSettings } from "@card-32/common/types/room";
import React, { useCallback, useEffect, useState } from "react";
import { useRoomContext } from "../../../contexts/RoomProvider";
import FlexContainer from "../../atoms/box/FlexContainer";
import SelectInput from "../../atoms/inputs/SelectInput";
import { SwitchInput } from "../../atoms/inputs/SwitchInput";
import Modal, { IModalProps } from "../../atoms/modal/Modal";

interface IProps extends IModalProps {
  onSave?: (roomSettings: IRoomSettings) => void;
}

const RoomSettingsModal: React.FC<IProps> = (props) => {
  const { visible, onSave, onClose } = props;
  const { room } = useRoomContext();
  const [roomSettings, setRoomSettings] = useState<IRoomSettings>({
    autoAcceptJoinRequest: false,
    resultDelay: 1,
  });

  useEffect(() => {
    if (room?.settings) {
      setRoomSettings(room.settings);
    }
  }, [room?.settings]);

  const handleRoomSettingsChange = useCallback(
    (name: keyof IRoomSettings, value: any) => {
      setRoomSettings((prev) => {
        if (prev) {
          return {
            ...prev,
            [name]: value,
          };
        }
        return { [name]: value };
      });
    },
    []
  );

  const handleSave = () => {
    onSave && onSave(roomSettings);
  };

  return (
    <Modal visible={visible} width="max-w-screen-sm" onClose={onClose}>
      <FlexContainer className="w-full flex-col items-start gap-3">
        <FlexContainer>
          <p className="text-xl font-bold">Settings</p>
        </FlexContainer>

        {/* options */}
        <FlexContainer className="w-full flex-col gap-4 mt-3 mb-6">
          <FlexContainer className="w-full justify-between text-sm">
            <p>Round result delay (in second)</p>
            <SelectInput
              value={roomSettings.resultDelay?.toString()}
              options={[
                {
                  key: "1",
                  name: "second",
                  value: "1",
                },
                {
                  key: "2",
                  name: "second",
                  value: "2",
                },
                {
                  key: "3",
                  name: "second",
                  value: "3",
                },
                {
                  key: "4",
                  name: "second",
                  value: "4",
                },
              ]}
              onChange={(v) =>
                handleRoomSettingsChange("resultDelay", parseInt(v))
              }
            />
          </FlexContainer>

          <FlexContainer className="w-full justify-between text-sm">
            <p>Auto accept join request</p>
            <SwitchInput
              checked={roomSettings.autoAcceptJoinRequest || false}
              onChange={(checked) =>
                handleRoomSettingsChange("autoAcceptJoinRequest", checked)
              }
            />
          </FlexContainer>
        </FlexContainer>

        <FlexContainer className="w-full gap-2 justify-end">
          <button className="btn-primary" onClick={() => onClose(visible)}>
            Close
          </button>
          <button className="btn-primary bg-primary" onClick={handleSave}>
            Save changes
          </button>
        </FlexContainer>
      </FlexContainer>
    </Modal>
  );
};

export { RoomSettingsModal };
