import { format } from 'date-fns'
import html2pdf from 'html2pdf.js'

import { FilePdfIcon } from '@navikt/aksel-icons'
import { Button } from '@navikt/ds-react'

interface Props {
  view: 'enkel' | 'avansert'
}

export const DownloadPDF = ({ view }: Props) => {
  const handleDownload = () => {
    const formattedDate = format(new Date(), 'dd.MM.yyyy')

    // * Clone full body content
    const clone = document.body.cloneNode(true) as HTMLElement

    // * Sanitize ID/class so styles apply correctly
    clone.classList.add('pdf-mode')
    clone.id = 'pdf-clone-wrapper'

    // * Remove the old download button from the clone
    const btn = clone.querySelector('.download-pdf-button')
    btn?.remove()

    // * Create a container for the clone
    const container = document.createElement('div')
    container.style.position = 'absolute'
    container.style.top = '0'
    container.style.left = '0'
    container.style.width = '100vw'
    container.style.zIndex = '-1' // Ensure it's not visible
    container.appendChild(clone)
    document.body.appendChild(container)

    // * Generate the PDF
    html2pdf()
      .set({
        margin: 0.5,
        filename: `Beregning_${view}_${formattedDate}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      })
      .from(clone)
      .save()
      .finally(() => {
        container.remove()
      })
  }

  return (
    <Button
      type="button"
      onClick={handleDownload}
      aria-label="Last ned PDF"
      className="download-pdf-button"
      icon={<FilePdfIcon title="Last ned PDF" />}
    >
      Last ned PDF
    </Button>
  )
}
