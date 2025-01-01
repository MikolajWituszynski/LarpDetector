import * as React from "react"

const Alert = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={className} role="alert" {...props} />
))
Alert.displayName = "Alert"

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertDescription }