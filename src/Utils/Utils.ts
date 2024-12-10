export const decodeBase64ToBlob = async (
  fileContent: string,
  fileName: string,
  mimeType: string
): Promise<{ url: string; file: Blob; name: string }> => {
  const binaryString = atob(fileContent);
  const binaryLength = binaryString.length;
  const bytes = new Uint8Array(binaryLength);

  for (let i = 0; i < binaryLength; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const blob = new Blob([bytes], { type: mimeType });
  const url = URL.createObjectURL(blob);

  return {
    url,
    file: blob,
    name: fileName,
  };
};
