"use client";

import { useRef, useState } from "react";
import { Button, Input, Textarea } from "@heroui/react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Main = () => {
  // Estados para datos de cliente
  const [cliente, setCliente] = useState({
    nombre: "",
    celular: "",
    direccion: "",
    observaciones: "",
  });
  // Estados para productos
  const [producto, setProducto] = useState({
    nombre: "",
    cantidad: "",
    precio: "",
  });
  const [productos, setProductos] = useState<any[]>([]);
  // Estado para total
  const total = productos.reduce(
    (acc, p) => acc + parseFloat(p.cantidad) * parseFloat(p.precio),
    0
  );
  // Ref para el div de la factura
  const facturaRef = useRef<HTMLDivElement>(null);

  // Handlers
  const handleClienteChange = (e: any) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };
  const handleProductoChange = (e: any) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };
  const agregarProducto = () => {
    if (!producto.nombre || !producto.cantidad || !producto.precio) return;
    setProductos([...productos, producto]);
    setProducto({ nombre: "", cantidad: "", precio: "" });
  };
  const eliminarProducto = (idx: number) => {
    setProductos(productos.filter((_, i) => i !== idx));
  };
  const descargarPDF = async () => {
    if (!facturaRef.current) return;
    const canvas = await html2canvas(facturaRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });
    const pageWidth = pdf.internal.pageSize.getWidth();
    // const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("factura.pdf");
  };

  return (
    <main className="flex flex-col items-center w-full py-8">
      <h1 className="font-bold text-2xl text-primary mb-3">Crear factura</h1>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl">
        {/* Formulario */}
        <section className="bg-background rounded-large p-6 flex-1">
          <h2 className="font-semibold text-lg mb-4">Datos del cliente</h2>
          <div className="flex flex-col gap-2 mb-4">
            <Input
              name="nombre"
              value={cliente.nombre}
              onChange={handleClienteChange}
              placeholder="Nombre cliente"
            />
            <Input
              name="celular"
              value={cliente.celular}
              onChange={handleClienteChange}
              placeholder="Celular cliente"
            />
            <Input
              name="direccion"
              value={cliente.direccion}
              onChange={handleClienteChange}
              placeholder="Dirección cliente"
            />
          </div>
          <h2 className="font-semibold text-lg mb-4 mt-6">Agregar producto</h2>
          <div className="flex flex-col gap-2 mb-2">
            <Input
              name="nombre"
              value={producto.nombre}
              onChange={handleProductoChange}
              placeholder="Producto"
            />
            <Input
              name="cantidad"
              value={producto.cantidad}
              onChange={handleProductoChange}
              placeholder="Cantidad"
              type="number"
              min={1}
            />
            <Input
              name="precio"
              value={producto.precio}
              onChange={handleProductoChange}
              placeholder="Precio"
              type="number"
              min={0}
            />
          </div>
          <Button
            color="primary"
            className="w-full mt-2"
            onClick={agregarProducto}
          >
            Agregar producto
          </Button>
          <Textarea
            name="observaciones"
            value={cliente.observaciones}
            onChange={handleClienteChange}
            placeholder="Observaciones de compra"
            className="mt-4"
          />
        </section>

        {/* Factura visual */}
        <section className="bg-background p-6 flex-1" ref={facturaRef}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-default-500">#000001</span>
            <span className="text-xs text-default-500">Fecha: 08/08/2025</span>
          </div>
          <div className="mb-3">
            <div className="text-base font-medium">
              Cliente: {cliente.nombre}
            </div>
            <div className="text-sm">Celular: {cliente.celular || "-"}</div>
            <div className="text-sm">Dirección: {cliente.direccion || "-"}</div>
            <div className="text-sm">Estado: Pendiente</div>
          </div>
          <div className="border-t pt-3 mt-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-1">Producto</th>
                  <th className="py-1">Cantidad</th>
                  <th className="py-1">Precio</th>
                  <th className="py-1">Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {productos.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center text-default-400 py-2"
                    >
                      Sin productos
                    </td>
                  </tr>
                )}
                {productos.map((p, idx) => (
                  <tr key={idx}>
                    <td className="py-1">{p.nombre}</td>
                    <td className="py-1">{p.cantidad}</td>
                    <td className="py-1">
                      ${parseFloat(p.precio).toLocaleString()}
                    </td>
                    <td className="py-1">
                      $
                      {(
                        parseFloat(p.cantidad) * parseFloat(p.precio)
                      ).toLocaleString()}
                    </td>
                    <td className="py-1">
                      <Button
                        size="sm"
                        color="danger"
                        variant="ghost"
                        onClick={() => eliminarProducto(idx)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mt-4">
              <div>
                <div className="text-lg font-bold">
                  Total: ${total.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-xs">Observaciones:</div>
              <div className="text-sm">
                {cliente.observaciones || (
                  <span className="text-default-500">Sin observaciones</span>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
      <Button color="secondary" className="mt-6" onClick={descargarPDF}>
        Descargar factura en PDF
      </Button>
    </main>
  );
};

export default Main;
