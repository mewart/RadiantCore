function saveFile(contents, filename = 'download.txt') {
  try {
    const blob = new Blob([contents], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const element = document.createElement("a");
    element.setAttribute("href", url);
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    // Cleanup
    document.body.removeChild(element);
    URL.revokeObjectURL(url);

    console.log(`✅ File "${filename}" saved successfully.`);
  } catch (err) {
    console.error("❌ Failed to save file:", err);
  }
}
