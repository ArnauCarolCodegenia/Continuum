import React from "react";
import SettingsButton from "../SettingsButton";
import { isMobile } from "react-device-detect";

export const MAX_ICONS = 3;
export const ICON_COMPONENTS = {};

export default function Footer() {
  return (
    <div className="flex justify-center mb-2">
      <div className="flex space-x-4">
        {!isMobile && <SettingsButton />}
      </div>
    </div>
  );
}
