"use client";

import { useSyncExternalStore } from "react";

const storageEventName = "quizai-storage-change";
export const serverSnapshot = "__quizai_server_snapshot__";

function subscribe(callback: () => void) {
	window.addEventListener("storage", callback);
	window.addEventListener(storageEventName, callback);
	return () => {
		window.removeEventListener("storage", callback);
		window.removeEventListener(storageEventName, callback);
	};
}

function getSnapshot(key: string) {
	return () => window.localStorage.getItem(key);
}

export function useLocalStorageValue(key: string) {
	return useSyncExternalStore(subscribe, getSnapshot(key), () => serverSnapshot);
}

export function setLocalStorageValue(key: string, value: string) {
	window.localStorage.setItem(key, value);
	window.dispatchEvent(new Event(storageEventName));
}

export function removeLocalStorageValue(key: string) {
	window.localStorage.removeItem(key);
	window.dispatchEvent(new Event(storageEventName));
}
