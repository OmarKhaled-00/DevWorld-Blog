import { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url,
).toString();

function PdfPreview({ url }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const renderPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;

        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.4 });

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;
      } catch (err) {
        console.error("PDF render error:", err);
      }
    };

    renderPdf();
  }, [url]);

  return (
    <div className="w-full rounded-xl border border-gray-300 bg-white p-2 shadow-sm">
      <canvas ref={canvasRef} className="w-full rounded-lg" />
    </div>
  );
}

export default PdfPreview;
