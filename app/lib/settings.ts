export function getSetting(key: string) {
  const settings = JSON.parse(
    localStorage.getItem("settings") || "{}"
  );

  return settings[key];
}

export function setSetting(key: string, value: any) {
  const settings = JSON.parse(
    localStorage.getItem("settings") || "{}"
  );

  settings[key] = value;

  localStorage.setItem(
    "settings",
    JSON.stringify(settings)
  );
}