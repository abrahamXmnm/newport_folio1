import { useEffect, useRef, useState } from 'react';
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url';

GlobalWorkerOptions.workerSrc = workerSrc;

type Props = { onClose: () => void };

export function MagazineReader({ onClose }: Props) {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [spread, setSpread] = useState(1);
  const [turning, setTurning] = useState(false);
  const [error, setError] = useState(false);
  const leftCanvas = useRef<HTMLCanvasElement>(null);
  const rightCanvas = useRef<HTMLCanvasElement>(null);
  const readerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    getDocument({ url: '/AD-MAGAZINE.pdf' }).promise.then((document) => {
      if (!cancelled) setPdf(document);
    }).catch(() => setError(true));
    document.body.style.overflow = 'hidden';
    return () => { cancelled = true; document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') changeSpread(2);
      if (event.key === 'ArrowLeft') changeSpread(-2);
    };
    window.addEventListener('keydown', closeOnEscape);
    readerRef.current?.focus();
    return () => window.removeEventListener('keydown', closeOnEscape);
  });

  useEffect(() => {
    if (!pdf) return;
    const render = async (pageNumber: number, canvas: HTMLCanvasElement | null) => {
      if (!canvas || pageNumber > pdf.numPages) return;
      const page = await pdf.getPage(pageNumber);
      const base = page.getViewport({ scale: 1 });
      const scale = Math.min(1.6, Math.max(.35, (window.innerWidth < 700 ? window.innerWidth * .76 : window.innerWidth * .36) / base.width));
      const viewport = page.getViewport({ scale });
      const ratio = window.devicePixelRatio || 1;
      canvas.width = viewport.width * ratio;
      canvas.height = viewport.height * ratio;
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;
      await page.render({ canvas, canvasContext: canvas.getContext('2d')!, viewport, transform: [ratio, 0, 0, ratio, 0, 0] }).promise;
    };
    render(spread, leftCanvas.current);
    render(spread + 1, rightCanvas.current);
  }, [pdf, spread]);

  const changeSpread = (amount: number) => {
    if (!pdf || turning) return;
    const next = spread + amount;
    if (next < 1 || next > pdf.numPages) return;
    setTurning(true);
    window.setTimeout(() => { setSpread(next); setTurning(false); }, 360);
  };

  return <div className="magazine-reader" role="dialog" aria-modal="true" aria-labelledby="reader-title" tabIndex={-1} ref={readerRef}><div className="reader-header"><div><span className="reader-kicker">SYNAPSE / READER</span><h2 id="reader-title">AD MAGAZINE</h2></div><button className="reader-close" type="button" onClick={onClose} aria-label="Close magazine reader">CLOSE <span>×</span></button></div><div className={`magazine-book ${turning ? 'is-turning' : ''}`} aria-live="polite">{error ? <div className="reader-error">The magazine preview could not be loaded.</div> : <><div className="magazine-page"><canvas ref={leftCanvas} /></div><div className="magazine-page magazine-page-right"><canvas ref={rightCanvas} /></div></>}</div><div className="reader-controls"><button type="button" onClick={() => changeSpread(-2)} disabled={spread <= 1 || turning} aria-label="Previous pages">← PREVIOUS</button><span>{pdf ? `${spread} — ${Math.min(spread + 1, pdf.numPages)} / ${pdf.numPages}` : 'LOADING PAGES'}</span><button type="button" onClick={() => changeSpread(2)} disabled={!pdf || spread + 1 >= pdf.numPages || turning} aria-label="Next pages">NEXT →</button></div></div>;
}
