// https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript

import { get } from "svelte/store";
import type { Asset } from "./interfaces";
import { online } from "src/components/settings/settingsStore";

function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}
export function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function () {
        console.log('clipboard - Copying to clipboard was successful! Copied text: ' + text);
    }, function (err) {
        console.error('clipboard - Could not copy text: ', err);
    });
}

// usage
// copyTextToClipboard("text to copy");

export function checkUrl(asset: Asset) {
	if (!asset)
		return "";
	const url = asset.path;
    if (!url)
        return "";
    if (url.startsWith('https') || url.startsWith('http')) {
        if (!get(online)){
            console.warn("api - url was not allowed to load, because offline mode is enforced", url);
            return "";
        }
        console.warn('api - warning: online url (you should download assets too using DiscordChatExporter)', url);
        return url;
    }
    return "/input/" + url
}

export function getFileNameFromUrl(url) {
    if (!url)
        return "";
    return url.split('/').pop();
}


export function clamp(num: number, min: number, max: number): number {
    return Math.min(Math.max(num, min), max);
}


// (modified) https://github.com/vegeta897/snow-stamp/blob/4803e7889da524b8c83bc2d72882b82f02622662/src/convert.js#L1-L9
// Converts a snowflake ID string into a JS Date object using the Discord's epoch (in ms)
const DISCORD_EPOCH = 1420070400000
export function snowflakeToDate(snowflake: string) {
	// Convert snowflake to BigInt to extract timestamp bits
	// https://discord.com/developers/docs/reference#snowflakes
	const milliseconds = BigInt(snowflake) >> 22n
	return new Date(Number(milliseconds) + DISCORD_EPOCH)
}

export function darkenColor(color: string, amount: number) {
    let red = parseInt(color.substring(1, 3), 16);
    let green = parseInt(color.substring(3, 5), 16);
    let blue = parseInt(color.substring(5, 7), 16);

    let redDarker = Math.round(red * (1 - amount)).toString(16).padStart(2, "0");
    let greenDarker = Math.round(green * (1 - amount)).toString(16).padStart(2, "0");
    let blueDarker = Math.round(blue * (1 - amount)).toString(16).padStart(2, "0");

    return "#" + redDarker + greenDarker + blueDarker;
}

export function humanFileSize(bytes: number, decimalPlaces: number) {
    if (bytes < 1024) {
        return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
        return `${Math.round(bytes / 1024 * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces)} KB`;
    } else if (bytes < 1024 * 1024 * 1024) {
        return `${Math.round(bytes / 1024 / 1024 * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces)} MB`;
    } else {
        return `${Math.round(bytes / 1024 / 1024 / 1024 * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces)} GB`;
    }
}