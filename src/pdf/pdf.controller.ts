import { Controller, Get, Param, Response } from "@nestjs/common";
import { PdfService } from "./pdf.service";

@Controller("pdf")
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}
  @Get("")
  async index(@Response() res) {
    res
      .status(200)
      .send("Bienvenido al sistema de generación de documentos. (PDF)");
  }

  @Get(":docId")
  async getDocumentById(@Param("docId") docId: string, @Response() res) {
    try {
      const documentBuffer = await this.pdfService.getDocument(docId);

      if (documentBuffer) {
        res
          .set("Content-Type", "application/octet-stream")
          .set("Content-Disposition", `inline; filename="${docId}.pdf"`)
          .send(documentBuffer);
      } else {
        res.status(404).send("Documento no encontrado");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Error interno del servidor");
    }
  }
}
