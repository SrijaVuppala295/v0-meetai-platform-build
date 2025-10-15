import { NextResponse, type NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { fileUrl, fileType } = await req.json()
    if (!fileUrl) {
      return NextResponse.json({ error: "fileUrl is required" }, { status: 400 })
    }

    // Fetch the uploaded file
    const res = await fetch(fileUrl)
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch uploaded file" }, { status: 400 })
    }

    const arrayBuf = await res.arrayBuffer()
    const buf = Buffer.from(arrayBuf)

    // Handle based on mime or extension hint
    const type = (fileType || "").toLowerCase()

    // text/plain
    if (type.includes("text/plain") || fileUrl.toLowerCase().endsWith(".txt")) {
      const text = buf.toString("utf8")
      return NextResponse.json({ text })
    }

    // application/pdf
    if (type.includes("application/pdf") || fileUrl.toLowerCase().endsWith(".pdf")) {
      // Lazy import to keep cold starts small
      const pdfParse = (await import("pdf-parse")).default
      const data = await pdfParse(buf)
      return NextResponse.json({ text: data.text || "" })
    }

    // application/msword or docx
    if (
      type.includes("application/msword") ||
      type.includes("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
      fileUrl.toLowerCase().endsWith(".doc") ||
      fileUrl.toLowerCase().endsWith(".docx")
    ) {
      // Use mammoth for DOCX; for .doc we still attempt (mammoth works best with .docx)
      const mammoth = await import("mammoth")
      const result = await mammoth.extractRawText({ buffer: buf })
      return NextResponse.json({ text: result.value || "" })
    }

    // Fallback: return empty text with message
    return NextResponse.json({ text: "" })
  } catch (err) {
    console.error("[v0] Extract error:", (err as Error).message)
    return NextResponse.json({ error: "Failed to extract text" }, { status: 500 })
  }
}
