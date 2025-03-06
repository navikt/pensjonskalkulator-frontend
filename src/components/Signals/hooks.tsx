import { useEffect } from 'react'

const useSignals = (ready: boolean) => {
  useEffect(() => {
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://widget.uxsignals.com/embed.js'
    if (ready) {
      document.body.appendChild(script)
    }

    return () => {
      try {
        document.body.removeChild(script)
      } catch (error) {
        console.error('Error removing script', error)
      }
    }
  }, [ready])
}

export default useSignals
