"use client";

import { useState, useEffect } from "react";
import saveAs from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { jsPDF } from "jspdf";
import QRCode from "react-qr-code";
import ReactDOMServer from "react-dom/server";
import { useSchoolId } from "@/context/SchoolContext"; // Se obtiene el schoolId desde el contexto
import { fetchStudentsInClient } from "@/app/utils/supabase/students"; // Ajusta la ruta según tu proyecto
import type { Student } from "@/app/types/student";

interface ExportHandlerProps {
  cardConfig: any; // Reemplaza con el tipo real (CardConfig) si lo tienes tipado
  exportFormat: "pdf" | "word" | "zip";
  cardsPerPage: number;
  orientation: "portrait" | "landscape";
}

export const ExportHandler: React.FC<ExportHandlerProps> = ({
  cardConfig,
  exportFormat,
  cardsPerPage,
  orientation,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const schoolId = useSchoolId();
  const [students, setStudents] = useState<Student[]>([]);

  // Recuperar estudiantes al montar el componente
  useEffect(() => {
    if (schoolId) {
      fetchStudentsInClient(schoolId)
        .then((data) => setStudents(data))
        .catch((error) => console.error("Error fetching students:", error));
    }
  }, [schoolId]);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      switch (exportFormat) {
        case "pdf":
          await exportToPDF(cardConfig, cardsPerPage, orientation, students);
          break;
        case "word":
          await exportToWord(cardConfig, cardsPerPage);
          break;
        case "zip":
          await exportToZIP(cardConfig);
          break;
      }
    } catch (error) {
      console.error("Export failed:", error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }

    setIsExporting(false);
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300"
    >
      {isExporting ? "Exportando..." : `Exportar ${exportFormat.toUpperCase()}`}
    </button>
  );
};

/**
 * Exporta a PDF generando una tarjeta para cada estudiante.
 * Se dibuja en un canvas con dimensiones fijas (350×200) para luego escalarlo.
 * Para que el borde se muestre correctamente en la exportación, se multiplica su grosor por el factor de escala.
 */
async function exportToPDF(
  cardConfig: any,
  cardsPerPage: number,
  orientation: "portrait" | "landscape",
  students: Student[]
) {
  const pdf = new jsPDF({
    orientation: orientation,
    unit: "mm",
    format: "a4",
  });

  const pageWidth = orientation === "portrait" ? 210 : 297;
  const pageHeight = orientation === "portrait" ? 297 : 210;
  const cardWidth = 85; // Ancho deseado de la tarjeta en mm
  const margin = 10; // Margen en mm

  const availableWidth = pageWidth - 2 * margin;
  const availableHeight = pageHeight - 2 * margin;

  const cardsPerRow = Math.floor(availableWidth / cardWidth);
  // Calculamos la altura exportada a partir de la relación original 350x200
  const exportCardHeight = cardWidth * (200 / 350);
  const cardsPerColumn = Math.floor(availableHeight / (exportCardHeight + 2));
  const maxCardsPerPage = cardsPerRow * cardsPerColumn;
  const actualCardsPerPage = Math.min(cardsPerPage, maxCardsPerPage);

  // Factor de escala para exportar (canvas.width / cardWidth)
  const exportScaleFactor = 350 / cardWidth; // Por ejemplo, 350/85 ≈ 4.1176

  for (let i = 0; i < students.length; i++) {
    const student = students[i];

    // Renderizar el QR a SVG usando react-qr-code
    const qrSvgString = ReactDOMServer.renderToStaticMarkup(
      <QRCode value={student.identity || ""} />
    );
    const qrDataURL =
      "data:image/svg+xml;charset=utf-8," + encodeURIComponent(qrSvgString);

    const indexOnPage = i % actualCardsPerPage;
    const row = Math.floor(indexOnPage / cardsPerRow);
    const col = indexOnPage % cardsPerRow;
    const x = margin + col * (cardWidth + 2);
    const y = margin + row * (exportCardHeight + 2);

    const canvas = document.createElement("canvas");
    // Usamos las dimensiones de previsualización
    canvas.width = 350;
    canvas.height = 200;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // En exportación, pasamos true y el factor de escala para ajustar el grosor del borde
      await renderCard(ctx, cardConfig, student, qrDataURL, true, exportScaleFactor);
      const imgData = canvas.toDataURL("image/png", 1.0);
      pdf.addImage(imgData, "PNG", x, y, cardWidth, exportCardHeight);
    }

    if ((i + 1) % actualCardsPerPage === 0 && i < students.length - 1) {
      pdf.addPage();
    }
  }

  pdf.save("tarjetas_identificacion_estudiantes.pdf");
}

/**
 * Renderiza en un canvas una tarjeta de identificación según la configuración.
 * Se itera sobre cardConfig.elements y se dibuja cada elemento.
 * Para los elementos de texto se reemplaza el contenido según el id.
 * Además, se dibuja el fondo (con degradado si corresponde) y el borde.
 * @param isExport Indica si se está usando para exportación (para ajustar el grosor del borde).
 * @param scaleFactor Factor de escala que se aplicará al borde en exportación.
 */
async function renderCard(
  ctx: CanvasRenderingContext2D,
  cardConfig: any,
  student: Student,
  qrDataURL: string,
  isExport: boolean = false,
  scaleFactor: number = 1
) {
  // Fondo (degradado o color simple)
  if (cardConfig.backgroundGradient) {
    if (cardConfig.backgroundGradientType === "linear") {
      const gradient = ctx.createLinearGradient(0, 0, 350, 0);
      gradient.addColorStop(0, cardConfig.backgroundGradientStart);
      gradient.addColorStop(1, cardConfig.backgroundGradientEnd);
      ctx.fillStyle = gradient;
    } else if (cardConfig.backgroundGradientType === "radial") {
      const gradient = ctx.createRadialGradient(175, 100, 0, 175, 100, 175);
      gradient.addColorStop(0, cardConfig.backgroundGradientStart);
      gradient.addColorStop(1, cardConfig.backgroundGradientEnd);
      ctx.fillStyle = gradient;
    }
  } else {
    ctx.fillStyle = cardConfig.backgroundColor;
  }
  ctx.fillRect(0, 0, 350, 200);

  // Dibujar cada elemento según la configuración
  for (const element of cardConfig.elements) {
    if (element.type === "logo" && cardConfig.logoUrl) {
      const logoImg = new Image();
      await new Promise<void>((resolve) => {
        logoImg.onload = () => resolve();
        logoImg.src = cardConfig.logoUrl;
      });
      ctx.drawImage(logoImg, element.x, element.y, element.width, element.height);
    } else if (element.type === "text") {
      let textContent = element.content;
      if (element.id === "schoolName") {
        textContent = cardConfig.schoolName;
      } else if (element.id === "studentName") {
        textContent = student.given_name;
      } else if (element.id === "studentId") {
        textContent = student.identity;
      }
      const fontSize = element.style?.fontSize || 14;
      const fontWeight = element.style?.fontWeight || "normal";
      const fontStyle = element.style?.fontStyle || "normal";
      const fontFamily = cardConfig.font || "Arial";
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      ctx.fillStyle = element.style?.color || "#000000";
      ctx.fillText(textContent || "", element.x, element.y + fontSize);
    } else if (element.type === "qr") {
      if (element.id === "qrCode") {
        const qrImg = new Image();
        await new Promise<void>((resolve) => {
          qrImg.onload = () => resolve();
          qrImg.src = qrDataURL;
        });
        ctx.drawImage(qrImg, element.x, element.y, element.width, element.height);
      }
    }
  }

  // Dibujar el borde; si estamos en exportación, multiplicamos el grosor por el factor de escala
  if (cardConfig.borderWidth && cardConfig.borderColor) {
    ctx.beginPath();
    ctx.strokeStyle = cardConfig.borderColor;
    const effectiveLineWidth = isExport
      ? cardConfig.borderWidth * scaleFactor
      : cardConfig.borderWidth;
    ctx.lineWidth = effectiveLineWidth;
    ctx.strokeRect(0, 0, 350, 200);
    ctx.closePath();
  }
}

async function exportToWord(cardConfig: any, cardsPerPage: number) {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [new TextRun("Tarjetas de Identificación Estudiantil")],
          }),
          // Agrega más párrafos para representar cada tarjeta según tus necesidades
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "tarjetas_identificacion_estudiantes.docx");
}

async function exportToZIP(cardConfig: any) {
  const canvas = document.createElement("canvas");
  canvas.width = 350;
  canvas.height = 200;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.fillStyle = cardConfig.backgroundColor;
    ctx.fillRect(0, 0, 350, 200);

    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(cardConfig.schoolName, 10, 30);
    ctx.fillText(cardConfig.studentName, 10, 60);
    ctx.fillText(cardConfig.studentId, 10, 90);
  }

  canvas.toBlob((blob) => {
    if (blob) {
      saveAs(blob, "tarjeta_identificacion_estudiante.png");
    }
  });
}
