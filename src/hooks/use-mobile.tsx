
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Set initial value
    checkIfMobile()
    
    // Add event listener to update on resize
    window.addEventListener("resize", checkIfMobile)
    
    // Create a media query list and add listener
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    mql.addEventListener("change", checkIfMobile)
    
    return () => {
      window.removeEventListener("resize", checkIfMobile)
      mql.removeEventListener("change", checkIfMobile)
    }
  }, [])

  // Return false as fallback during SSR
  return isMobile === null ? false : isMobile
}
