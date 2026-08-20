"use client"

import imageCompression from "browser-image-compression"

import { createUploadIntentAction } from "@/lib/storage/upload.action"

type UploadOptions = {
  contentType?: string
}

const COMPRESSIBLE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"])

async function maybeCompress(file: File, contentType: string): Promise<File> {
  if (!COMPRESSIBLE_TYPES.has(contentType)) return file

  try {
    return await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      initialQuality: 0.8,
    })
  } catch {
    return file
  }
}

/**
 * Upload to Cloudflare R2 via presigned PUT.
 * Returns the object key — persist that in the DB, not a public URL.
 */
export async function uploadFile(
  file: File,
  _legacyPath: string,
  options?: UploadOptions
): Promise<string> {
  const contentType = options?.contentType || file.type || "application/octet-stream"
  const extension = file.name.split(".").pop() ?? "bin"

  const compressedFile = await maybeCompress(file, contentType)

  const result = await createUploadIntentAction({
    contentType: contentType as
      | "image/jpeg"
      | "image/png"
      | "image/webp"
      | "image/gif",
    contentLength: compressedFile.size,
    folder: "users",
    extension,
  })

  if (!result?.data?.success) {
    throw new Error(result?.serverError ?? "Failed to create upload intent")
  }

  const { uploadUrl, key } = result.data
  const response = await fetch(uploadUrl, {
    method: "PUT",
    body: compressedFile,
    headers: {
      "Content-Type": contentType,
    },
  })

  if (!response.ok) {
    throw new Error(`Upload failed with status ${response.status}`)
  }

  return key
}
