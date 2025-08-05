declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | number[]
    filename?: string
    image?: { type?: string; quality?: number }
    html2canvas?: object
    jsPDF?: { unit?: string; format?: string | number[]; orientation?: string }
    pagebreak?: object
    enableLinks?: boolean
  }

  interface Html2Pdf {
    set: (opt: Html2PdfOptions) => Html2Pdf
    from: (element: HTMLElement | string) => Html2Pdf
    toPdf: () => Html2Pdf
    get: (container?: boolean) => Promise<Blob>
    save: () => Promise<void>
    outputPdf: () => unknown
  }

  const html2pdf: () => Html2Pdf

  export default html2pdf
}
