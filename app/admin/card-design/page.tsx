"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import QRCode from "react-qr-code"; // Se usa react-qr-code
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ExportHandler } from "./ExportHandler";

// Tipos específicos para algunos estilos
type FontWeight =
  | "normal"
  | "bold"
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900";

interface TextStyle {
  color: string;
  fontSize: number;
  fontWeight: FontWeight;
  fontStyle: "normal" | "italic";
  textDecoration: "none" | "underline" | "overline" | "line-through";
  textTransform: "none" | "uppercase" | "lowercase" | "capitalize";
}

interface CardElement {
  id: string;
  type: "logo" | "text" | "qr";
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  style?: TextStyle;
}

interface CardConfig {
  backgroundColor: string;
  backgroundGradient: boolean;
  backgroundGradientType: "linear" | "radial";
  backgroundGradientStart: string;
  backgroundGradientEnd: string;
  backgroundGradientDegree: number;
  logoUrl: string;
  schoolName: string;
  studentName: string;
  studentId: string;
  qrValue: string;
  font: string;
  borderRadius: number;
  borderColor: string;
  borderWidth: number;
  elements: CardElement[];
}

const fonts = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Courier",
  "Verdana",
  "Georgia",
  "Palatino",
  "Garamond",
  "Bookman",
  "Comic Sans MS",
  "Trebuchet MS",
  "Arial Black",
  "Impact",
];

const fontWeights: FontWeight[] = [
  "normal",
  "bold",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
];
const fontStyles = ["normal", "italic"];
const textDecorations = ["none", "underline", "overline", "line-through"];
const textTransforms = ["none", "uppercase", "lowercase", "capitalize"];

// Objeto de estilo por defecto para elementos de texto
const defaultTextStyle: TextStyle = {
  color: "#000000",
  fontSize: 14,
  fontWeight: "normal",
  fontStyle: "normal",
  textDecoration: "none",
  textTransform: "none",
};

export default function CardDesignPage() {
  const [cardConfig, setCardConfig] = useState<CardConfig>({
    backgroundColor: "#ffffff",
    backgroundGradient: false,
    backgroundGradientType: "linear",
    backgroundGradientStart: "#ffffff",
    backgroundGradientEnd: "#f0f0f0",
    backgroundGradientDegree: 45,
    logoUrl: "",
    schoolName: "Escuela de Ejemplo",
    studentName: "John Doe",
    studentId: "12345",
    qrValue: "https://lazarus.com.pe",
    font: "Arial",
    borderRadius: 8,
    borderColor: "#000000",
    borderWidth: 1,
    elements: [
      { id: "logo", type: "logo", x: 10, y: 10, width: 80, height: 80 },
      {
        id: "schoolName",
        type: "text",
        x: 100,
        y: 20,
        width: 200,
        height: 30,
        content: "Nombre de la Escuela",
        style: {
          ...defaultTextStyle,
          fontSize: 18,
          fontWeight: "bold",
        },
      },
      {
        id: "studentName",
        type: "text",
        x: 10,
        y: 100,
        width: 200,
        height: 30,
        content: "Nombre del Estudiante",
        style: {
          ...defaultTextStyle,
          fontSize: 16,
        },
      },
      {
        id: "studentId",
        type: "text",
        x: 10,
        y: 130,
        width: 200,
        height: 30,
        content: "ID del Estudiante",
        style: {
          ...defaultTextStyle,
          fontSize: 14,
        },
      },
      {
        id: "qrCode",
        type: "qr",
        x: 200,
        y: 100,
        width: 100,
        height: 100,
      },
    ],
  });

  const [activeTextElement, setActiveTextElement] = useState("schoolName");
  const [isDragging, setIsDragging] = useState(false);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const cardPreviewRef = useRef<HTMLDivElement>(null);
  const [showGrid, setShowGrid] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [exportFormat, setExportFormat] = useState<"pdf" | "word" | "zip">("pdf");
  const [cardsPerPage, setCardsPerPage] = useState(4);
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");

  const handleConfigChange = (key: string, value: any) => {
    setCardConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleElementChange = (id: string, changes: Partial<CardElement>) => {
    setCardConfig((prev) => ({
      ...prev,
      elements: prev.elements.map((el) =>
        el.id === id
          ? {
              ...el,
              ...changes,
              ...(el.type === "text"
                ? {
                    style: {
                      ...defaultTextStyle,
                      ...(el.style || {}),
                      ...(changes.style || {}),
                    },
                  }
                : {}),
            }
          : el
      ),
    }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCardConfig((prev) => ({ ...prev, logoUrl: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>, elementId: string) => {
    event.stopPropagation();
    setIsDragging(true);
    setDraggedElement(elementId);
    const element = cardConfig.elements.find((el) => el.id === elementId);
    if (element && cardPreviewRef.current) {
      const rect = cardPreviewRef.current.getBoundingClientRect();
      setDragOffset({
        x: event.clientX - rect.left - element.x,
        y: event.clientY - rect.top - element.y,
      });
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !draggedElement || !cardPreviewRef.current) return;

    const rect = cardPreviewRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(350 - 10, event.clientX - rect.left - dragOffset.x));
    const y = Math.max(0, Math.min(200 - 10, event.clientY - rect.top - dragOffset.y));

    setCardConfig((prev) => ({
      ...prev,
      elements: prev.elements.map((el) => (el.id === draggedElement ? { ...el, x, y } : el)),
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedElement(null);
  };

  const handleOrientationChange = (newOrientation: "portrait" | "landscape") => {
    setOrientation(newOrientation);
    if (newOrientation === "portrait" && cardsPerPage > 8) {
      setCardsPerPage(8);
    }
  };

  const CardPreview = ({ isLayoutPreview = false }: { isLayoutPreview?: boolean }) => (
    <div
      ref={cardPreviewRef}
      style={{
        width: "350px",
        height: "200px",
        background: cardConfig.backgroundGradient
          ? cardConfig.backgroundGradientType === "linear"
            ? `linear-gradient(${cardConfig.backgroundGradientDegree}deg, ${cardConfig.backgroundGradientStart}, ${cardConfig.backgroundGradientEnd})`
            : `radial-gradient(circle, ${cardConfig.backgroundGradientStart}, ${cardConfig.backgroundGradientEnd})`
          : cardConfig.backgroundColor,
        fontFamily: cardConfig.font,
        position: "relative",
        border: `${cardConfig.borderWidth}px solid ${cardConfig.borderColor}`,
        borderRadius: `${cardConfig.borderRadius}px`,
        overflow: "hidden",
      }}
      className="relative"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {isLayoutPreview && showGrid && (
        <div
          className="bg-grid-pattern"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        />
      )}
      {cardConfig.elements.map((element) => (
        <div
          key={element.id}
          style={{
            position: "absolute",
            left: element.x,
            top: element.y,
            width: element.width,
            height: element.height,
            border: isLayoutPreview ? "1px dashed #000" : "none",
            background: isLayoutPreview ? "rgba(0,0,0,0.1)" : "none",
            cursor: isLayoutPreview ? "move" : "default",
            userSelect: "none",
          }}
          onMouseDown={(e) => isLayoutPreview && handleMouseDown(e, element.id)}
        >
          {element.type === "logo" && cardConfig.logoUrl && (
            <img
              src={cardConfig.logoUrl || "/placeholder.svg"}
              alt="Logo de la escuela"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          )}
          {element.type === "text" && element.style && (
            <span
              style={{
                color: element.style.color,
                fontSize: `${element.style.fontSize}px`,
                fontWeight: element.style.fontWeight,
                fontStyle: element.style.fontStyle,
                textDecoration: element.style.textDecoration,
                textTransform: element.style.textTransform,
              }}
            >
              {element.content}
            </span>
          )}
          {element.type === "qr" && (
            // Para ajustar el tamaño del QR en la previsualización, se reduce al 80% de su valor configurado.
            <div style={{ width: element.width, height: element.height }}>
              <QRCode value={cardConfig.qrValue} size={element.width * 0.8} />
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const TextStyleEditor = ({ element }: { element: CardElement }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${element.id}-color`}>Color</Label>
          <div className="flex items-center mt-1">
            <div
              className="w-6 h-6 rounded border mr-2"
              style={{ backgroundColor: element.style?.color || defaultTextStyle.color }}
            />
            <Input
              id={`${element.id}-color`}
              type="color"
              value={element.style?.color || defaultTextStyle.color}
              onChange={(e) =>
                handleElementChange(element.id, {
                  style: { ...defaultTextStyle, ...(element.style || {}), color: e.target.value },
                })
              }
              className="w-full"
            />
          </div>
        </div>
        <div>
          <Label htmlFor={`${element.id}-fontSize`}>Tamaño de fuente</Label>
          <Input
            id={`${element.id}-fontSize`}
            type="number"
            value={element.style?.fontSize ?? defaultTextStyle.fontSize}
            onChange={(e) =>
              handleElementChange(element.id, {
                style: {
                  ...defaultTextStyle,
                  ...(element.style || {}),
                  fontSize: Number(e.target.value),
                },
              })
            }
            className="mt-1"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${element.id}-fontWeight`}>Peso de fuente</Label>
          <Select
            onValueChange={(value) =>
              handleElementChange(element.id, {
                style: {
                  ...defaultTextStyle,
                  ...(element.style || {}),
                  fontWeight: value as FontWeight,
                },
              })
            }
            value={element.style?.fontWeight || defaultTextStyle.fontWeight}
          >
            <SelectTrigger id={`${element.id}-fontWeight`}>
              <SelectValue placeholder="Seleccionar peso de fuente" />
            </SelectTrigger>
            <SelectContent>
              {fontWeights.map((weight) => (
                <SelectItem key={weight} value={weight}>
                  {weight}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor={`${element.id}-fontStyle`}>Estilo de fuente</Label>
          <Select
            onValueChange={(value) =>
              handleElementChange(element.id, {
                style: {
                  ...defaultTextStyle,
                  ...(element.style || {}),
                  fontStyle: value as "normal" | "italic",
                },
              })
            }
            value={element.style?.fontStyle || defaultTextStyle.fontStyle}
          >
            <SelectTrigger id={`${element.id}-fontStyle`}>
              <SelectValue placeholder="Seleccionar estilo de fuente" />
            </SelectTrigger>
            <SelectContent>
              {fontStyles.map((style) => (
                <SelectItem key={style} value={style}>
                  {style}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${element.id}-textDecoration`}>Decoración de texto</Label>
          <Select
            onValueChange={(value) =>
              handleElementChange(element.id, {
                style: {
                  ...defaultTextStyle,
                  ...(element.style || {}),
                  textDecoration: value as "none" | "underline" | "overline" | "line-through",
                },
              })
            }
            value={element.style?.textDecoration || defaultTextStyle.textDecoration}
          >
            <SelectTrigger id={`${element.id}-textDecoration`}>
              <SelectValue placeholder="Seleccionar decoración de texto" />
            </SelectTrigger>
            <SelectContent>
              {textDecorations.map((decoration) => (
                <SelectItem key={decoration} value={decoration}>
                  {decoration}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor={`${element.id}-textTransform`}>Transformación de texto</Label>
          <Select
            onValueChange={(value) =>
              handleElementChange(element.id, {
                style: {
                  ...defaultTextStyle,
                  ...(element.style || {}),
                  textTransform: value as "none" | "uppercase" | "lowercase" | "capitalize",
                },
              })
            }
            value={element.style?.textTransform || defaultTextStyle.textTransform}
          >
            <SelectTrigger id={`${element.id}-textTransform`}>
              <SelectValue placeholder="Seleccionar transformación de texto" />
            </SelectTrigger>
            <SelectContent>
              {textTransforms.map((transform) => (
                <SelectItem key={transform} value={transform}>
                  {transform}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const ExportPreview = () => {
    if (exportFormat === "zip") {
      return (
        <div className="text-center p-4 border rounded">
          <p>La exportación ZIP contendrá archivos PNG individuales para cada tarjeta.</p>
        </div>
      );
    }

    const pageWidth = orientation === "portrait" ? 210 : 297; // Ancho A4 en mm
    const pageHeight = orientation === "portrait" ? 297 : 210; // Alto A4 en mm
    const cardWidth = 85; // Ancho de la tarjeta en mm
    const exportCardHeight = cardWidth * (200 / 350); // Mantener la proporción
    const margin = 10; // Margen en mm

    const availableWidth = pageWidth - 2 * margin;
    const availableHeight = pageHeight - 2 * margin;

    const cardsPerRow = Math.floor(availableWidth / cardWidth);
    const cardsPerColumn = Math.floor(availableHeight / exportCardHeight);
    const maxCardsPerPage = cardsPerRow * cardsPerColumn;
    const actualCardsPerPage = Math.min(cardsPerPage, maxCardsPerPage);

    const containerWidth = 400; // Contenedor fijo en píxeles
    const scaleFactor = containerWidth / pageWidth;

    return (
      <div
        className="border rounded relative bg-white mx-auto overflow-hidden"
        style={{
          width: `${pageWidth * scaleFactor}px`,
          height: `${pageHeight * scaleFactor}px`,
        }}
      >
        <div
          className="absolute"
          style={{
            top: `${margin * scaleFactor}px`,
            left: `${margin * scaleFactor}px`,
            width: `${availableWidth * scaleFactor}px`,
            height: `${availableHeight * scaleFactor}px`,
            display: "grid",
            gridTemplateColumns: `repeat(${cardsPerRow}, 1fr)`,
            gridTemplateRows: `repeat(${Math.ceil(actualCardsPerPage / cardsPerRow)}, 1fr)`,
            gap: `${2 * scaleFactor}px`,
          }}
        >
          {Array.from({ length: actualCardsPerPage }).map((_, index) => (
            <div
              key={index}
              style={{
                width: `${cardWidth * scaleFactor}px`,
                height: `${exportCardHeight * scaleFactor}px`,
                transform: `scale(${(cardWidth * scaleFactor) / 350})`,
                transformOrigin: "top left",
              }}
            >
              <CardPreview />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Diseñador de Tarjetas de Identificación Estudiantil</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Vista previa</h2>
            <CardPreview />
            <Button className="mt-4 w-full">Guardar diseño</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Configuraciones</h2>
            <Tabs defaultValue="general">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="text">Texto</TabsTrigger>
                <TabsTrigger value="layout">Diseño</TabsTrigger>
                <TabsTrigger value="advanced">Avanzado</TabsTrigger>
              </TabsList>
              <TabsContent value="general">
                <div className="space-y-4">
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <Label htmlFor="backgroundGradient">Usar fondo degradado</Label>
                      <div className="flex items-center mt-1">
                        <Switch
                          id="backgroundGradient"
                          checked={cardConfig.backgroundGradient}
                          onCheckedChange={(checked) => handleConfigChange("backgroundGradient", checked)}
                        />
                      </div>
                    </div>
                    {cardConfig.backgroundGradient && (
                      <div className="flex-1">
                        <Label htmlFor="backgroundGradientType">Tipo de degradado</Label>
                        <Select
                          onValueChange={(value) => handleConfigChange("backgroundGradientType", value)}
                          value={cardConfig.backgroundGradientType}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo de degradado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="linear">Lineal</SelectItem>
                            <SelectItem value="radial">Radial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                  {cardConfig.backgroundGradient ? (
                    <div className="space-y-4">
                      <div className="flex space-x-4">
                        <div className="flex-1">
                          <Label htmlFor="backgroundGradientStart">Inicio del degradado</Label>
                          <div className="flex items-center mt-1">
                            <div
                              className="w-6 h-6 rounded border mr-2"
                              style={{ backgroundColor: cardConfig.backgroundGradientStart }}
                            />
                            <Input
                              id="backgroundGradientStart"
                              type="color"
                              value={cardConfig.backgroundGradientStart}
                              onChange={(e) => handleConfigChange("backgroundGradientStart", e.target.value)}
                              className="w-full"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <Label htmlFor="backgroundGradientEnd">Fin del degradado</Label>
                          <div className="flex items-center mt-1">
                            <div
                              className="w-6 h-6 rounded border mr-2"
                              style={{ backgroundColor: cardConfig.backgroundGradientEnd }}
                            />
                            <Input
                              id="backgroundGradientEnd"
                              type="color"
                              value={cardConfig.backgroundGradientEnd}
                              onChange={(e) => handleConfigChange("backgroundGradientEnd", e.target.value)}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>
                      {cardConfig.backgroundGradientType === "linear" && (
                        <div>
                          <Label htmlFor="backgroundGradientDegree">
                            Ángulo del degradado: {cardConfig.backgroundGradientDegree}°
                          </Label>
                          <Slider
                            id="backgroundGradientDegree"
                            min={0}
                            max={360}
                            step={1}
                            value={[cardConfig.backgroundGradientDegree]}
                            onValueChange={(value) => handleConfigChange("backgroundGradientDegree", value[0])}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor="backgroundColor">Color de fondo</Label>
                      <div className="flex items-center mt-1">
                        <div
                          className="w-6 h-6 rounded border mr-2"
                          style={{ backgroundColor: cardConfig.backgroundColor }}
                        />
                        <Input
                          id="backgroundColor"
                          type="color"
                          value={cardConfig.backgroundColor}
                          onChange={(e) => handleConfigChange("backgroundColor", e.target.value)}
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    <Label htmlFor="logo">Logo de la escuela</Label>
                    <Input id="logo" type="file" accept="image/*" onChange={handleLogoUpload} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="schoolName">Nombre de la escuela</Label>
                    <Input
                      id="schoolName"
                      type="text"
                      value={cardConfig.schoolName}
                      onChange={(e) => handleConfigChange("schoolName", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="qrValue">Valor del código QR</Label>
                    <Input
                      id="qrValue"
                      type="text"
                      value={cardConfig.qrValue}
                      onChange={(e) => handleConfigChange("qrValue", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="text">
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    {cardConfig.elements
                      .filter((el) => el.type === "text")
                      .map((element) => (
                        <Button
                          key={element.id}
                          onClick={() => setActiveTextElement(element.id)}
                          variant={activeTextElement === element.id ? "default" : "outline"}
                        >
                          {element.content}
                        </Button>
                      ))}
                  </div>
                  {cardConfig.elements
                    .filter((el) => el.type === "text" && el.id === activeTextElement)
                    .map((element) => (
                      <TextStyleEditor key={element.id} element={element} />
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="layout">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="show-grid" checked={showGrid} onCheckedChange={setShowGrid} />
                    <Label htmlFor="show-grid">Mostrar cuadrícula</Label>
                  </div>
                  <div
                    className="border p-4 rounded-lg"
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    <h3 className="text-lg font-semibold mb-2">Vista previa del diseño</h3>
                    <CardPreview isLayoutPreview={true} />
                  </div>
                  <p className="text-sm text-gray-500">
                    Arrastra y suelta los elementos para ajustar su posición en la tarjeta.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="advanced">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="borderRadius">Radio del borde: {cardConfig.borderRadius}px</Label>
                    <Slider
                      id="borderRadius"
                      min={0}
                      max={20}
                      step={1}
                      value={[cardConfig.borderRadius]}
                      onValueChange={(value) => handleConfigChange("borderRadius", value[0])}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="borderColor">Color del borde</Label>
                    <div className="flex items-center mt-1">
                      <div
                        className="w-6 h-6 rounded border mr-2"
                        style={{ backgroundColor: cardConfig.borderColor }}
                      />
                      <Input
                        id="borderColor"
                        type="color"
                        value={cardConfig.borderColor}
                        onChange={(e) => handleConfigChange("borderColor", e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="borderWidth">Ancho del borde: {cardConfig.borderWidth}px</Label>
                    <Slider
                      id="borderWidth"
                      min={0}
                      max={10}
                      step={1}
                      value={[cardConfig.borderWidth]}
                      onValueChange={(value) => handleConfigChange("borderWidth", value[0])}
                      className="mt-1"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Opciones de exportación</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="exportFormat">Formato de exportación</Label>
                <RadioGroup
                  id="exportFormat"
                  value={exportFormat}
                  onValueChange={(value) => setExportFormat(value as "pdf" | "word" | "zip")}
                  className="flex space-x-4 mt-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pdf" id="pdf" />
                    <Label htmlFor="pdf">PDF</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="word" id="word" />
                    <Label htmlFor="word">Word</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="zip" id="zip" />
                    <Label htmlFor="zip">ZIP (PNG)</Label>
                  </div>
                </RadioGroup>
              </div>

              {(exportFormat === "pdf" || exportFormat === "word") && (
                <>
                  <div>
                    <Label htmlFor="orientation">Orientación</Label>
                    <RadioGroup
                      id="orientation"
                      value={orientation}
                      onValueChange={(value) => handleOrientationChange(value as "portrait" | "landscape")}
                      className="flex space-x-4 mt-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="portrait" id="portrait" />
                        <Label htmlFor="portrait">Vertical</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="landscape" id="landscape" />
                        <Label htmlFor="landscape">Horizontal</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="cardsPerPage">Tarjetas por página: {cardsPerPage}</Label>
                    <Slider
                      id="cardsPerPage"
                      min={1}
                      max={orientation === "landscape" ? 9 : 8}
                      step={1}
                      value={[cardsPerPage]}
                      onValueChange={(value) => setCardsPerPage(value[0])}
                      className="mt-1"
                    />
                  </div>
                </>
              )}

              <Separator className="my-4" />

              <div>
                <h3 className="text-lg font-semibold mb-2">Vista previa de exportación</h3>
                <ExportPreview />
              </div>

              <ExportHandler
                cardConfig={cardConfig}
                exportFormat={exportFormat}
                cardsPerPage={cardsPerPage}
                orientation={orientation}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
