/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `send-to-blip` command */
  export type SendToBlip = ExtensionPreferences & {}
  /** Preferences accessible in the `send-selected-finder-item` command */
  export type SendSelectedFinderItem = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `send-to-blip` command */
  export type SendToBlip = {}
  /** Arguments passed to the `send-selected-finder-item` command */
  export type SendSelectedFinderItem = {}
}

