import React from 'react'

interface IKalkulatorRedirectProps {
  fnr: string
}
export const KalkulatorRedirect: React.FC<IKalkulatorRedirectProps> = ({
  fnr,
}) => {
  const formRef = React.useRef<HTMLFormElement>(null)
  React.useEffect(() => {
    if (formRef.current) {
      formRef.current.submit()
    }
  }, [])

  return (
    <div>
      <form
        ref={formRef}
        action="/pensjon/kalkulator/redirect/detaljert-kalkulator"
        method="POST"
      >
        <input type="hidden" name="fnr" value={fnr} />
      </form>
    </div>
  )
}
