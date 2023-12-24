import { Injectable } from "@nestjs/common";
import { readFileSync, unlinkSync, writeFileSync } from "fs";
import { join } from "path";
import Handlebars from "handlebars";
import puppeteer, { PDFOptions } from "puppeteer";
import { random } from "radash";

@Injectable()
export class PdfService {
  async generatePDF(htmlFilePath: string, options: PDFOptions) {
    const browser = await puppeteer.launch({
      headless: "new",
    });
    const page = await browser.newPage();
    await page.goto(`file://${htmlFilePath}`, {
      waitUntil: "networkidle0",
    });
    const pdf = await page.pdf(options);
    await browser.close();
    return pdf;
  }

  getDocumentContent(name: string) {
    const source = readFileSync(
      join(__dirname, `../../templates/${name}.hbs`),
      { encoding: "utf8" },
    );

    const template = Handlebars.compile(source);

    const invoiceData = {
      companyName: "NestJS PDF",
      customerName: "Johan Sierra",
      customerEmail: "johan@test.com",
      date: "12 de diciembre del 2013",
      invoiceId: 1,
      total: 175,
      products: Array.from({ length: 50 }).map((_, index) => {
        return {
          name: `Producto ${index + 1}`,
          price: random(0, 100) * 100 * index + 1,
        };
      }),
    };

    return template(invoiceData);
  }

  async getDocument(name: string) {
    const contentDocument = this.getDocumentContent(name);
    const htmlFilePath = join(__dirname, `../../templates/${name}.html`);

    // Guarda el contenido en un archivo HTML temporal
    writeFileSync(htmlFilePath, contentDocument);

    const pdf = await this.generatePDF(htmlFilePath, {
      format: "A4",
    });

    unlinkSync(htmlFilePath);

    return pdf;
  }
}
