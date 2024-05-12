import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

export type FileMetadata = {
  storageId: string;
  type: "image/jpeg" | "image/png" | "application/pdf";
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // For example, 10MB

function isFileMetadataType(type: string): type is FileMetadata["type"] {
  return ["image/jpeg", "image/png", "application/pdf"].includes(type);
}

export const handleFileUploads = async (
  formData: FormData,
  convex: ConvexHttpClient,
): Promise<FileMetadata[]> => {
  let filesMetadata: FileMetadata[] = [];

  for (const [key, value] of formData.entries()) {
    if (value instanceof Blob) {
      if (value.size > MAX_FILE_SIZE) {
        throw new Error(`File size exceeds limit of ${MAX_FILE_SIZE} bytes`);
      }

      const storageId = await uploadFileToStorage(
        convex,
        value,
        value.name,
        value.type,
      );

      if (isFileMetadataType(value.type)) {
        filesMetadata.push({ storageId, type: value.type });
      } else {
        throw new Error(`File type ${value.type}' is not supported`);
      }
    }
  }

  return filesMetadata;
};

export const uploadFileToStorage = async (
  convex: ConvexHttpClient,
  fileBlob: Blob,
  fileName: string,
  fileType: string,
): Promise<string> => {
  // Generate an upload URL for the file
  const uploadUrlRes = await convex.mutation(api.submissions.generateUploadUrl);
  const uploadUrl = uploadUrlRes;

  // Use the fetch API to upload the file directly to the generated URL
  const uploadResult = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      "Content-Type": fileType,
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
    body: fileBlob,
  });

  if (!uploadResult.ok) {
    throw new Error(`Failed to upload file: ${uploadResult.statusText}`);
  }

  // Extract the storage ID or URL from the response
  const responseJson = await uploadResult.json();
  const storageId = responseJson.storageId;

  return storageId;
};
