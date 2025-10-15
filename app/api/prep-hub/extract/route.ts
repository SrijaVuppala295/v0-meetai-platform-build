import { NextResponse, type NextRequest } from "next/server"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || ""

    // Branch 1: multipart/form-data (direct file upload)
    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData()
      const file = form.get("file")
      if (!(file instanceof File)) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 })
      }
      const buf = Buffer.from(await file.arrayBuffer())
      const name = (file.name || "").toLowerCase()
      let type = (file.type || "").toLowerCase()
      if (!type || type === "application/octet-stream") {
        if (name.endsWith(".txt")) type = "text/plain"
        else if (name.endsWith(".pdf")) type = "application/pdf"
        else if (name.endsWith(".doc")) type = "application/msword"
        else if (name.endsWith(".docx"))
          type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      }

      if (type.includes("text/plain") || name.endsWith(".txt")) {
        return NextResponse.json({ text: buf.toString("utf8") })
      }

      if (type.includes("application/pdf") || name.endsWith(".pdf")) {
        const pdfParse = (await import("pdf-parse")).default
        const data = await pdfParse(buf)
        return NextResponse.json({ text: data.text || "" })
      }

      if (
        type.includes("application/msword") ||
        type.includes("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
        name.endsWith(".doc") ||
        name.endsWith(".docx")
      ) {
        const mammoth = await import("mammoth")
        const result = await mammoth.extractRawText({ buffer: buf })
        return NextResponse.json({ text: result.value || "" })
      }

      return NextResponse.json({ error: "Unsupported file type. Please upload PDF, DOCX, or TXT." }, { status: 415 })
    }

    // Branch 2: JSON payload (UploadThing URL)
    const { fileUrl, fileType } = await req.json().catch(() => ({}) as any)
    if (!fileUrl) {
      return NextResponse.json({ error: "fileUrl is required" }, { status: 400 })
    }

    const res = await fetch(fileUrl, { cache: "no-store" }) // avoid cached blobs
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch uploaded file" }, { status: 400 })
    }

    const arrayBuf = await res.arrayBuffer()
    const buf = Buffer.from(arrayBuf)
    const lowerUrl = fileUrl.toLowerCase()
    let type = (fileType || "").toLowerCase()
    if (!type || type === "application/octet-stream") {
      if (lowerUrl.endsWith(".txt")) type = "text/plain"
      else if (lowerUrl.endsWith(".pdf")) type = "application/pdf"
      else if (lowerUrl.endsWith(".doc")) type = "application/msword"
      else if (lowerUrl.endsWith(".docx"))
        type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    }

    if (type.includes("text/plain") || lowerUrl.endsWith(".txt")) {
      return NextResponse.json({ text: buf.toString("utf8") })
    }

    if (type.includes("application/pdf") || lowerUrl.endsWith(".pdf")) {
      const pdfParse = (await import("pdf-parse")).default
      const data = await pdfParse(buf)
      return NextResponse.json({ text: data.text || "" })
    }

    if (
      type.includes("application/msword") ||
      type.includes("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
      lowerUrl.endsWith(".doc") ||
      lowerUrl.endsWith(".docx")
    ) {
      const mammoth = await import("mammoth")
      const result = await mammoth.extractRawText({ buffer: buf })
      return NextResponse.json({ text: result.value || "" })
    }

    return NextResponse.json({ error: "Unsupported file type. Please upload PDF, DOCX, or TXT." }, { status: 415 })
  } catch (err) {
    console.error("[v0] Extract error:", (err as Error).message)
    return NextResponse.json({ error: "Failed to extract text" }, { status: 500 })
  }
}
